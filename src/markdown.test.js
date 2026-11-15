import { test, expect } from "bun:test";
import { mdToHtml, htmlToSvg, svgToDataURL } from "./markdown.js";

test("renders heading", () => {
  expect(mdToHtml("# Oi")).toContain("<h1");
});

test("escapes raw html", () => {
  expect(mdToHtml("<script>x</script>")).not.toContain("<script>");
});

test("empty markdown", () => {
  expect(mdToHtml("").trim()).toBe("");
});

test("escapes ampersands and angle brackets", () => {
  const html = mdToHtml("a & b `<x>`");
  expect(html).toContain("&amp;");
  expect(html).toContain("&lt;x&gt;");
});

test("keeps accents", () => {
  const url = svgToDataURL(htmlToSvg(mdToHtml("ação"), 720, 50));
  expect(url.startsWith("data:image/svg+xml;base64,")).toBe(true);
  const bytes = Uint8Array.from(atob(url.split(",")[1]), (c) => c.charCodeAt(0));
  expect(new TextDecoder().decode(bytes)).toContain("ação");
});

test("images become alt text", () => {
  const html = mdToHtml("![foto <a>](http://x/y.png)");
  expect(html).not.toContain("<img");
  expect(html).toContain("foto &lt;a&gt;");
});
