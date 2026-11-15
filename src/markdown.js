import { Marked } from "marked";

export const MD_WIDTH = 720;

const escape = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Raw HTML in the .md is shown as text, never rendered: it lands inside an image.
const marked = new Marked({ renderer: { html: ({ text }) => escape(text) } });

export const MD_CSS = `
.md{box-sizing:border-box;padding:24px 28px;background:#fff;color:#1e1e1e;font:16px/1.5 -apple-system,"Segoe UI",Helvetica,Arial,sans-serif;word-wrap:break-word}
.md>:first-child{margin-top:0}.md>:last-child{margin-bottom:0}
.md h1,.md h2,.md h3{line-height:1.25;margin:1.2em 0 .5em}
.md h1{font-size:1.8em}.md h2{font-size:1.45em}.md h3{font-size:1.2em}
.md code{font:.9em ui-monospace,Menlo,monospace;background:#f4f4f4;padding:.1em .3em;border-radius:4px}
.md pre{background:#f4f4f4;padding:12px;border-radius:6px;white-space:pre-wrap}
.md pre code{padding:0;background:none}
.md blockquote{margin:0 0 1em;padding:0 1em;border-left:4px solid #ccc;color:#555}
.md table{border-collapse:collapse}.md th,.md td{border:1px solid #ccc;padding:4px 8px}
.md img{max-width:100%}
`;

export const mdToHtml = (md) => marked.parse(md);

// SVG is XML: marked's void tags (<br>, <hr>, <img ...>) must be self-closed.
const toXhtml = (html) => html.replace(/<(br|hr|img|input)\b([^>]*?)\/?>/g, "<$1$2/>");

export const htmlToSvg = (html, width, height) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">` +
  `<foreignObject width="100%" height="100%">` +
  `<div xmlns="http://www.w3.org/1999/xhtml"><style>${MD_CSS}</style>` +
  `<div class="md" style="width:${width}px">${toXhtml(html)}</div></div>` +
  `</foreignObject></svg>`;

// Excalidraw decodes SVG data URLs with atob, so they must be base64 (of UTF-8 bytes).
export const svgToDataURL = (svg) => {
  let bin = "";
  for (const b of new TextEncoder().encode(svg)) bin += String.fromCharCode(b);
  return `data:image/svg+xml;base64,${btoa(bin)}`;
};
