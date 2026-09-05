import React, { useEffect, useState } from "react";
import { X, Download, ExternalLink, FileText, User, Mail, Phone, AlertCircle, Loader2, FileCode, CheckCircle2 } from "lucide-react";

/**
 * Reusable in-browser Resume Preview Modal
 * Supports both PDF and Word (.docx, .doc) documents
 * @param {Object} props
 * @param {Object} props.application - Full application object or candidate info
 * @param {Function} props.onClose - Modal close handler
 */
const ResumePreviewModal = ({ application, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!application) return null;

  const backendBase = (
    import.meta.env.VITE_API_URL || "https://agriyuvaa.onrender.com"
  ).replace(/\/api\/?$/, "");

  let rawUrl = application.resumeUrl ? application.resumeUrl.trim() : "";
  let resumeUrl = "";

  // Prioritize streaming endpoint if application._id exists (guaranteed persistence from MongoDB buffer)
  if (application._id) {
    resumeUrl = `${backendBase}/api/applications/${application._id}/resume`;
  } else if (rawUrl.startsWith("/uploads/")) {
    resumeUrl = `${backendBase}${rawUrl.replace(/^https?:\/\/\/+/, "/")}`;
  } else if (rawUrl.startsWith("http://") || rawUrl.startsWith("https://")) {
    resumeUrl = rawUrl;
  } else if (rawUrl) {
    resumeUrl = `https://${rawUrl}`;
  }

  const applicantName = application.seeker?.name || application.name || "Candidate Resume";
  const applicantEmail = application.seeker?.email || application.email || "";
  const applicantPhone = application.seeker?.phone || application.phone || "";
  const jobTitle = application.job?.title || application.jobTitle || "";

  // Detect file extension / format
  const isWordDoc =
    rawUrl.toLowerCase().endsWith(".docx") ||
    rawUrl.toLowerCase().endsWith(".doc") ||
    (application.resumeOriginalName &&
      (application.resumeOriginalName.toLowerCase().endsWith(".docx") ||
        application.resumeOriginalName.toLowerCase().endsWith(".doc")));

  const docxFileName =
    application.resumeOriginalName ||
    (rawUrl ? rawUrl.split("/").pop() : `${applicantName.replace(/[^a-z0-9]/gi, "_")}_Resume.docx`);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-5xl w-full h-[90vh] flex flex-col shadow-2xl border border-brand-border overflow-hidden relative">
        
        {/* Modal Top Header */}
        <div className="px-5 py-4 bg-emerald-950 text-white flex items-center justify-between gap-4 shrink-0 border-b border-emerald-900">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-emerald-800/80 border border-emerald-700 flex items-center justify-center text-white shrink-0">
              <FileText size={20} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-base text-white truncate">
                  {applicantName}
                </h3>
                {jobTitle && (
                  <span className="hidden sm:inline-block text-[11px] px-2 py-0.5 rounded-full bg-emerald-900 text-emerald-200 border border-emerald-700 truncate">
                    {jobTitle}
                  </span>
                )}
              </div>
              <p className="text-xs text-emerald-300/80 truncate">
                {applicantEmail} {applicantPhone ? `· 📞 ${applicantPhone}` : ""}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {resumeUrl && (
              <>
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-emerald-100 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-emerald-700"
                  title="Open in new browser tab"
                >
                  <ExternalLink size={13} />
                  <span className="hidden sm:inline">New Tab</span>
                </a>

                <a
                  href={resumeUrl}
                  download={docxFileName}
                  className="px-3.5 py-1.5 rounded-xl bg-brand-green hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                  title="Download File"
                >
                  <Download size={13} />
                  <span>Download</span>
                </a>
              </>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-gray-300 hover:text-white hover:bg-emerald-900 transition-colors"
              title="Close (Esc)"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 bg-gray-100 relative overflow-hidden flex flex-col">
          {loading && !loadError && !isWordDoc && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50/90 z-10 space-y-3">
              <Loader2 size={32} className="text-emerald-700 animate-spin" />
              <p className="text-xs font-semibold text-brand-grey">Loading Document Preview...</p>
            </div>
          )}

          {!resumeUrl ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-3">
              <AlertCircle size={36} className="text-amber-500" />
              <p className="text-sm font-bold text-brand-black">No Resume File Attached</p>
              <p className="text-xs text-brand-grey max-w-sm">
                This candidate did not upload an online resume file with their application.
              </p>
            </div>
          ) : isWordDoc ? (
            /* Word Document (.DOCX / .DOC) Dedicated Viewer Card */
            <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 bg-gradient-to-b from-gray-50 to-emerald-50/30 text-center space-y-5">
              <div className="w-20 h-20 rounded-2xl bg-blue-50 border-2 border-blue-200 text-blue-700 flex items-center justify-center shadow-sm">
                <FileText size={40} />
              </div>

              <div className="space-y-1 max-w-md">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 border border-blue-300">
                  Microsoft Word Document (.docx)
                </span>
                <h4 className="text-lg font-display font-bold text-brand-black pt-1 break-all">
                  {docxFileName}
                </h4>
                <p className="text-xs text-brand-grey">
                  Uploaded by <strong>{applicantName}</strong> for {jobTitle || "Job Application"}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <a
                  href={resumeUrl}
                  download={docxFileName}
                  className="btn-primary text-xs py-2.5 px-5 flex items-center gap-2 shadow-sm"
                >
                  <Download size={15} />
                  <span>Download Word Document</span>
                </a>

                <a
                  href={`https://docs.google.com/viewer?url=${encodeURIComponent(resumeUrl)}&embedded=false`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary text-xs py-2.5 px-4 flex items-center gap-2 bg-white"
                >
                  <ExternalLink size={14} className="text-emerald-700" />
                  <span>View in Google Docs ↗</span>
                </a>
              </div>
            </div>
          ) : (
            /* PDF In-Browser Viewer */
            <iframe
              src={`${resumeUrl}#toolbar=1&navpanes=0`}
              title={`Resume of ${applicantName}`}
              className="w-full h-full border-none flex-1"
              onLoad={() => setLoading(false)}
              onError={() => {
                setLoading(false);
                setLoadError(true);
              }}
            />
          )}

          {loadError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-white text-center space-y-4">
              <AlertCircle size={36} className="text-amber-500" />
              <div>
                <p className="text-sm font-bold text-brand-black">Preview Unavailable in Browser</p>
                <p className="text-xs text-brand-grey mt-1">
                  Your browser or network does not allow embedded PDF rendering for this link.
                </p>
              </div>
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-xs py-2 px-4 inline-flex items-center gap-2"
              >
                <Download size={14} /> Download Document Directly
              </a>
            </div>
          )}
        </div>

        {/* Modal Bottom Footer */}
        <div className="px-5 py-2.5 bg-gray-50 border-t border-brand-border flex items-center justify-between text-[11px] text-brand-grey shrink-0">
          <span>AgriYuvaa Candidate Document Viewer</span>
          <button
            type="button"
            onClick={onClose}
            className="font-semibold text-emerald-800 hover:text-emerald-950 underline cursor-pointer"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumePreviewModal;
