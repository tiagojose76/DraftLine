import { createRoot } from "react-dom/client";
import { Excalidraw, MainMenu, serializeAsJSON } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import "./theme.css";

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

createRoot(document.getElementById("root")).render(
  <Excalidraw initialData={load()} onChange={save} langCode="pt-BR">
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
  </Excalidraw>,
);
