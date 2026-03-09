# CLAUDE.md

This file provides guidance for AI assistants working with the `funnels-` repository.

## Project Overview

A premium sales landing page for **The Whole Woman Reset** — a 30-day health reset programme by Ryan. The page is a single-page static HTML/CSS/JS site with no build tools, no dependencies, and no frameworks. It follows a **PAS (Pain–Agitate–Solve) sales funnel** structure.

## Project Structure

```
funnels-/
├── index.html              # Main landing page (~730 lines, all sections)
├── assets/
│   ├── css/
│   │   └── styles.css      # All styling (~737 lines) — CSS custom properties, responsive
│   └── js/
│       └── main.js         # Scroll animations, accordion, smooth scroll (~71 lines)
└── CLAUDE.md
```

> **Note**: There is no `assets/images/` directory yet. Image placeholders exist in the HTML (e.g. Ryan's photo placeholder in the About section).

## Running Locally

No build step. Just open `index.html` in a browser. For a local server:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Page Sections (in order)

The landing page follows a deliberate sales funnel structure:

| Section | Class / ID | Background | Purpose |
|---|---|---|---|
| Hero | `.hero` | gradient (white→green-50→cream) | Headline, CTA, social proof badge |
| Pain | `.pain` | `section--white` | "You wake up exhausted" |
| Agitation | `.agitation` | `section--cream` | "So you've tried things" — 4-card grid |
| The Real Problem | `.real-problem` | `section--green` | Nervous system messaging |
| Solution Intro | `.solution-intro` | `section--white` | Product introduction + stats bar |
| Nobody Told You | `.nobody-told` | `section--cream` | Reframe the problem |
| Inside-Out Method | `.method` | `section--white` | 3-step method (Reset, Release, Revive) |
| What Changes | `.outcomes` | `section--cream` | 4-card outcomes grid |
| How It Works | `.how-it-works` | `section--white` | 4-card features grid |
| Testimonials | `.testimonials` `#results` | `section--green-light` | Featured + grid + mini testimonials |
| About Ryan | `.about` | `section--white` | Bio + image placeholder |
| Objections | `.objections` | `section--cream` | Accordion FAQ-style objection handling |
| What's Included | `.whats-included` | `section--white` | Core programme + 5 bonus cards |
| Pricing | `.pricing` `#pricing` | `section--green` | Price card with 3 payment plans |
| Guarantee | `.guarantee` | `section--white` | 30-day money-back guarantee |
| Urgency | `.urgency` | `section--cream` | "Why Now?" + CTA |
| FAQ | `.faq` | `section--white` | 7-item accordion |
| Final CTA | `.final-cta` | `section--green-dark` | Closing pitch + CTA |
| Footer | `.footer` | `gray-950` | Copyright + disclaimer |

**Anchor link IDs**: `#pricing` and `#results` are the only section IDs used for navigation.

## Key Technical Details

- **Fonts**: Playfair Display (headings via `--font-display`) + Inter (body via `--font-body`) loaded from Google Fonts
- **CSS Architecture**: BEM naming, CSS custom properties for theming in `:root`
- **Animations**: Intersection Observer in `main.js` triggers `.is-visible` on `[data-animate]` elements; staggered delays via CSS `transition-delay` on nth-children
- **Accordion**: Pure JS toggle with `.is-open` class, one-open-at-a-time per `.accordion` group, uses `aria-expanded` for accessibility
- **Smooth Scroll**: JS handler for all `a[href^="#"]` links, plus `scroll-behavior: smooth` on `html`
- **Responsive**: Mobile-first with breakpoints at `480px`, `768px`, `1024px`
- **No dependencies**: Zero npm packages, no frameworks, no build tools
- **IIFE pattern**: `main.js` wraps all code in an immediately-invoked function expression with `'use strict'`

## CSS Custom Properties (`:root`)

### Brand Colours (Green Scale)
- `--green-50` through `--green-950` (full 11-step scale)
- Primary CTA: `--green-600: #1e7f4d`
- Headings/accents: `--green-700: #1a6640`
- Light backgrounds: `--green-50: #f0faf4`

### Neutrals
- `--white: #ffffff` / `--cream: #fafaf7`
- `--gray-50` through `--gray-950` (full 11-step scale)

### Layout
- `--container-max: 1200px` / `--container-narrow: 780px`
- `--section-pad-y: clamp(4rem, 8vw, 7rem)`
- `--section-pad-x: clamp(1.25rem, 4vw, 2rem)`

### Animation
- `--ease-out: cubic-bezier(0.16, 1, 0.3, 1)`
- `--duration: 0.6s`

### Shadows
- `--shadow-sm`, `--shadow-md`, `--shadow-lg`, `--shadow-xl`

## Conventions

- Keep it static HTML/CSS/JS — no frameworks, no build tools
- BEM class naming: `.block__element--modifier`
- Use `data-animate` attribute on elements that should fade in on scroll
- All copy lives directly in `index.html` (no CMS or templating)
- Sections alternate backgrounds: `section--white`, `section--cream`, `section--green`, `section--green-light`, `section--green-dark`
- Buttons use `.btn` base class with modifiers: `--primary` (green), `--white`, `--lg`, `--full`
- Container variants: `.container` (1200px max) and `.container--narrow` (780px max)
- SVG icons are inline in the HTML (no icon library)
- Accessibility: accordion triggers use `aria-expanded` attribute
- CSS keyframe animations: `pulse-dot` (hero badge) and `scroll-fade` (scroll indicator)

## Common Edit Patterns

- **Change copy**: Edit text directly in `index.html`
- **Change colours**: Update CSS custom properties in `:root` at top of `styles.css`
- **Add a section**: Follow the existing pattern — `<section class="section section--{bg}">` with a `<div class="container">` inside
- **Add scroll animation to an element**: Add `data-animate` attribute to it
- **Add an FAQ item**: Copy an `.accordion__item` block inside the `.accordion--faq` group
- **Add a testimonial**: Copy a `.testimonial-card` block inside `.testimonials__grid`
- **Replace image placeholder**: Replace the `.about__image-inner` div content with an `<img>` tag

## Hosting

Pure static site. Deploy via:
- **GitHub Pages** — enable in repo settings
- **Netlify** — drag & drop or connect repo
- **Vercel** — connect repo
- Any static hosting provider
