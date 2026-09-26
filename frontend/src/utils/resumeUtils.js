/**
 * Determines the single active resume between uploaded file and resume builder CV.
 * Rule: Whichever was last edited or uploaded wins.
 *
 * @param {Object} profile - User profile (seeker or employer)
 * @param {string} [userName] - Fallback candidate name
 * @returns {Object|null} Single active resume object
 */
export function getActiveResume(profile, userName = "") {
  if (!profile) return null;

  const hasUpload = Boolean(profile.resumeUrl);
  const hasBuilder = Boolean(
    profile.resumeData &&
      typeof profile.resumeData === "object" &&
      Object.keys(profile.resumeData).length > 0 &&
      (profile.resumeData.fullName ||
        profile.resumeData.title ||
        profile.resumeData.summary ||
        (Array.isArray(profile.resumeData.skills) && profile.resumeData.skills.length > 0))
  );

  if (!hasUpload && !hasBuilder) return null;

  // Compute timestamp for uploaded file
  const uploadTime = profile.resumeUploadedAt
    ? new Date(profile.resumeUploadedAt).getTime()
    : profile.activeResumeType === "upload" && profile.resumeUpdatedAt
    ? new Date(profile.resumeUpdatedAt).getTime()
    : hasUpload
    ? (profile.updatedAt ? new Date(profile.updatedAt).getTime() : 1)
    : 0;

  // Compute timestamp for resume builder CV
  const builderTime = profile.resumeBuilderUpdatedAt
    ? new Date(profile.resumeBuilderUpdatedAt).getTime()
    : profile.resumeData?.updatedAt
    ? new Date(profile.resumeData.updatedAt).getTime()
    : profile.activeResumeType === "builder" && profile.resumeUpdatedAt
    ? new Date(profile.resumeUpdatedAt).getTime()
    : hasBuilder
    ? 1
    : 0;

  // Determine winner: last edited or uploaded
  const chooseBuilder =
    (hasBuilder && !hasUpload) || (hasBuilder && hasUpload && builderTime > uploadTime);

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://job.agriyuvaa.com";

  if (chooseBuilder) {
    const candidateName = profile.resumeData?.fullName || userName || "Candidate";
    return {
      type: "builder",
      title: `${candidateName} Resume`,
      subtitle: profile.resumeData?.title || "AgriYuvaa Resume Builder CV",
      url: `${baseUrl}/resume-builder`,
      originalName: `${candidateName.replace(/\s+/g, "_")}_Resume.pdf`,
      updatedAt: profile.resumeBuilderUpdatedAt || profile.resumeData?.updatedAt || profile.resumeUpdatedAt,
      badge: "Resume Builder CV (Latest)",
      raw: profile.resumeData,
    };
  } else {
    return {
      type: "upload",
      title:
        profile.resumeOriginalName ||
        (profile.resumeUrl ? profile.resumeUrl.split("/").pop() : "Uploaded Resume Document"),
      subtitle: "Uploaded PDF / Document",
      url: profile.resumeUrl,
      originalName: profile.resumeOriginalName,
      updatedAt: profile.resumeUploadedAt || profile.resumeUpdatedAt || profile.updatedAt,
      badge: "Uploaded Document (Latest)",
    };
  }
}
