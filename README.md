# ENCY workspace prototype (v2)

Clickable static prototype of the ENCY web app, built for design hand-off to
developers. Two pages:

- **`v2/index.html`** — project workspace (project **#2356**, "Sequential
  machining"): panel system with switchable views (Overview, Operations,
  Tool table, 3D Viewer), a real software-rendered 3D viewer with simulation
  timeline, tool cards with generated 2D/3D drawings, and the **setup
  checklist** mode (Overview reference + step-by-step checklist).
- **`v2/clouds.html`** — the Clouds page: projects grid/list, collections,
  in-collection view, inbox, chats (with composer and a 3D pane), mobile-app
  QR, account settings.

Pure **HTML / CSS / JS** — no build step, no backend. Everything is styled
with the **ENCY Core** design tokens (foreground = opacities of `#f5f5f5`
over `#0e1010`, accent `#00a36d`, Inter, radii 4/8/12) and has a light theme
(token flip, `data-theme`). The root `index.html` just redirects to `v2/`.

Design documentation and decisions live in [HANDOFF.md](HANDOFF.md).

## Run locally

```bash
node server.mjs
```

Then open `http://localhost:4321/v2/` (the port respects `PORT`).

## Files

| Path | Role |
|---|---|
| `v2/index.html · app.js · styles.css` | Project workspace page |
| `v2/clouds.html · clouds.css · clouds.js` | Clouds page |
| `assets/fonts/` | Self-hosted Inter (woff2) |
| `server.mjs` | Zero-dep static server for local preview |
| `HANDOFF.md` | Living hand-off doc (ru) |

## Deploy — GitHub Pages

Published from the `gh-pages` branch as a squashed snapshot (only `v2/` +
fonts + the root redirect). Live: <https://marda6.github.io/Setup-Sheet/v2/>.
The publication process is described in HANDOFF.md.
