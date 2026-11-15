import { createRoot } from "react-dom/client";
import {
  Excalidraw,
  MainMenu,
  serializeAsJSON,
  convertToExcalidrawElements,
  viewportCoordsToSceneCoords,
} from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import "./theme.css";
import { MD_CSS, MD_WIDTH, mdToHtml, htmlToSvg, svgToDataURL } from "./markdown.js";

const KEY = "draftline";

const load = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY));
  } catch (e) {
    console.error(e);
    return null;
  }
};

// ponytail: serializes the whole scene on every change; debounce if large scenes lag.
const save = (elements, appState, files) => {
  try {
    localStorage.setItem(KEY, serializeAsJSON(elements, appState, files, "local"));
  } catch (e) {
    console.error(e);
  }
};

let api = null;

const measure = (html) => {
  const box = document.createElement("div");
  box.style.cssText = "position:absolute;visibility:hidden;left:-99999px;top:0";
  box.innerHTML = `<style>${MD_CSS}</style><div class="md" style="width:${MD_WIDTH}px">${html}</div>`;
  document.body.appendChild(box);
  const height = box.lastElementChild.offsetHeight;
  box.remove();
  return height;
};

// .md files become a fixed, formatted image block; every other drop goes to Excalidraw.
const onDrop = async (e) => {
  const mds = [...e.dataTransfer.files].filter((f) => /\.md$/i.test(f.name));
  if (!mds.length || !api) return;
  e.preventDefault();
  e.stopPropagation();
  let { x, y } = viewportCoordsToSceneCoords(e, api.getAppState());
  for (const file of mds) {
    const html = mdToHtml(await file.text());
    if (!html.trim()) continue;
    const height = measure(html);
    const fileId = crypto.randomUUID();
    api.addFiles([
      { id: fileId, dataURL: svgToDataURL(htmlToSvg(html, MD_WIDTH, height)), mimeType: "image/svg+xml", created: Date.now() },
    ]);
    const [el] = convertToExcalidrawElements([{ type: "image", fileId, status: "saved", x, y, width: MD_WIDTH, height }]);
    api.updateScene({ elements: [...api.getSceneElementsIncludingDeleted(), el] });
    y += height + 24;
  }
};

createRoot(document.getElementById("root")).render(
  <div style={{ height: "100%" }} onDropCapture={onDrop}>
  <Excalidraw excalidrawAPI={(a) => (api = a)} initialData={load()} onChange={save} langCode="pt-BR">
    {/* Default menu minus the "Excalidraw links" (socials) group. */}
    <MainMenu>
      <MainMenu.DefaultItems.LoadScene />
      <MainMenu.DefaultItems.SaveToActiveFile />
      <MainMenu.DefaultItems.Export />
      <MainMenu.DefaultItems.SaveAsImage />
      <MainMenu.DefaultItems.SearchMenu />
      <MainMenu.DefaultItems.Help />
      <MainMenu.DefaultItems.ClearCanvas />
      <MainMenu.Separator />
      <MainMenu.DefaultItems.ToggleTheme />
      <MainMenu.DefaultItems.ChangeCanvasBackground />
    </MainMenu>
  </Excalidraw>
  </div>,
);
