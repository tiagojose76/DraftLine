# Soltar `.md` no quadro: design curto

## Intenção
Estudar com a mesa digitalizadora: soltar um `.md` no DraftLine, vê-lo formatado e anotar à mão por cima, como no Canvas do Obsidian.

## Objetivos
- Soltar um ou mais `.md` no canvas cria um bloco formatado (títulos, listas, negrito/itálico, código, citações, tabelas) no ponto onde foi solto.
- O bloco é salvo com a cena (localStorage e o arquivo `.excalidraw`), funcionando igual no Mac (Tauri) e na web.
- As anotações com a caneta ficam alinhadas ao texto, porque o bloco nunca muda.

## Não-objetivos
- Sincronizar com o arquivo de origem e editar o texto dentro do quadro (opções B e C, descartadas).
- Wikilinks e embeds do Obsidian, imagens referenciadas pelo `.md`.

## Abordagens
- **A) Cópia fixa (escolhida):** converter Markdown em HTML, rasterizar como imagem e inserir como elemento de imagem do Excalidraw. É simples e portátil, e mantém as anotações estáveis.
- B) Ligado ao arquivo: exige acesso a arquivos pelo Tauri, não funciona na web e desalinha as anotações.
- C) Editável no quadro: dá muito mais trabalho e também desalinha as anotações.

## Decisões (minhas, para revisar)
- Parser: a dependência `marked` (versão exata). Escrever um parser próprio seria mais código que a feature.
- Render: HTML dentro de um SVG `foreignObject`, inserido direto como imagem `image/svg+xml` (vetorial, nítido no zoom; evita o canvas "tainted" do WebKit que o Tauri usa no macOS), com fundo claro e largura 720px.
- Inserção: via `excalidrawAPI` (`addFiles` e `updateScene`), na posição do drop.
- Arquivos que não são `.md` continuam com o comportamento padrão do Excalidraw.

## Fica para quem implementar
- Onde interceptar o drop sem quebrar o drop nativo do Excalidraw.
- Tema escuro do bloco.
