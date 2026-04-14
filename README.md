# Conversor de imagens para WebP (ZAAC)

Aplicação web para converter imagens raster para o formato **WebP** diretamente no navegador. Nenhum arquivo é enviado a um servidor: todo o processamento ocorre no seu dispositivo.

A interface segue o **design system ZAAC** (dark-first, tipografia editorial, Tailwind CSS v4 com tokens em `@theme`).

---

## Funcionalidades

- **Arrastar e soltar** ou **selecionar** várias imagens (`image/*`).
- **Qualidade WebP** ajustável (aproximadamente 50% a 100%).
- Conversão **individual** ou **em lote** (“Converter tudo”).
- **Download** de cada arquivo `.webp` com nome baseado no original.
- **Privacidade**: processamento 100% local (canvas + `createImageBitmap`).

---

## Stack

| Camada | Tecnologia |
| --- | --- |
| Framework | React 19 + TypeScript |
| Estilização | Tailwind CSS v4 (`@theme` em `src/index.css`) |
| Animações | Motion (`motion/react`) |
| Ícones | Lucide React |
| Bundler | Vite 8 |
| Fontes | Google Fonts (Archivo, Space Grotesk) + Geist Variable (`@fontsource-variable/geist`) |

---

## Pré-requisitos

- [Node.js](https://nodejs.org/) (recomendado: LTS atual) com npm.

---

## Como executar

Clone ou entre na pasta do projeto e instale as dependências:

```bash
npm install
```

Modo desenvolvimento (com hot reload):

```bash
npm run dev
```

Abra o endereço exibido no terminal (geralmente `http://localhost:5173`).

Build de produção:

```bash
npm run build
```

Visualizar o build gerado:

```bash
npm run preview
```

Lint:

```bash
npm run lint
```

---

## Compatibilidade de navegador

A exportação WebP usa `canvas.toBlob('image/webp', qualidade)`. Em navegadores que **não** suportam codificação WebP a partir do canvas, a conversão pode falhar; nesse caso, use um navegador baseado em **Chromium** (Chrome, Edge, Brave) ou verifique se está na versão mais recente do seu navegador.

---

## Estrutura principal

| Caminho | Descrição |
| --- | --- |
| `src/App.tsx` | Layout da página (hero, ticker, fluxo, CTA). |
| `src/components/WebpConverter.tsx` | Área de conversão (lista, qualidade, ações). |
| `src/lib/convertToWebp.ts` | Lógica de conversão para WebP. |
| `src/index.css` | Tokens do tema ZAAC e estilos base. |

---

## Licença

Projeto privado / uso pessoal, salvo indicação em contrário.
