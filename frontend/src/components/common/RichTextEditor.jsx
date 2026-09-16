import React, { useState, useRef } from "react";
import {
  Bold,
  Italic,
  Underline,
  Link2,
  List,
  ListOrdered,
  Eye,
  Edit3,
  ExternalLink,
  X,
  Check,
} from "lucide-react";
import RichTextRenderer from "./RichTextRenderer.jsx";

const RichTextEditor = ({
  label,
  value = "",
  onChange,
  placeholder = "Write your content here...",
  rows = 6,
  required = false,
  className = "",
  mode = "full", // "full" | "linkOnly"
}) => {
  const [activeTab, setActiveTab] = useState("edit"); // "edit" | "preview"
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const textareaRef = useRef(null);

  // Helper to wrap selected text in a tag or insert template
  const applyFormatting = (beforeTag, afterTag, defaultText = "text") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentVal = value || "";
    const selected = currentVal.substring(start, end);

    const replacement = selected
      ? `${beforeTag}${selected}${afterTag}`
      : `${beforeTag}${defaultText}${afterTag}`;

    const updated =
      currentVal.substring(0, start) + replacement + currentVal.substring(end);

    onChange(updated);

    // Reposition cursor
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = selected
        ? start + replacement.length
        : start + beforeTag.length + defaultText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  // Saved selection range so focus loss doesn't clear insert position
  const [savedRange, setSavedRange] = useState({ start: 0, end: 0 });

  // Open Link Modal
  const openLinkDialog = () => {
    const textarea = textareaRef.current;
    const currentVal = value || "";
    let start = currentVal.length;
    let end = currentVal.length;
    let selected = "";
    if (textarea) {
      start = textarea.selectionStart ?? currentVal.length;
      end = textarea.selectionEnd ?? currentVal.length;
      selected = currentVal.substring(start, end);
    }
    setSavedRange({ start, end });
    setLinkText(selected || "");
    setLinkUrl("");
    setShowLinkModal(true);
  };

  // Insert Link (Safely without triggering parent form submits)
  const handleInsertLink = (e) => {
    if (e) {
      if (typeof e.preventDefault === "function") e.preventDefault();
      if (typeof e.stopPropagation === "function") e.stopPropagation();
    }
    if (!linkUrl.trim()) return;

    let formattedUrl = linkUrl.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = `https://${formattedUrl}`;
    }

    const textToDisplay = linkText.trim() || formattedUrl;
    const linkHtml = `<a href="${formattedUrl}" target="_blank" rel="noopener noreferrer">${textToDisplay}</a>`;

    const textarea = textareaRef.current;
    const currentVal = value || "";
    const start = savedRange.start ?? currentVal.length;
    const end = savedRange.end ?? currentVal.length;

    const updated =
      currentVal.substring(0, start) + linkHtml + currentVal.substring(end);
    onChange(updated);

    setShowLinkModal(false);
    setLinkUrl("");
    setLinkText("");

    setTimeout(() => {
      if (textarea) {
        textarea.focus();
        const newCursor = start + linkHtml.length;
        textarea.setSelectionRange(newCursor, newCursor);
      }
    }, 50);
  };

  // Insert List
  const insertList = (isNumbered = false) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentVal = value || "";
    const selected = currentVal.substring(start, end);

    let listHtml = "";
    if (selected) {
      const items = selected
        .split("\n")
        .filter((l) => l.trim())
        .map((l) => `  <li>${l.trim()}</li>`)
        .join("\n");
      listHtml = isNumbered
        ? `\n<ol>\n${items}\n</ol>\n`
        : `\n<ul>\n${items}\n</ul>\n`;
    } else {
      listHtml = isNumbered
        ? `\n<ol>\n  <li>First point</li>\n  <li>Second point</li>\n</ol>\n`
        : `\n<ul>\n  <li>First point</li>\n  <li>Second point</li>\n</ul>\n`;
    }

    const updated =
      currentVal.substring(0, start) + listHtml + currentVal.substring(end);
    onChange(updated);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + listHtml.length,
        start + listHtml.length
      );
    }, 0);
  };

  // Keyboard shortcuts (Ctrl+B, Ctrl+I, Ctrl+U, Ctrl+K)
  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && !e.shiftKey && !e.altKey) {
      if (e.key === "k" || e.key === "K") {
        e.preventDefault();
        openLinkDialog();
      } else if (mode !== "linkOnly") {
        if (e.key === "b" || e.key === "B") {
          e.preventDefault();
          applyFormatting("<b>", "</b>", "bold text");
        } else if (e.key === "i" || e.key === "I") {
          e.preventDefault();
          applyFormatting("<i>", "</i>", "italic text");
        } else if (e.key === "u" || e.key === "U") {
          e.preventDefault();
          applyFormatting("<u>", "</u>", "underlined text");
        }
      }
    }
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-brand-grey uppercase tracking-wide">
            {label}
            {required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
          <span className="text-[11px] text-brand-grey">
            {mode === "linkOnly"
              ? "Supports Clickable Hyperlinks"
              : "Supports Bold, Italic, Underline & Hyperlinks"}
          </span>
        </div>
      )}

      {/* Editor Box */}
      <div className="border border-brand-border rounded-xl overflow-hidden bg-white shadow-2xs focus-within:border-brand-green focus-within:ring-2 focus-within:ring-brand-green/20 transition-all">
        {/* Formatting Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-1 p-2 bg-gray-50 border-b border-gray-200">
          <div className="flex flex-wrap items-center gap-1">
            {mode !== "linkOnly" && (
              <>
                {/* Bold */}
                <button
                  type="button"
                  onClick={() => applyFormatting("<b>", "</b>", "bold text")}
                  className="p-1.5 rounded-lg hover:bg-white hover:text-brand-black text-gray-700 hover:shadow-2xs transition-all cursor-pointer"
                  title="Bold (Ctrl+B)"
                >
                  <Bold size={14} />
                </button>

                {/* Italic */}
                <button
                  type="button"
                  onClick={() => applyFormatting("<i>", "</i>", "italic text")}
                  className="p-1.5 rounded-lg hover:bg-white hover:text-brand-black text-gray-700 hover:shadow-2xs transition-all cursor-pointer"
                  title="Italic (Ctrl+I)"
                >
                  <Italic size={14} />
                </button>

                {/* Underline */}
                <button
                  type="button"
                  onClick={() => applyFormatting("<u>", "</u>", "underlined text")}
                  className="p-1.5 rounded-lg hover:bg-white hover:text-brand-black text-gray-700 hover:shadow-2xs transition-all cursor-pointer"
                  title="Underline (Ctrl+U)"
                >
                  <Underline size={14} />
                </button>

                <span className="w-px h-4 bg-gray-300 mx-1" />
              </>
            )}

            {/* Hyperlink */}
            <button
              type="button"
              onClick={openLinkDialog}
              className={`px-2.5 py-1.5 rounded-lg text-gray-800 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold ${
                mode === "linkOnly"
                  ? "bg-white border border-emerald-300 hover:border-emerald-500 shadow-2xs hover:bg-emerald-50/50"
                  : "hover:bg-white hover:text-brand-green hover:shadow-2xs"
              }`}
              title="Insert Link (Ctrl+K)"
            >
              <Link2 size={14} className="text-emerald-600" />
              <span>Insert Link</span>
            </button>

            {mode !== "linkOnly" && (
              <>
                <span className="w-px h-4 bg-gray-300 mx-1" />

                {/* Bullet List */}
                <button
                  type="button"
                  onClick={() => insertList(false)}
                  className="p-1.5 rounded-lg hover:bg-white hover:text-brand-black text-gray-700 hover:shadow-2xs transition-all cursor-pointer"
                  title="Bullet List"
                >
                  <List size={14} />
                </button>

                {/* Numbered List */}
                <button
                  type="button"
                  onClick={() => insertList(true)}
                  className="p-1.5 rounded-lg hover:bg-white hover:text-brand-black text-gray-700 hover:shadow-2xs transition-all cursor-pointer"
                  title="Numbered List"
                >
                  <ListOrdered size={14} />
                </button>
              </>
            )}
          </div>

          {/* Mode Switch: Edit vs Live Preview */}
          <div className="flex items-center gap-1 bg-gray-200/80 p-0.5 rounded-lg text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab("edit")}
              className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                activeTab === "edit"
                  ? "bg-white text-brand-black shadow-xs font-bold"
                  : "text-gray-600 hover:text-brand-black"
              }`}
            >
              <Edit3 size={12} /> Write
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("preview")}
              className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                activeTab === "preview"
                  ? "bg-emerald-600 text-white shadow-xs font-bold"
                  : "text-gray-600 hover:text-brand-black"
              }`}
            >
              <Eye size={12} /> Preview
            </button>
          </div>
        </div>

        {/* Editor Body */}
        {activeTab === "edit" ? (
          <textarea
            ref={textareaRef}
            rows={rows}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            required={required}
            className="w-full p-3 text-sm focus:outline-none resize-y font-sans leading-relaxed text-gray-800"
          />
        ) : (
          <div
            className={`w-full p-4 text-sm bg-gray-50/50 min-h-[${
              rows * 24
            }px] overflow-y-auto`}
          >
            {value ? (
              <RichTextRenderer content={value} />
            ) : (
              <span className="text-gray-400 italic text-xs">
                Nothing to preview yet. Switch back to Write mode and type your content.
              </span>
            )}
          </div>
        )}
      </div>

      {/* Inline Link Modal */}
      {showLinkModal && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4"
          onClick={(e) => {
            e.stopPropagation();
            if (e.target === e.currentTarget) setShowLinkModal(false);
          }}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-5 space-y-4 shadow-xl border border-gray-100 animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="text-sm font-bold text-brand-black flex items-center gap-1.5">
                <Link2 size={16} className="text-brand-green" /> Insert Hyperlink
              </h3>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowLinkModal(false);
                }}
                className="text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-brand-grey uppercase tracking-wide block mb-1">
                  Link Text (What users see)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Official Website / Apply Link"
                  className="input-field text-sm"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      e.stopPropagation();
                      handleInsertLink(e);
                    }
                  }}
                  autoFocus
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-brand-grey uppercase tracking-wide block mb-1">
                  Destination URL *
                </label>
                <input
                  type="text"
                  placeholder="https://example.com or company.com/apply"
                  className="input-field text-sm"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      e.stopPropagation();
                      handleInsertLink(e);
                    }
                  }}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowLinkModal(false);
                }}
                className="btn-secondary text-xs py-2 px-3.5 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleInsertLink}
                disabled={!linkUrl.trim()}
                className="btn-primary text-xs py-2 px-4 flex items-center gap-1 font-bold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Check size={14} /> Insert Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RichTextEditor;
