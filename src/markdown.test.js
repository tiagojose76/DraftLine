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

test("produces well-formed xml", () => {
  const svg = htmlToSvg(mdToHtml("a & b `<x>`\n\n---"), 720, 100);
  expect(svg).toContain("&amp;");
  expect(svg).toContain("&lt;x&gt;");
  expect(svg).not.toContain("& ");
  expect(svg).not.toContain("<hr>");
});

test("keeps accents", () => {
  const url = svgToDataURL(htmlToSvg(mdToHtml("ação"), 720, 50));
  expect(decodeURIComponent(url.split(",")[1])).toContain("ação");
});
