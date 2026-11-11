<p align="center">
  <img src="public/icon.svg" width="96" alt="DraftLine" />
</p>

<h1 align="center">DraftLine</h1>

<p align="center">
  Quadro branco leve para esboços rápidos, baseado no <a href="https://github.com/excalidraw/excalidraw">Excalidraw</a>.<br />
  App nativo para macOS e versão web instalável.
</p>

---

## Recursos

- **Leve:** app nativo com [Tauri](https://tauri.app), que usa o WebView do macOS em vez de embutir um navegador. São cerca de 25 MB em disco.
- **Salvamento automático:** o desenho é salvo a cada alteração e reaberto no mesmo ponto.
- **Janela que lembra:** tamanho e posição são restaurados ao reabrir.
- **Interface em português**, com tema azul e sem links externos.
- **Também na web:** a versão PWA pode ser instalada pelo navegador e funciona offline.

## Instalação no macOS

Requer Apple Silicon, [Rust](https://rustup.rs) e as Xcode Command Line Tools (`xcode-select --install`).

```bash
bun install
bun run tauri:build
cp -R src-tauri/target/release/bundle/macos/DraftLine.app /Applications/
```

Depois é só abrir o **DraftLine** pelo Spotlight ou pelo Launchpad.

## Desenvolvimento

| Comando | O que faz |
| --- | --- |
| `bun run dev` | Versão web em modo desenvolvimento |
| `bun run build` | Build web (PWA) em `dist/` |
| `bun run preview` | Serve o build web localmente |
| `bun run tauri:dev` | App do macOS em modo desenvolvimento |
| `bun run tauri:build` | Gera o `DraftLine.app` |

As fontes do Excalidraw são copiadas para `public/fonts` no `bun install`.

## Estrutura

```
src/main.jsx     editor, menu e salvamento
src/theme.css    cores do tema
src-tauri/       app nativo (Tauri 2)
public/          ícones
```

## Stack

React 18 · Excalidraw 0.18 · Vite · vite-plugin-pwa · Tauri 2
