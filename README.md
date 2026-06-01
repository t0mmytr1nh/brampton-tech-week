# Brampton Tech Week

A single static page for Brampton Tech Week. Plain HTML, CSS, and a little vanilla JS. No build step.

## Structure

- `index.html` — content and markup
- `styles.css` — all styling (type, color, layout, hover effects)
- `scramble.js` — decode-on-load text animation + TBA-to-date hover reveal
- `cursor.js` — pink crosshair cursor with HUD lock-on
- `image-frame.js` — image hover (fades the rest of the page, draws pink guide lines)
- `fonts/` — self-hosted Inter (woff2)
- `images/` — the photo

## Local preview

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploy

Static files only, no build. Served via GitHub Pages from the repository root.
