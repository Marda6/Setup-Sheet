# Setup Sheet — ENCY Core prototype

Clickable static prototype of the ENCY project workspace page (project **#2356**,
"Sequential machining"), built for design hand-off to developers. It reproduces
two views with the top toggle:

- **3D view** — operations tree (Machine → Setup → Part → operations) over a static
  render of the 3D scene, with the viewport toolbar and stage controls.
- **Setup sheet** — the redesign: checklist bar + three columns
  (**Operations**, **Workpiece setup**, **Tools & assemblies**), tool cards with
  2D / 3D / Holder tabs and a dimensioned tool drawing.

Pure **HTML / CSS / JS** — no build step, no backend. All UI is styled with the
**ENCY Core** design tokens (foreground = opacities of `#f5f5f5` over `#0e1010`,
accent `#00a36d`, Inter, 2px grid). Icons are ported 1:1 from the ENCY
`PwIcons` / operation-icon set.

## Run locally

Any static server, e.g.:

```bash
npx serve .
# or
python -m http.server 4321
```

Then open the printed URL.

## Files

| File | Role |
|---|---|
| `index.html` | Page markup + inline SVG icon sprite |
| `styles.css` | ENCY Core tokens + component styles |
| `app.js` | Static data (tree / operations / tools) + clickable interactions |
| `assets/view-3d.png` | Static 3D-scene render (3D view) |
| `assets/workpiece-preview.png` | Workpiece 3D preview (Setup sheet) |
| `assets/fonts/` | Self-hosted Inter (woff2) |

## Notes

- The 3D area is intentionally a static image — 3D view is not part of this redesign.
- Content (operations, tools, cutting values) is frozen from project #2356.

## Deploy — GitHub Pages

Push to a GitHub repo, then **Settings → Pages → Deploy from a branch → `main` / root**.
No build required.
