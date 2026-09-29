import React, { useState, useRef, useEffect } from "react";
import {
  Plus,
  Bold,
  Italic,
  Underline,
  Link2,
  Image as ImageIcon,
  Heading1,
  Heading2,
  Heading3,
  Type,
  List,
  ListOrdered,
  Quote,
  Minus,
  Info,
  Search,
  X,
  Upload,
  Check,
  Loader2,
  Eye,
  Code2,
  Sparkles,
  RemoveFormatting,
} from "lucide-react";
import { uploadBlogImage } from "../../services/landingService.js";
import RichTextRenderer from "./RichTextRenderer.jsx";

const RichTextEditor = ({
  label,
  value = "",
  onChange,
  placeholder = "Type your content or click [+] to add blocks...",
  rows = 8,
  required = false,
  className = "",
  mode = "full", // "full" | "linkOnly"
}) => {
  const [viewMode, setViewMode] = useState("visual"); // "visual" | "code" | "preview"
  const [showInserter, setShowInserter] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);

  // Link Dialog State
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");

  // Image Dialog State
  const [imageTab, setImageTab] = useState("upload"); // "upload" | "url"
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [imageCaption, setImageCaption] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageFilePreview, setImageFilePreview] = useState("");

  const editorRef = useRef(null);
  const fileInputRef = useRef(null);
  const inserterRef = useRef(null);
  const searchInputRef = useRef(null);
  const savedRangeRef = useRef(null);
  const lastHtmlRef = useRef(value || "");

  // Normalize initial value (converts plain text newlines into clean HTML if no tags exist)
  const formatInitialHtml = (val) => {
    if (!val) return "";
    const str = String(val).trim();
    if (!str) return "";
    // If it already looks like HTML, return as-is
    if (/<[a-z][\s\S]*>/i.test(str)) {
      return str;
    }
    // Convert plain text into paragraphs & line breaks
    return str
      .split(/\n\s*\n+/)
      .map((p) => `<p>${p.replace(/\n/g, "<br>")}</p>`)
      .join("");
  };

  // Sync value into contentEditable when switching or mounting
  useEffect(() => {
    if (editorRef.current) {
      const incoming = formatInitialHtml(value);
      if (incoming !== lastHtmlRef.current && incoming !== editorRef.current.innerHTML) {
        editorRef.current.innerHTML = incoming;
        lastHtmlRef.current = incoming;
      }
    }
  }, [value, viewMode]);

  // Set default paragraph separator on mount
  useEffect(() => {
    try {
      document.execCommand("defaultParagraphSeparator", false, "p");
    } catch {
      // ignore
    }
  }, []);

  // Close inserter on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        inserterRef.current &&
        !inserterRef.current.contains(e.target) &&
        !e.target.closest("[data-inserter-trigger]")
      ) {
        setShowInserter(false);
      }
    };
    if (showInserter) {
      document.addEventListener("mousedown", handleClickOutside);
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showInserter]);

  // Save current cursor position / selection
  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      if (
        editorRef.current &&
        (editorRef.current.contains(range.commonAncestorContainer) ||
          editorRef.current === range.commonAncestorContainer)
      ) {
        savedRangeRef.current = range.cloneRange();
      }
    }
  };

  // Restore saved cursor position
  const restoreSelection = () => {
    if (savedRangeRef.current && editorRef.current) {
      const sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(savedRangeRef.current);
      }
      editorRef.current.focus();
    } else if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  // Emit content change to parent
  const emitChange = () => {
    if (!editorRef.current) return;
    let html = editorRef.current.innerHTML;
    // If empty or just a blank <p><br></p>, treat as empty
    if (html === "<p><br></p>" || html === "<p></p>" || html === "<br>") {
      html = "";
    }
    lastHtmlRef.current = html;
    if (onChange) {
      onChange(html);
    }
  };

  const handleInput = () => {
    saveSelection();
    emitChange();
  };

  // Handle keyboard shortcuts (Ctrl+B, Ctrl+I, Ctrl+U, Ctrl+K, '/')
  const handleKeyDown = (e) => {
    if (viewMode !== "visual") return;

    if ((e.ctrlKey || e.metaKey) && !e.shiftKey && !e.altKey) {
      if (e.key === "b" || e.key === "B") {
        e.preventDefault();
        execFormatting("bold");
      } else if (e.key === "i" || e.key === "I") {
        e.preventDefault();
        execFormatting("italic");
      } else if (e.key === "u" || e.key === "U") {
        e.preventDefault();
        execFormatting("underline");
      } else if (e.key === "k" || e.key === "K") {
        e.preventDefault();
        openLinkModal();
      }
    } else if (e.key === "/" && !e.ctrlKey && !e.metaKey) {
      // Check if at the start of a block or line
      const sel = window.getSelection();
      if (sel && sel.isCollapsed) {
        saveSelection();
        setTimeout(() => {
          setShowInserter(true);
          setSearchTerm("");
        }, 10);
      }
    } else if (e.key === "Escape" && showInserter) {
      setShowInserter(false);
    }
  };

  // Execute standard formatting commands
  const execFormatting = (command, value = null) => {
    restoreSelection();
    try {
      document.execCommand(command, false, value);
    } catch (err) {
      console.warn("execCommand failed:", err);
    }
    saveSelection();
    emitChange();
  };

  // Format blocks (Heading 1/2/3, Paragraph, Blockquote)
  const execFormatBlock = (tag) => {
    restoreSelection();
    try {
      // Some browsers expect formatBlock with or without angle brackets
      const success = document.execCommand("formatBlock", false, `<${tag}>`);
      if (!success) {
        document.execCommand("formatBlock", false, tag);
      }
    } catch {
      document.execCommand("formatBlock", false, tag);
    }
    saveSelection();
    emitChange();
    setShowInserter(false);
  };

  // Open Link Modal
  const openLinkModal = () => {
    saveSelection();
    const sel = window.getSelection();
    let selectedText = "";
    if (sel && !sel.isCollapsed) {
      selectedText = sel.toString();
    }
    setLinkText(selectedText);
    setLinkUrl("");
    setShowLinkModal(true);
    setShowInserter(false);
  };

  // Insert Link
  const handleInsertLink = (e) => {
    if (e?.preventDefault) e.preventDefault();
    if (!linkUrl.trim()) return;

    let fullUrl = linkUrl.trim();
    if (!/^https?:\/\//i.test(fullUrl) && !/^mailto:/i.test(fullUrl)) {
      fullUrl = `https://${fullUrl}`;
    }

    restoreSelection();
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      const text = linkText.trim() || fullUrl;

      const a = document.createElement("a");
      a.href = fullUrl;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.className = "text-emerald-700 underline font-semibold hover:text-emerald-800 transition-colors inline-flex items-center gap-0.5";
      a.textContent = text;

      range.deleteContents();
      range.insertNode(a);

      // Place cursor right after the newly inserted link
      const newRange = document.createRange();
      newRange.setStartAfter(a);
      newRange.collapse(true);
      sel.removeAllRanges();
      sel.addRange(newRange);
      savedRangeRef.current = newRange.cloneRange();
    }

    emitChange();
    setShowLinkModal(false);
    setLinkUrl("");
    setLinkText("");
  };

  // Open Image Modal
  const openImageModal = () => {
    saveSelection();
    setImageUrl("");
    setImageAlt("");
    setImageCaption("");
    setImageFilePreview("");
    setShowImageModal(true);
    setShowInserter(false);
  };

  // Handle local image file selection
  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show local preview immediately
    const reader = new FileReader();
    reader.onload = () => setImageFilePreview(reader.result);
    reader.readAsDataURL(file);

    setUploadingImage(true);
    try {
      const res = await uploadBlogImage(file);
      const cloudUrl = res?.imageUrl || res?.url;
      if (cloudUrl) {
        setImageUrl(cloudUrl);
      } else {
        // Fallback to data URL if cloud response lacks URL
        setImageUrl(reader.result);
      }
    } catch {
      // If server upload failed (e.g. offline or unauthorized), fallback to base64 data URL
      setImageUrl(reader.result);
    } finally {
      setUploadingImage(false);
    }
  };

  // Insert Image into Visual Content
  const handleInsertImage = (e) => {
    if (e?.preventDefault) e.preventDefault();
    const finalUrl = imageUrl || imageFilePreview;
    if (!finalUrl) return;

    restoreSelection();
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);

      // Create responsive, styled figure or img
      const container = document.createElement("figure");
      container.className = "my-5 block text-center";

      const img = document.createElement("img");
      img.src = finalUrl;
      img.alt = imageAlt.trim() || "Uploaded illustration";
      img.className = "rounded-xl max-w-full h-auto shadow-md mx-auto block max-h-[500px] object-cover";

      container.appendChild(img);

      if (imageCaption.trim()) {
        const caption = document.createElement("figcaption");
        caption.className = "text-xs text-gray-500 mt-2 italic text-center";
        caption.textContent = imageCaption.trim();
        container.appendChild(caption);
      }

      // Add a blank paragraph after the image so user can effortlessly keep typing below
      const nextP = document.createElement("p");
      nextP.innerHTML = "<br>";

      range.deleteContents();
      range.insertNode(container);

      if (container.nextSibling) {
        container.parentNode.insertBefore(nextP, container.nextSibling);
      } else {
        container.parentNode.appendChild(nextP);
      }

      const newRange = document.createRange();
      newRange.setStart(nextP, 0);
      newRange.collapse(true);
      sel.removeAllRanges();
      sel.addRange(newRange);
      savedRangeRef.current = newRange.cloneRange();
    }

    emitChange();
    setShowImageModal(false);
    setImageUrl("");
    setImageAlt("");
    setImageCaption("");
    setImageFilePreview("");
  };

  // Insert Callout Box
  const insertCallout = () => {
    restoreSelection();
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      const callout = document.createElement("div");
      callout.className = "callout-box";
      callout.innerHTML = `<span class="text-base select-none">💡</span><div class="flex-1"><strong>Important Note:</strong> Enter helpful tip or guidance here...</div>`;

      const nextP = document.createElement("p");
      nextP.innerHTML = "<br>";

      range.deleteContents();
      range.insertNode(callout);

      if (callout.nextSibling) {
        callout.parentNode.insertBefore(nextP, callout.nextSibling);
      } else {
        callout.parentNode.appendChild(nextP);
      }

      const newRange = document.createRange();
      newRange.setStart(nextP, 0);
      newRange.collapse(true);
      sel.removeAllRanges();
      sel.addRange(newRange);
      savedRangeRef.current = newRange.cloneRange();
    }
    emitChange();
    setShowInserter(false);
  };

  // Insert Divider Line
  const insertDivider = () => {
    restoreSelection();
    try {
      document.execCommand("insertHorizontalRule", false, null);
    } catch {
      // ignore
    }
    emitChange();
    setShowInserter(false);
  };

  // List of all Gutenberg blocks & tools for the '+' Inserter Menu
  const inserterItems = [
    {
      id: "paragraph",
      label: "Paragraph",
      desc: "Plain narrative text",
      icon: <Type size={16} className="text-gray-700" />,
      category: "Text",
      action: () => execFormatBlock("p"),
    },
    {
      id: "h1",
      label: "Heading 1",
      desc: "Large section title",
      icon: <Heading1 size={16} className="text-brand-green font-bold" />,
      category: "Headings",
      action: () => execFormatBlock("h1"),
    },
    {
      id: "h2",
      label: "Heading 2",
      desc: "Medium subsection title",
      icon: <Heading2 size={16} className="text-brand-green font-bold" />,
      category: "Headings",
      action: () => execFormatBlock("h2"),
    },
    {
      id: "h3",
      label: "Heading 3",
      desc: "Small subsection title",
      icon: <Heading3 size={16} className="text-brand-green font-bold" />,
      category: "Headings",
      action: () => execFormatBlock("h3"),
    },
    {
      id: "bold",
      label: "Bold",
      desc: "Bold font weight (Ctrl+B)",
      icon: <Bold size={16} className="text-gray-900 font-bold" />,
      category: "Format",
      action: () => {
        execFormatting("bold");
        setShowInserter(false);
      },
    },
    {
      id: "italic",
      label: "Italic",
      desc: "Slanted emphasis (Ctrl+I)",
      icon: <Italic size={16} className="text-gray-700 italic" />,
      category: "Format",
      action: () => {
        execFormatting("italic");
        setShowInserter(false);
      },
    },
    {
      id: "underline",
      label: "Underline",
      desc: "Underline text (Ctrl+U)",
      icon: <Underline size={16} className="text-gray-700 underline" />,
      category: "Format",
      action: () => {
        execFormatting("underline");
        setShowInserter(false);
      },
    },
    {
      id: "image",
      label: "Insert Image",
      desc: "Upload from PC or enter image URL",
      icon: <ImageIcon size={16} className="text-blue-600" />,
      category: "Media",
      action: openImageModal,
    },
    {
      id: "link",
      label: "Insert Link",
      desc: "Clickable hyperlink (Ctrl+K)",
      icon: <Link2 size={16} className="text-emerald-600" />,
      category: "Links",
      action: openLinkModal,
    },
    {
      id: "bullet_list",
      label: "Bullet List",
      desc: "Unordered bulleted points",
      icon: <List size={16} className="text-gray-700" />,
      category: "Lists",
      action: () => {
        execFormatting("insertUnorderedList");
        setShowInserter(false);
      },
    },
    {
      id: "numbered_list",
      label: "Numbered List",
      desc: "Ordered 1. 2. 3. sequence",
      icon: <ListOrdered size={16} className="text-gray-700" />,
      category: "Lists",
      action: () => {
        execFormatting("insertOrderedList");
        setShowInserter(false);
      },
    },
    {
      id: "quote",
      label: "Quote Block",
      desc: "Styled citation or quote",
      icon: <Quote size={16} className="text-amber-600" />,
      category: "Blocks",
      action: () => execFormatBlock("blockquote"),
    },
    {
      id: "callout",
      label: "Callout Box",
      desc: "Highlighted green tip note",
      icon: <Info size={16} className="text-emerald-600" />,
      category: "Blocks",
      action: insertCallout,
    },
    {
      id: "divider",
      label: "Divider Line",
      desc: "Horizontal section break",
      icon: <Minus size={16} className="text-gray-400" />,
      category: "Blocks",
      action: insertDivider,
    },
  ];

  const filteredItems = inserterItems.filter(
    (item) =>
      item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-brand-grey uppercase tracking-wide flex items-center gap-1.5">
            {label}
            {required && <span className="text-red-500">*</span>}
          </label>
          <span className="text-[11px] text-gray-500 font-medium">
            Visual WYSIWYG Editor • Click <span className="font-bold text-gray-700">[+]</span> to add blocks
          </span>
        </div>
      )}

      {/* Editor Main Container */}
      <div className="relative border border-brand-border rounded-xl bg-white shadow-2xs focus-within:border-brand-green focus-within:ring-2 focus-within:ring-brand-green/20 transition-all">
        {/* Top Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-1 p-2 bg-gray-50 border-b border-gray-200">
          {/* Left Actions: Gutenberg '+' Button & Quick Formatting Tools */}
          <div className="flex flex-wrap items-center gap-1 relative">
            {/* The Main Gutenberg '+' Inserter Button (Matching WordPress screenshot) */}
            <div className="relative">
              <button
                type="button"
                data-inserter-trigger="true"
                onClick={(e) => {
                  e.preventDefault();
                  saveSelection();
                  setShowInserter(!showInserter);
                  setSearchTerm("");
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer ${
                  showInserter
                    ? "bg-brand-black text-white ring-2 ring-brand-black/20"
                    : "bg-brand-black hover:bg-gray-800 text-white"
                }`}
                title="Add block or formatting (Type '/' or click)"
              >
                <Plus size={14} className="stroke-[2.5]" />
                <span>Add</span>
              </button>

              {/* Gutenberg Style Floating Inserter Popover (Matches Screenshot) */}
              {showInserter && (
                <div
                  ref={inserterRef}
                  className="absolute left-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 p-3 z-50 animate-in fade-in zoom-in-95 duration-150"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Search Bar */}
                  <div className="relative mb-3">
                    <Search
                      size={15}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Search blocks (e.g. image, bold, heading)..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-8 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-green focus:bg-white text-gray-800 transition-all"
                    />
                    {searchTerm && (
                      <button
                        type="button"
                        onClick={() => setSearchTerm("")}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                      >
                        <X size={13} />
                      </button>
                    )}
                  </div>

                  {/* Filterable Blocks & Formats Grid */}
                  <div className="max-h-80 overflow-y-auto pr-1 space-y-1">
                    {filteredItems.length === 0 ? (
                      <div className="py-6 text-center text-xs text-gray-400">
                        No matching block found for "{searchTerm}"
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-1.5">
                        {filteredItems.map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              item.action();
                            }}
                            className="flex items-start gap-2.5 p-2 rounded-xl text-left border border-transparent hover:border-gray-200 hover:bg-emerald-50/50 hover:shadow-2xs transition-all cursor-pointer group"
                          >
                            <div className="w-7 h-7 rounded-lg bg-gray-100 group-hover:bg-white flex items-center justify-center shrink-0 border border-gray-200/60 shadow-2xs">
                              {item.icon}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-xs font-bold text-gray-800 group-hover:text-brand-green truncate">
                                {item.label}
                              </div>
                              <div className="text-[10px] text-gray-500 truncate">
                                {item.desc}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Footer hint */}
                  <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-400">
                    <span>Tip: Type <strong className="text-gray-600 font-mono">/</strong> in the editor to open this</span>
                    <button
                      type="button"
                      onClick={() => setShowInserter(false)}
                      className="text-gray-500 hover:text-gray-800 font-medium cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>

            <span className="w-px h-5 bg-gray-300 mx-1" />

            {/* Quick Access Toolbar Buttons */}
            {mode !== "linkOnly" && (
              <>
                {/* Bold */}
                <button
                  type="button"
                  onClick={() => execFormatting("bold")}
                  className="p-1.5 rounded-lg hover:bg-white hover:text-brand-black text-gray-700 hover:shadow-2xs transition-all cursor-pointer"
                  title="Bold (Ctrl+B) — Changes selected text to bold"
                >
                  <Bold size={15} />
                </button>

                {/* Italic */}
                <button
                  type="button"
                  onClick={() => execFormatting("italic")}
                  className="p-1.5 rounded-lg hover:bg-white hover:text-brand-black text-gray-700 hover:shadow-2xs transition-all cursor-pointer"
                  title="Italic (Ctrl+I) — Changes selected text to italic"
                >
                  <Italic size={15} />
                </button>

                {/* Underline */}
                <button
                  type="button"
                  onClick={() => execFormatting("underline")}
                  className="p-1.5 rounded-lg hover:bg-white hover:text-brand-black text-gray-700 hover:shadow-2xs transition-all cursor-pointer"
                  title="Underline (Ctrl+U) — Underlines selected text"
                >
                  <Underline size={15} />
                </button>

                <span className="w-px h-4 bg-gray-300 mx-1" />

                {/* Headings */}
                <button
                  type="button"
                  onClick={() => execFormatBlock("h2")}
                  className="px-2 py-1 rounded-lg text-xs font-bold text-gray-700 hover:bg-white hover:text-brand-green hover:shadow-2xs transition-all cursor-pointer"
                  title="Heading 2"
                >
                  H2
                </button>

                <button
                  type="button"
                  onClick={() => execFormatBlock("h3")}
                  className="px-2 py-1 rounded-lg text-xs font-bold text-gray-700 hover:bg-white hover:text-brand-green hover:shadow-2xs transition-all cursor-pointer"
                  title="Heading 3"
                >
                  H3
                </button>

                <span className="w-px h-4 bg-gray-300 mx-1" />
              </>
            )}

            {/* Insert Link Button */}
            <button
              type="button"
              onClick={openLinkModal}
              className="p-1.5 rounded-lg hover:bg-white hover:text-brand-green text-gray-700 hover:shadow-2xs transition-all cursor-pointer flex items-center gap-1 text-xs font-medium"
              title="Insert Link (Ctrl+K)"
            >
              <Link2 size={15} className="text-emerald-600" />
            </button>

            {/* Insert Image Button */}
            {mode !== "linkOnly" && (
              <button
                type="button"
                onClick={openImageModal}
                className="p-1.5 rounded-lg hover:bg-white hover:text-blue-600 text-gray-700 hover:shadow-2xs transition-all cursor-pointer"
                title="Insert Image (Upload or URL)"
              >
                <ImageIcon size={15} className="text-blue-600" />
              </button>
            )}

            {mode !== "linkOnly" && (
              <>
                <span className="w-px h-4 bg-gray-300 mx-1" />

                {/* Lists */}
                <button
                  type="button"
                  onClick={() => execFormatting("insertUnorderedList")}
                  className="p-1.5 rounded-lg hover:bg-white hover:text-brand-black text-gray-700 hover:shadow-2xs transition-all cursor-pointer"
                  title="Bullet List"
                >
                  <List size={15} />
                </button>

                <button
                  type="button"
                  onClick={() => execFormatting("insertOrderedList")}
                  className="p-1.5 rounded-lg hover:bg-white hover:text-brand-black text-gray-700 hover:shadow-2xs transition-all cursor-pointer"
                  title="Numbered List"
                >
                  <ListOrdered size={15} />
                </button>

                {/* Quote */}
                <button
                  type="button"
                  onClick={() => execFormatBlock("blockquote")}
                  className="p-1.5 rounded-lg hover:bg-white hover:text-brand-black text-gray-700 hover:shadow-2xs transition-all cursor-pointer"
                  title="Quote"
                >
                  <Quote size={15} />
                </button>

                {/* Clear Formatting */}
                <button
                  type="button"
                  onClick={() => execFormatting("removeFormat")}
                  className="p-1.5 rounded-lg hover:bg-white text-gray-400 hover:text-gray-700 transition-all cursor-pointer"
                  title="Clear text formatting"
                >
                  <RemoveFormatting size={14} />
                </button>
              </>
            )}
          </div>

          {/* Right Mode Switch: Visual (WYSIWYG) vs HTML Source vs Live Preview */}
          <div className="flex items-center gap-1 bg-gray-200/80 p-0.5 rounded-lg text-xs font-semibold">
            <button
              type="button"
              onClick={() => setViewMode("visual")}
              className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                viewMode === "visual"
                  ? "bg-white text-brand-black shadow-xs font-bold"
                  : "text-gray-600 hover:text-brand-black"
              }`}
              title="True visual editing (no raw tags shown)"
            >
              <Sparkles size={12} className="text-brand-green" /> Visual
            </button>
            <button
              type="button"
              onClick={() => setViewMode("code")}
              className={`px-2 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                viewMode === "code"
                  ? "bg-white text-brand-black shadow-xs font-bold"
                  : "text-gray-600 hover:text-brand-black"
              }`}
              title="View HTML source code"
            >
              <Code2 size={12} /> HTML
            </button>
            <button
              type="button"
              onClick={() => setViewMode("preview")}
              className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                viewMode === "preview"
                  ? "bg-emerald-600 text-white shadow-xs font-bold"
                  : "text-gray-600 hover:text-brand-black"
              }`}
              title="Reader preview"
            >
              <Eye size={12} /> Preview
            </button>
          </div>
        </div>

        {/* ── Visual WYSIWYG Editable Area ── */}
        {viewMode === "visual" && (
          <div
            ref={editorRef}
            contentEditable={true}
            suppressContentEditableWarning={true}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            onMouseUp={saveSelection}
            onKeyUp={saveSelection}
            onFocus={saveSelection}
            style={{ minHeight: `${rows * 28}px` }}
            className="rich-text-content p-4 text-sm focus:outline-none leading-relaxed text-gray-800 bg-white min-h-[160px] overflow-y-auto"
            data-placeholder={placeholder}
          />
        )}

        {/* ── HTML Source Code Mode ── */}
        {viewMode === "code" && (
          <textarea
            rows={rows}
            value={value || ""}
            onChange={(e) => {
              const html = e.target.value;
              lastHtmlRef.current = html;
              if (onChange) onChange(html);
            }}
            placeholder="Edit raw HTML source code here..."
            className="w-full p-4 font-mono text-xs text-gray-800 focus:outline-none resize-y bg-gray-900 text-emerald-300 min-h-[160px]"
          />
        )}

        {/* ── Reader Preview Mode ── */}
        {viewMode === "preview" && (
          <div
            style={{ minHeight: `${rows * 28}px` }}
            className="w-full p-5 text-sm bg-gray-50/50 min-h-[160px] overflow-y-auto"
          >
            {value ? (
              <RichTextRenderer content={value} />
            ) : (
              <span className="text-gray-400 italic text-xs">
                Nothing to preview yet. Switch back to Visual mode and write your content.
              </span>
            )}
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* ── MODAL: INSERT LINK ──────────────────────────────────────────── */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {showLinkModal && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowLinkModal(false);
          }}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl border border-gray-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="text-sm font-bold text-brand-black flex items-center gap-1.5">
                <Link2 size={16} className="text-brand-green" /> Insert Link
              </h3>
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                className="text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-brand-grey uppercase tracking-wide block mb-1">
                  Text to display
                </label>
                <input
                  type="text"
                  placeholder="e.g. Official Website / Apply Now"
                  className="input-field text-sm"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  autoFocus
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-brand-grey uppercase tracking-wide block mb-1">
                  Web Address (URL) *
                </label>
                <input
                  type="text"
                  placeholder="https://example.com or agriyuvaa.com"
                  className="input-field text-sm"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleInsertLink(e);
                  }}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                className="btn-secondary text-xs py-2 px-3.5 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleInsertLink}
                disabled={!linkUrl.trim()}
                className="btn-primary text-xs py-2 px-4 flex items-center gap-1 font-bold cursor-pointer disabled:opacity-50"
              >
                <Check size={14} /> Insert Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* ── MODAL: INSERT IMAGE (Upload or Web URL) ─────────────────────── */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {showImageModal && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowImageModal(false);
          }}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full p-5 space-y-4 shadow-2xl border border-gray-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="text-sm font-bold text-brand-black flex items-center gap-1.5">
                <ImageIcon size={16} className="text-blue-600" /> Insert Image
              </h3>
              <button
                type="button"
                onClick={() => setShowImageModal(false)}
                className="text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Tabs: Upload from Device vs Paste URL */}
            <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
              <button
                type="button"
                onClick={() => setImageTab("upload")}
                className={`text-xs font-bold py-1.5 px-3 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  imageTab === "upload"
                    ? "bg-brand-black text-white"
                    : "text-gray-600 hover:text-brand-black hover:bg-gray-100"
                }`}
              >
                <Upload size={13} /> Upload from Computer
              </button>
              <button
                type="button"
                onClick={() => setImageTab("url")}
                className={`text-xs font-bold py-1.5 px-3 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  imageTab === "url"
                    ? "bg-brand-black text-white"
                    : "text-gray-600 hover:text-brand-black hover:bg-gray-100"
                }`}
              >
                <Link2 size={13} /> Image Web URL
              </button>
            </div>

            {/* Tab: Upload File */}
            {imageTab === "upload" && (
              <div className="space-y-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 hover:border-brand-green rounded-2xl p-6 text-center cursor-pointer transition-all hover:bg-emerald-50/30 flex flex-col items-center justify-center gap-2 group"
                >
                  <div className="w-12 h-12 rounded-full bg-emerald-50 group-hover:bg-emerald-100 flex items-center justify-center text-brand-green transition-all">
                    {uploadingImage ? (
                      <Loader2 size={22} className="animate-spin text-brand-green" />
                    ) : (
                      <Upload size={22} />
                    )}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-brand-black group-hover:text-brand-green">
                      {uploadingImage ? "Uploading image to server..." : "Click to choose image file"}
                    </span>
                    <p className="text-[11px] text-gray-400 mt-0.5">PNG, JPG, WEBP up to 5MB</p>
                  </div>
                </div>

                {/* Uploaded Preview */}
                {(imageUrl || imageFilePreview) && (
                  <div className="p-2 border border-gray-200 rounded-xl bg-gray-50 flex items-center gap-3">
                    <img
                      src={imageUrl || imageFilePreview}
                      alt="Preview"
                      className="w-14 h-14 object-cover rounded-lg border border-gray-200"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                        <Check size={13} /> Image Ready
                      </span>
                      <p className="text-[10px] text-gray-400 truncate">
                        {imageUrl ? "Uploaded to AgriYuvaa Cloud" : "Local Preview Loaded"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab: Enter Image URL */}
            {imageTab === "url" && (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-brand-grey uppercase tracking-wide block mb-1">
                    Image Address (URL) *
                  </label>
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/... or https://domain.com/photo.jpg"
                    className="input-field text-sm"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    autoFocus
                  />
                </div>

                {imageUrl && (
                  <div className="p-2 border border-gray-200 rounded-xl bg-gray-50 text-center">
                    <img
                      src={imageUrl}
                      alt="Preview"
                      className="max-h-36 mx-auto rounded-lg object-contain"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Additional Image Metadata (Alt text & Caption) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide block mb-1">
                  Alt Text (Accessibility)
                </label>
                <input
                  type="text"
                  placeholder="Brief description of image"
                  className="input-field text-xs"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide block mb-1">
                  Caption (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Figure 1: Field inspection"
                  className="input-field text-xs"
                  value={imageCaption}
                  onChange={(e) => setImageCaption(e.target.value)}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShowImageModal(false)}
                className="btn-secondary text-xs py-2 px-3.5 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleInsertImage}
                disabled={(!imageUrl && !imageFilePreview) || uploadingImage}
                className="btn-primary text-xs py-2 px-4 flex items-center gap-1 font-bold cursor-pointer disabled:opacity-50"
              >
                <Check size={14} /> Insert Image
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RichTextEditor;
