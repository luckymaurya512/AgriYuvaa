import express from "express";
import asyncHandler from "express-async-handler";
import Notification from "../models/Notification.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { vapidPublicKey } from "../utils/webPush.js";

const router = express.Router();

// @route GET /api/notifications/vapid-public-key
router.get("/vapid-public-key", (req, res) => {
  res.json({ publicKey: vapidPublicKey });
});

// @route GET /api/notifications
router.get(
  "/",
  authenticate,
  asyncHandler(async (req, res) => {
    const notifications = await Notification.find({ recipient: req.user._id })
      .sort("-createdAt")
      .limit(30);

    const unreadCount = await Notification.countDocuments({
      recipient: req.user._id,
      isRead: false,
    });

    res.json({ notifications, unreadCount });
  })
);

// @route PATCH /api/notifications/:id/read
router.route("/:id/read").patch(
  authenticate,
  asyncHandler(async (req, res) => {
    const notif = await Notification.findOne({
      _id: req.params.id,
      recipient: req.user._id,
    });
    if (notif) {
      notif.isRead = true;
      await notif.save();
    }
    res.json({ message: "Marked as read" });
  })
).post(
  authenticate,
  asyncHandler(async (req, res) => {
    const notif = await Notification.findOne({
      _id: req.params.id,
      recipient: req.user._id,
    });
    if (notif) {
      notif.isRead = true;
      await notif.save();
    }
    res.json({ message: "Marked as read" });
  })
);

// @route POST /api/notifications/read-all
router.route("/read-all").post(
  authenticate,
  asyncHandler(async (req, res) => {
    await Notification.updateMany(
      { recipient: req.user._id, isRead: false },
      { $set: { isRead: true } }
    );
    res.json({ message: "All notifications marked as read" });
  })
);

export default router;
