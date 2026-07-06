# Haider Ali · Portfolio

Personal portfolio site for Haider Ali, Senior Backend Engineer.

## Stack

Pure static site: HTML, CSS, and vanilla JavaScript. No build step, no dependencies.

- `index.html` — single-page layout (hero, about, experience, projects, skills, education, contact)
- `css/style.css` — dark theme, responsive, respects `prefers-reduced-motion`
- `js/main.js` — scroll reveal, animated counters, mobile nav, active section highlighting

## Run locally

```bash
python3 -m http.server 8899
# open http://localhost:8899
```

## Deploy

Works on any static host. For GitHub Pages:

1. Push this folder to a repository (e.g. `haiderali136a.github.io` for a root domain, or any repo for `/<repo>` path).
2. In repo Settings → Pages, set Source to the main branch, root folder.

## Updating content

All content lives in `index.html`. Sections are marked with `<!-- ==== SECTION ==== -->` comments. Skills and tags are plain `<span class="tag">` elements.
