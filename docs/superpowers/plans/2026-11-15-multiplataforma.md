# Build multiplataforma (Windows, Linux, macOS) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Gerar instalador nativo para Windows (NSIS) e Linux (`.deb` e AppImage), localmente e via GitHub Actions em tags `v*`, mantendo o `.app` do macOS, e atualizar o README.

**Architecture:** Nenhum código de app muda: o Tauri já é multiplataforma e o Rust não tem nada específico de macOS. Muda só o alvo de bundle no `tauri.conf.json`, entra um workflow de release com `tauri-apps/tauri-action` em matriz de 3 SOs, e o README passa a documentar os três sistemas.

**Tech Stack:** Tauri 2.9, Bun, GitHub Actions (`tauri-apps/tauri-action@v0`).

**Spec:** conversa de brainstorming de 2026-11-15 (instalador com atalho no menu Iniciar, build local + release automática no GitHub, Linux pedido em seguida).

## Global Constraints

- Windows: instalador NSIS (`*-setup.exe`) com atalho no menu Iniciar.
- Linux: `.deb` e AppImage.
- macOS: continua gerando `DraftLine.app` (alvo `app`).
- Release do GitHub: dispara em push de tag `v*` e é criada como **rascunho**.
- Fica de fora: assinatura de código (o Windows mostra o aviso do SmartScreen, o macOS mostra o do Gatekeeper).
- Não mexer em código da aplicação (`src/`, `src-tauri/src/`).

## Review Focus

- `postinstall` usa `cp -R`: no Windows, sob o `bun install`, precisa funcionar (Bun Shell). Verificado na Task 1, passo 3.
- Linux no CI precisa de `libwebkit2gtk-4.1-dev` e afins, senão o build falha. Coberto na Task 2.
- A versão da release vem de `package.json` via `"version": "../package.json"`. A tag precisa bater com ela (`v0.2.0` ↔ `0.2.0`). Fica documentado no README.
- O `macos-latest` é Apple Silicon, então o `.app` do CI é arm64, igual ao README atual.

---

### Task 1: Alvos de bundle

**Files:**
- Modify: `src-tauri/tauri.conf.json` (`bundle.targets`)

- [ ] **Step 1:** Trocar `"targets": ["app"]` por `"targets": ["app", "nsis", "deb", "appimage"]`. O Tauri ignora os alvos que não pertencem ao SO atual.
- [ ] **Step 2:** No Windows, rodar `bun run tauri:build`. Esperado: `src-tauri/target/release/bundle/nsis/DraftLine_0.2.0_x64-setup.exe`.
- [ ] **Step 3:** Rodar `bun install` no Windows e confirmar que existe `public/fonts/`. Se o `cp -R` falhar, avisar o usuário. Não trocar o script sem a aprovação dele.
- [ ] **Step 4:** Instalar o `.exe`, abrir pelo menu Iniciar, desenhar algo, fechar e reabrir, e conferir que o desenho e a posição da janela foram restaurados.
- [ ] **Step 5:** Commit `build: gerar instaladores para Windows e Linux`.

### Task 2: Workflow de release

**Files:**
- Create: `.github/workflows/release.yml`

- [ ] **Step 1:** Criar o workflow:
  - `on: push: tags: ['v*']`, com `permissions: contents: write`.
  - Matriz `platform: [windows-latest, ubuntu-22.04, macos-latest]`, com `fail-fast: false`.
  - Passos: `actions/checkout@v4`; `oven-sh/setup-bun@v2`; `dtolnay/rust-toolchain@stable`; `swatinem/rust-cache@v2` com `workspaces: src-tauri`; no Ubuntu, `apt-get install -y libwebkit2gtk-4.1-dev libappindicator3-dev librsvg2-dev patchelf`; depois `bun install`.
  - `tauri-apps/tauri-action@v0` com `GITHUB_TOKEN`, `tagName: ${{ github.ref_name }}`, `releaseName: DraftLine ${{ github.ref_name }}`, `releaseDraft: true`, `tauriScript: bunx tauri`.
- [ ] **Step 2:** Validar a sintaxe com `actionlint`, se estiver instalado. Se não estiver, registrar como NOT RUN.
- [ ] **Step 3:** Commit `ci: release multiplataforma em tags v*`.
- [ ] **Step 4 (só com autorização do usuário):** fazer push de uma tag de teste e conferir se a release em rascunho saiu com `.exe`, `.deb`, `.AppImage` e o `.app.tar.gz`.

### Task 3: README multiplataforma

**Files:**
- Modify: `README.md`

- [ ] **Step 1:** Mudar o subtítulo para "App nativo para macOS, Windows e Linux e versão web instalável."
- [ ] **Step 2:** No item "Leve", trocar "usa o WebView do macOS" por "usa o WebView do sistema (WebKit no macOS e no Linux, WebView2 no Windows)".
- [ ] **Step 3:** Trocar "Instalação no macOS" por "Instalação", com uma linha sobre baixar o instalador na página de Releases e três subseções que compilam a partir do código:
  - macOS: o bloco atual.
  - Windows: Rust + Visual Studio Build Tools (C++), WebView2 já incluso no Windows 11; `bun run tauri:build`; instalar `src-tauri/target/release/bundle/nsis/DraftLine_<versão>_x64-setup.exe`.
  - Linux: Rust + `libwebkit2gtk-4.1-dev libappindicator3-dev librsvg2-dev patchelf`; `bun run tauri:build`; arquivos em `bundle/deb/` e `bundle/appimage/`.
  - Uma nota sobre o aviso do SmartScreen e do Gatekeeper, que aparece porque os binários não são assinados.
- [ ] **Step 4:** Na tabela, trocar "App do macOS" por "App nativo" e "Gera o `DraftLine.app`" por "Gera o instalador do SO atual".
- [ ] **Step 5:** Adicionar a seção "Publicar release": atualizar a versão em `package.json`, criar e enviar a tag `vX.Y.Z`, e publicar o rascunho no GitHub.
- [ ] **Step 6:** Commit `docs: instalação no macOS, Windows e Linux`.
