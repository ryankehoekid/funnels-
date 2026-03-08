# CLAUDE.md

This file provides guidance for AI assistants working with the `funnels-` repository.

## Project Overview

A premium sales landing page for **The Whole Woman Reset** — a 30-day health reset programme by Ryan. The page is a static HTML/CSS/JS site with no build tools or dependencies. Brand colours: green and white.

## Project Structure

```
funnels-/
├── index.html              # Main landing page (all sections)
├── assets/
│   ├── css/
│   │   └── styles.css      # All styling — CSS custom properties, responsive
│   ├── js/
│   │   └── main.js         # Scroll animations, accordion, smooth scroll
│   └── images/             # Image assets (add client photos here)
└── CLAUDE.md
```

## Running Locally

No build step. Just open `index.html` in a browser. For a local server:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Key Technical Details

- **Fonts**: Playfair Display (headings) + Inter (body) via Google Fonts
- **CSS Architecture**: BEM naming, CSS custom properties for theming in `:root`
- **Animations**: Intersection Observer triggers `.is-visible` on `[data-animate]` elements
- **Accordion**: Pure JS toggle with `.is-open` class, one-open-at-a-time per group
- **Responsive**: Mobile-first breakpoints at 480px, 768px, 1024px
- **No dependencies**: Zero npm packages, no frameworks, no build tools

## Brand Colours (CSS Custom Properties)

- `--green-600: #1e7f4d` (primary CTA)
- `--green-700: #1a6640` (headings, accents)
- `--green-50: #f0faf4` (light backgrounds)
- `--white: #ffffff` / `--cream: #fafaf7` (section backgrounds)

## Conventions

- Keep it static HTML/CSS/JS — no frameworks
- BEM class naming: `.block__element--modifier`
- Use `data-animate` attribute on elements that should fade in on scroll
- All copy lives directly in `index.html` (no CMS or templating)
- Sections alternate between `section--white`, `section--cream`, `section--green` backgrounds

## Hosting

Pure static site. Deploy via:
- **GitHub Pages** — enable in repo settings
- **Netlify** — drag & drop or connect repo
- **Vercel** — connect repo
- Any static hosting provider
