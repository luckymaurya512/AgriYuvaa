import webpush from "web-push";
import dotenv from "dotenv";
import SeekerProfile from "../models/SeekerProfile.js";
import Notification from "../models/Notification.js";
import sendEmail from "./sendEmail.js";

dotenv.config();

// Public & Private VAPID keys for AgriYuvaa Web Push
const vapidPublicKey =
  process.env.VAPID_PUBLIC_KEY ||
  "BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBKr3qBUYIhbQFLXYp5Nksh8U";
const vapidPrivateKey =
  process.env.VAPID_PRIVATE_KEY ||
  "8vFh3q4o1kQ_9bL7J_vK5x2z8R1t9m4P6e3d2w1s5A0";
const vapidEmail = process.env.VAPID_EMAIL || "mailto:support@agriyuvaa.com";

webpush.setVapidDetails(vapidEmail, vapidPublicKey, vapidPrivateKey);

/**
 * Sends a web push notification to a single browser subscription
 */
export const sendPushNotification = async (subscription, payload) => {
  try {
    if (!subscription || !subscription.endpoint) return null;
    return await webpush.sendNotification(subscription, JSON.stringify(payload));
  } catch (err) {
    // Subscription expired or invalid (410 Gone / 404 Not Found)
    if (err.statusCode === 410 || err.statusCode === 404) {
      // Auto-prune dead subscription from DB
      await SeekerProfile.updateOne(
        { "pushSubscriptions.endpoint": subscription.endpoint },
        { $pull: { pushSubscriptions: { endpoint: subscription.endpoint } } }
      ).catch(() => {});
    }
    return null;
  }
};

/**
 * Broadcasts notification (Web Push + In-App Notification + Brevo Email)
 * to all job seekers following the employer who posted the job.
 */
export const broadcastNewJobAlert = async (job, employerProfile) => {
  try {
    const employerProfileId = employerProfile?._id;
    const employerUserId = job.employer;
    const companyName = job.companyName || employerProfile?.companyName || "An agriculture employer";

    // 1. Find all seekers who follow this employer
    const matchingProfiles = await SeekerProfile.find({
      $or: [
        { followedEmployers: employerProfileId },
        { followedEmployers: employerUserId },
      ],
    }).populate("user", "name email");

    if (!matchingProfiles || matchingProfiles.length === 0) return;

    const pushPayload = {
      title: `🌾 New Job: ${job.title}`,
      body: `${companyName} just posted a new opening in ${job.location || "India"}. Tap to view & apply!`,
      icon: "/logo.png",
      badge: "/logo.png",
      data: {
        url: `/jobs/${job._id}`,
      },
    };

    for (const profile of matchingProfiles) {
      const recipientUser = profile.user;
      if (!recipientUser) continue;

      // A. Create In-App Notification
      await Notification.create({
        recipient: recipientUser._id,
        title: `🌾 New opening from ${companyName}`,
        message: `${job.title} (${job.employmentType}) in ${job.location}`,
        link: `/jobs/${job._id}`,
        type: "new_job",
      }).catch(() => {});

      // B. Send Web Push to all devices of this user
      if (profile.pushSubscriptions && profile.pushSubscriptions.length > 0) {
        for (const sub of profile.pushSubscriptions) {
          sendPushNotification(sub, pushPayload).catch(() => {});
        }
      }

      // C. Send Email Alert via Brevo
      if (recipientUser.email) {
        const emailHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px; background-color: #ffffff;">
            <div style="text-align: center; margin-bottom: 24px;">
              <h2 style="color: #15803d; margin: 0; font-size: 22px;">AgriYuvaa Hiring Alert</h2>
              <p style="color: #6b7280; font-size: 13px; margin-top: 4px;">Updates from employers you follow</p>
            </div>
            
            <div style="padding: 20px; background-color: #f0fdf4; border-radius: 10px; margin-bottom: 20px; border-left: 4px solid #15803d;">
              <span style="font-size: 11px; font-weight: bold; text-transform: uppercase; color: #166534; background-color: #dcfce7; padding: 3px 8px; border-radius: 4px;">New Job Alert</span>
              <h3 style="margin: 8px 0 4px 0; color: #111827; font-size: 18px;">${job.title}</h3>
              <p style="margin: 0; color: #374151; font-size: 14px; font-weight: 600;">${companyName} · ${job.location} · ${job.employmentType}</p>
            </div>

            <p style="color: #374151; font-size: 14px; line-height: 1.5;">
              Hi ${recipientUser.name || "there"}, <strong>${companyName}</strong>, a company you follow on AgriYuvaa, has just posted a new opportunity matching your sector.
            </p>

            <div style="text-align: center; margin: 28px 0 12px 0;">
              <a href="${process.env.CLIENT_URL || "https://job.agriyuvaa.com"}/jobs/${job._id}" style="display: inline-block; background-color: #15803d; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px;">View & Apply for this Job</a>
            </div>

            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
            <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 0;">You received this because you follow ${companyName} on AgriYuvaa. © ${new Date().getFullYear()} AgriYuvaa.</p>
          </div>
        `;

        sendEmail({
          to: recipientUser.email,
          subject: `🌾 New Job Alert from ${companyName}: ${job.title}`,
          html: emailHtml,
        }).catch((err) => console.error("Follower email alert error:", err.message));
      }
    }
  } catch (err) {
    console.error("Broadcast new job alert error:", err.message);
  }
};

export { vapidPublicKey, webpush };
