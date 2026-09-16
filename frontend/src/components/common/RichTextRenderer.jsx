import React from "react";

/**
 * Parses text containing HTML tags (<b>, <strong>, <i>, <em>, <u>, <a>, <ul>, <ol>, <li>, <p>, <br>),
 * markdown links ([text](url)), and raw URLs (https://...), safely rendering them as React elements.
 */
const RichTextRenderer = ({ content = "", className = "" }) => {
  if (!content) return null;

  // 1. If content contains HTML tags or markdown, convert standard markdown to HTML first
  let html = typeof content === "string" ? content : String(content);

  // Convert markdown links [Label](https://...) -> <a href="..." target="_blank" rel="noopener noreferrer">Label</a>
  html = html.replace(
    /\[([^\]]+)\]\(((?:https?:\/\/|www\.)[^\s)]+)\)/gi,
    (match, text, url) => {
      const fullUrl = /^https?:\/\//i.test(url) ? url : `https://${url}`;
      return `<a href="${fullUrl}" target="_blank" rel="noopener noreferrer" class="text-emerald-700 underline font-semibold hover:text-emerald-800 transition-colors inline-flex items-center gap-0.5">${text} ↗</a>`;
    }
  );

  // Convert markdown **bold** -> <strong>bold</strong>
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");

  // Convert markdown *italic* -> <em>italic</em>
  html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>");

  // Auto-detect raw URLs that are not already enclosed in an <a> tag
  // e.g. "https://example.com" or "http://example.com"
  const urlRegex = /(?<!href=["'])(https?:\/\/[^\s<"']+)/gi;
  html = html.replace(
    urlRegex,
    '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-emerald-700 underline font-semibold hover:text-emerald-800 transition-colors inline-flex items-center gap-0.5 break-all">$1 ↗</a>'
  );

  // Auto-detect www. URLs without http:// or https://
  const wwwRegex = /(?<!href=["']|\/)(www\.[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}[^\s<"']*)/gi;
  html = html.replace(
    wwwRegex,
    '<a href="https://$1" target="_blank" rel="noopener noreferrer" class="text-emerald-700 underline font-semibold hover:text-emerald-800 transition-colors inline-flex items-center gap-0.5 break-all">$1 ↗</a>'
  );

  // Style any existing <a> tags that lack class attribute
  html = html.replace(
    /<a(?![^>]*class=)([^>]*)>/gi,
    '<a class="text-emerald-700 underline font-semibold hover:text-emerald-800 transition-colors inline-flex items-center gap-0.5 break-all"$1>'
  );

  // Convert newlines to <br /> if there are no existing block tags like <p>, <ul>, <div>
  const hasBlockTags = /<\/?(p|div|ul|ol|li|h[1-6]|blockquote)[^>]*>/i.test(html);
  if (!hasBlockTags) {
    html = html.replace(/\r?\n/g, "<br />");
  }

  return (
    <div
      className={`rich-text-content leading-relaxed break-words space-y-2 text-inherit ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default RichTextRenderer;
