<p align="center">
  <img src="public/icon.svg" width="96" alt="DraftLine" />
</p>

<h1 align="center">DraftLine</h1>

<p align="center">
  Quadro branco leve para esboços rápidos, baseado no <a href="https://github.com/excalidraw/excalidraw">Excalidraw</a>.<br />
  App nativo para macOS, Windows e Linux e versão web instalável.
</p>

---

## Recursos

- **Leve:** app nativo com [Tauri](https://tauri.app), que usa o WebView do sistema (WebKit no macOS e no Linux, WebView2 no Windows) em vez de embutir um navegador. São cerca de 25 MB em disco.
- **Salvamento automático:** o desenho é salvo a cada alteração e reaberto no mesmo ponto.
- **Janela que lembra:** tamanho e posição são restaurados ao reabrir.
- **Interface em português**, com tema azul e sem links externos.
- **Também na web:** a versão PWA pode ser instalada pelo navegador e funciona offline.

## Instalação

O jeito mais simples é baixar o instalador do seu sistema na página de [Releases](../../releases). Para compilar a partir do código, siga as instruções abaixo.

> Os binários não são assinados. Por isso, na primeira abertura o Windows mostra o aviso do SmartScreen ("Mais informações" → "Executar assim mesmo") e o macOS mostra o do Gatekeeper.

### macOS

Requer Apple Silicon, [Rust](https://rustup.rs) e as Xcode Command Line Tools (`xcode-select --install`).

```bash
bun install
bun run tauri:build
cp -R src-tauri/target/release/bundle/macos/DraftLine.app /Applications/
```

Depois é só abrir o **DraftLine** pelo Spotlight ou pelo Launchpad.

### Windows

Requer [Rust](https://rustup.rs) e o [Visual Studio Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/) com a carga "Desenvolvimento para desktop com C++". O WebView2 já vem no Windows 11.

```bash
bun install
bun run tauri:build
```

Execute `src-tauri/target/release/bundle/nsis/DraftLine_<versão>_x64-setup.exe`. O instalador cria um atalho no menu Iniciar.

### Linux

Requer [Rust](https://rustup.rs) e as bibliotecas do WebKitGTK. No Debian e no Ubuntu:

```bash
sudo apt install libwebkit2gtk-4.1-dev libappindicator3-dev librsvg2-dev patchelf
bun install
bun run tauri:build
```

Os pacotes ficam em `src-tauri/target/release/bundle/deb/` (`.deb`) e em `src-tauri/target/release/bundle/appimage/` (AppImage).

## Desenvolvimento

| Comando | O que faz |
| --- | --- |
| `bun run dev` | Versão web em modo desenvolvimento |
| `bun run build` | Build web (PWA) em `dist/` |
| `bun run preview` | Serve o build web localmente |
| `bun run tauri:dev` | App nativo em modo desenvolvimento |
| `bun run tauri:build` | Gera o instalador do sistema atual |

As fontes do Excalidraw são copiadas para `public/fonts` no `bun install`.

## Publicar release

1. Atualize a versão em `package.json` (por exemplo, `0.3.0`).
2. Crie e envie a tag correspondente: `git tag v0.3.0 && git push origin v0.3.0`.
3. O GitHub Actions compila no Windows, no Linux e no macOS e cria uma release em rascunho com os instaladores. Revise e publique.

## Estrutura

```
src/main.jsx     editor, menu e salvamento
src/theme.css    cores do tema
src-tauri/       app nativo (Tauri 2)
public/          ícones
```

## Stack

React 18 · Excalidraw 0.18 · Vite · vite-plugin-pwa · Tauri 2
