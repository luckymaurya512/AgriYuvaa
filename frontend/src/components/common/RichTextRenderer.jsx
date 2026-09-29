import React from "react";

/**
 * Parses text containing HTML tags (<b>, <strong>, <i>, <em>, <u>, <a>, <ul>, <ol>, <li>, <p>, <br>),
 * markdown links ([text](url)), and raw URLs (https://...), safely rendering them as React elements
 * while preserving single line-breaks (<br />) and double line-breaks (<p>).
 */
const formatRichText = (content) => {
  if (!content) return "";

  let html = typeof content === "string" ? content : String(content);

  // 1. Normalize line breaks
  html = html.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  // 2. Convert markdown links [Label](https://...) -> <a href="..." target="_blank" rel="noopener noreferrer">Label ↗</a>
  html = html.replace(
    /\[([^\]]+)\]\(((?:https?:\/\/|www\.)[^\s)]+)\)/gi,
    (match, text, url) => {
      const fullUrl = /^https?:\/\//i.test(url) ? url : `https://${url}`;
      return `<a href="${fullUrl}" target="_blank" rel="noopener noreferrer" class="text-emerald-700 underline font-semibold hover:text-emerald-800 transition-colors inline-flex items-center gap-0.5">${text} ↗</a>`;
    }
  );

  // 3. Convert markdown **bold** -> <strong>bold</strong>
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");

  // 4. Convert markdown *italic* -> <em>italic</em>
  html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>");

  // 5. Auto-detect raw URLs that are not already enclosed in an <a> tag
  const urlRegex = /(?<!href=["'])(https?:\/\/[^\s<"']+)/gi;
  html = html.replace(
    urlRegex,
    '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-emerald-700 underline font-semibold hover:text-emerald-800 transition-colors inline-flex items-center gap-0.5 break-all">$1 ↗</a>'
  );

  // 6. Auto-detect www. URLs without http:// or https://
  const wwwRegex = /(?<!href=["']|\/)(www\.[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}[^\s<"']*)/gi;
  html = html.replace(
    wwwRegex,
    '<a href="https://$1" target="_blank" rel="noopener noreferrer" class="text-emerald-700 underline font-semibold hover:text-emerald-800 transition-colors inline-flex items-center gap-0.5 break-all">$1 ↗</a>'
  );

  // 7. Style any existing <a> tags that lack class attribute
  html = html.replace(
    /<a(?![^>]*class=)([^>]*)>/gi,
    '<a class="text-emerald-700 underline font-semibold hover:text-emerald-800 transition-colors inline-flex items-center gap-0.5 break-all"$1>'
  );

  // 8. Ensure clean spacing around block tags so splitting doesn't merge text with blocks
  html = html.replace(/([^\n])\s*(<(?:ul|ol|h[1-6]|blockquote|table|hr|pre)[^>]*>)/gi, "$1\n\n$2");
  html = html.replace(/(<\/(?:ul|ol|h[1-6]|blockquote|table|pre)>)\s*([^\n])/gi, "$1\n\n$2");

  // 9. Handle paragraphs and line breaks:
  const hasPTags = /<\/?p[^>]*>/i.test(html);

  if (hasPTags) {
    // Content already contains <p> tags — convert standalone newlines between text into <br />
    html = html.replace(/([^>\r\n])\n([^<\r\n])/g, "$1<br />$2");
  } else {
    // Text typed in textarea: split by double or multiple newlines into distinct paragraphs
    const blocks = html.split(/\n\s*\n+/);
    html = blocks
      .map((block) => {
        const trimmed = block.trim();
        if (!trimmed) return "";
        // If the block is already a block-level HTML element, keep it without wrapping in <p>
        const isBlockLevel = /^<(?:ul|ol|li|h[1-6]|blockquote|div|table|hr|pre|img|figure)[^>]*>/i.test(trimmed);
        if (isBlockLevel) {
          return trimmed.replace(/([^>\r\n])\n([^<\r\n])/g, "$1<br />$2");
        }
        // For normal text blocks, convert single newlines to <br /> and wrap in paragraph
        const withBr = trimmed.replace(/\n/g, "<br />");
        return `<p class="mb-4 leading-relaxed">${withBr}</p>`;
      })
      .filter(Boolean)
      .join("\n");
  }

  return html;
};

const RichTextRenderer = ({ content = "", className = "" }) => {
  if (!content) return null;

  const html = formatRichText(content);

  return (
    <div
      className={`rich-text-content leading-relaxed break-words text-inherit ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default RichTextRenderer;

