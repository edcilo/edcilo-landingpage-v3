# CLAUDE.md

This file provides context and guidance to Claude Code (claude.ai/code) when working with code in this repository. It serves as the single source of truth for understanding the project architecture, conventions, and development patterns. An AI assistant reading this file should be able to understand the project completely without needing to explore additional files.

## Project Overview

**edcilo.com v3** is the personal website and blog of edcilo. It functions as a professional landing page and portfolio showcasing the developer's information, personal projects, technical skills, and a blog with articles about technology, Linux, and recipes.

The site is fully static (SSG), bilingual (Spanish/English), supports dark mode, and is optimized for production.

- **Production URL:** https://edcilo.com
- **Version:** 3.0.0
- **Deployment:** Vercel (configured via `vercel.json` with cache headers)

## Tech Stack

### Core

| Technology       | Version        | Purpose                                              |
| ---------------- | -------------- | ---------------------------------------------------- |
| **Astro**        | 5.17.x         | Web framework -- Static Site Generation (SSG)        |
| **TypeScript**   | 5.9.x          | Language -- strict typing (`astro/tsconfigs/strict`) |
| **Tailwind CSS** | 4.1.x          | Styles -- utility-first CSS framework                |
| **Node.js**      | (see `.nvmrc`) | Runtime                                              |

### Integrations and Plugins

| Library                      | Purpose                                       |
| ---------------------------- | --------------------------------------------- |
| `@astrojs/sitemap`           | Automatic XML sitemap generation              |
| `@tailwindcss/vite`          | Vite plugin for Tailwind v4 (NOT PostCSS)     |
| `@fontsource-variable/inter` | Sans-serif font (Inter Variable, self-hosted) |
| `@fontsource/ibm-plex-mono`  | Monospace font (IBM Plex Mono, self-hosted)   |

### Dev Tools

| Tool                                                   | Purpose                                           |
| ------------------------------------------------------ | ------------------------------------------------- |
| `eslint` + `typescript-eslint` + `eslint-plugin-astro` | Code linting for TS/Astro                         |
| `eslint-config-prettier`                               | Disables ESLint rules that conflict with Prettier |
| `prettier` + `prettier-plugin-astro`                   | Code formatting                                   |
| `@astrojs/check`                                       | Astro-specific type checking                      |

## Commands

```bash
npm run dev          # Dev server at localhost:4321
npm run build        # Production build to ./dist/
npm run preview      # Preview production build
npm run check        # Astro type checking
npm run lint         # ESLint
npm run lint:fix     # ESLint with auto-fix
npm run format       # Prettier -- format all files
npm run format:check # Prettier -- check formatting
```

## Project Structure

```
edc_landingpage_v3/
├── public/                     # Static files served as-is
│   ├── favicon.svg             # Site favicon
│   ├── logo.svg                # Main logo
│   ├── og-default.jpg          # Default Open Graph image
│   └── robots.txt              # Crawler rules
├── src/
│   ├── assets/                 # Assets processed by Astro (image optimization)
│   │   └── portfolio/          # Portfolio project images (.webp)
│   ├── components/             # Reusable Astro components (26 components)
│   │   ├── Header.astro        # Main navigation with section links
│   │   ├── Footer.astro        # Footer with social links
│   │   ├── MobileDrawer.astro  # Mobile navigation drawer (slide-in, focus trap)
│   │   ├── ThemeToggle.astro   # Theme toggle button (light/dark/system)
│   │   ├── LanguageSwitcher.astro # Language selector (es/en)
│   │   ├── Container.astro     # Content wrapper with max-width
│   │   ├── SectionHeading.astro # Section title with subtitle
│   │   ├── Tooltip.astro       # CSS-only tooltip (::after pseudo-element)
│   │   ├── HeroSection.astro   # Hero section -- composes HeroContent, Badge, CTAs, Stats
│   │   ├── HeroContent.astro   # Name and title with RotatingText
│   │   ├── HeroBadge.astro     # Animated "Available for work" badge
│   │   ├── HeroCTAs.astro      # Hero action buttons
│   │   ├── HeroStats.astro     # Animated counters (years exp, projects, posts)
│   │   ├── HeroLocation.astro  # Geographic location indicator
│   │   ├── HeroScrollIndicator.astro # Animated scroll chevron (bounce)
│   │   ├── RotatingText.astro  # Rotating text with slide animation
│   │   ├── SkillsSection.astro # Skills/technologies section
│   │   ├── SkillCategoryCard.astro # Skill category card
│   │   ├── SkillPill.astro     # Individual technology pill
│   │   ├── TechIcon.astro      # Technology icon with inline SVG
│   │   ├── ProjectsSection.astro # Project portfolio section
│   │   ├── ProjectCard.astro   # Project card with optimized image
│   │   ├── LatestPosts.astro   # Latest blog posts section
│   │   ├── BlogPostCard.astro  # Post card with date, tags, reading time
│   │   ├── BlogTagFilter.astro # Blog tag filter (keyboard-navigable)
│   │   └── BlogSearchInput.astro # Post search input (real-time filtering)
│   ├── content/                # Content collections (Astro Content Layer)
│   │   └── blog/               # 23 Markdown posts (.md)
│   ├── data/                   # Typed static data
│   │   ├── projects.ts         # Portfolio projects (with i18n descriptionKey)
│   │   ├── skills.ts           # Skills and technologies by category
│   │   └── techIcons.ts        # Technology name to SVG path mapping
│   ├── i18n/                   # Internationalization system
│   │   ├── config.ts           # Constants: DEFAULT_LOCALE='es', LOCALES=['es','en']
│   │   ├── ui.ts               # UI_STRINGS -- all translated strings (es/en)
│   │   ├── utils.ts            # useTranslations(locale) -> t() helper function
│   │   └── index.ts            # Module re-exports
│   ├── layouts/                # Base page layouts
│   │   ├── Layout.astro        # Base layout: <head>, meta tags, OG, hreflang, skip-to-main, Header/Footer
│   │   └── BlogPostLayout.astro # Blog post layout: extends Layout, article semantics, prose styles
│   ├── pages/                  # Site routes (file-based routing)
│   │   ├── index.astro         # Home (Spanish, route: /)
│   │   ├── 404.astro           # Custom 404 page
│   │   ├── blog/
│   │   │   ├── index.astro     # Blog index (Spanish, route: /blog/)
│   │   │   └── [...slug].astro # Dynamic post (Spanish, route: /blog/{slug}/)
│   │   └── en/
│   │       ├── index.astro     # Home (English, route: /en/)
│   │       └── blog/
│   │           ├── index.astro     # Blog index (English, route: /en/blog/)
│   │           └── [...slug].astro # Dynamic post (English, route: /en/blog/{slug}/)
│   ├── styles/
│   │   └── global.css          # Global styles: @theme tokens, dark mode, animations, reduced-motion
│   └── utils/
│       └── readingTime.ts      # Reading time calculation (~200 words/min)
├── astro.config.mjs            # Astro config: site, i18n, sitemap, Tailwind Vite plugin
├── tsconfig.json               # TypeScript strict config (extends astro/tsconfigs/strict)
├── eslint.config.js            # ESLint flat config: TS + Astro + Prettier
├── .prettierrc                 # Prettier configuration
├── .prettierignore             # Files ignored by Prettier
├── .nvmrc                      # Node.js version
├── vercel.json                 # Cache headers for Vercel (assets immutable, images 24h)
├── CHANGELOG.md                # Project changelog
└── TODO.md                     # Prioritized list of pending improvements
```

## Architecture and Development Patterns

### Static Site Generation (SSG)

The site is generated entirely at build time. There is no server or runtime API. All pages are static HTML with minimal JavaScript for client-side interactivity (theme toggle, drawer, filters, animations).

### Component Architecture

- **Island Architecture (Astro):** Components are server-rendered by default (zero JS shipped). Only components requiring interactivity use client-side `<script>` tags.
- **Composition Pattern:** Page sections are composed from smaller components. For example, `HeroSection` composes `HeroContent`, `HeroBadge`, `HeroCTAs`, `HeroStats`, `HeroLocation`, and `HeroScrollIndicator`.
- **No client-side frameworks:** React, Vue, Svelte, etc. are not used. All interactivity is implemented with vanilla JavaScript in `<script>` tags inside `.astro` components.

### Internationalization (i18n)

- **Two locales:** Spanish (`es`, default) and English (`en`).
- **Routing:** Spanish has no prefix (`/`, `/blog/...`), English is prefixed (`/en/`, `/en/blog/...`). Configured in `astro.config.mjs` with `prefixDefaultLocale: false`.
- **Duplicated pages per locale:** `src/pages/index.astro` (es) and `src/pages/en/index.astro` (en).
- **UI strings:** Centralized in `src/i18n/ui.ts` as a `UI_STRINGS` object keyed by locale.
- **Helper:** `useTranslations(locale)` from `src/i18n/utils.ts` returns a `t(key)` function for accessing translations in components.
- **`TranslationKey` type:** Derived from the keys of `UI_STRINGS`. Adding a new string requires adding it to both locales (`es` and `en`).

### Content Management (Blog)

- **Astro Content Layer:** Posts are Markdown files in `src/content/blog/`.
- **Schema (Zod):** Defined in `src/content.config.ts` with fields: `title`, `description`, `date`, `updatedDate?`, `tags[]`, `draft`.
- **Draft filtering:** Posts with `draft: true` are excluded in `getStaticPaths()`.
- **Dynamic routes:** `[...slug].astro` generates one route per post.
- **23 published posts** currently.

### Styling Strategy

- **Tailwind CSS v4:** Integrated via Vite plugin (`@tailwindcss/vite`), NOT PostCSS.
- **Dark mode:** Class-based strategy (`dark` class on `<html>`), defined via `@custom-variant dark (&:where(.dark, .dark *))` in `global.css`.
- **Design tokens:** Colors, fonts, and other tokens defined in the `@theme` block in `global.css`, with dark mode overrides in the `.dark` selector.
- **Fonts:** Inter Variable (sans-serif) and IBM Plex Mono (monospace), self-hosted via `@fontsource`.
- **No CSS modules, no CSS-in-JS:** Everything is utility-first with Tailwind plus minimal global CSS for animations and tokens.

### Accessibility (a11y)

- Skip-to-main-content link.
- Semantic HTML landmarks (`<header>`, `<nav>`, `<main>`, `<footer>`, `<article>`, `<section>`).
- `aria-*` attributes on interactive components (drawer, filters, toggle).
- Focus trap and keyboard navigation in Mobile Drawer.
- `prefers-reduced-motion: reduce` global safety net with per-component overrides.
- WCAG AA target size (44x44px) on buttons.
- Dark/light mode contrast verification.

### Performance

- Images optimized with Astro's `<Image>` component (AVIF/WebP format, multiple widths).
- Font subsetting (latin + latin-ext).
- Cache headers configured in `vercel.json` (assets immutable 1 year, images 24h + stale-while-revalidate).
- Anti-FOUC inline script for theme.
- Zero client-side frameworks -- minimal vanilla JS.

## Data Files

- `src/data/projects.ts` -- Portfolio entries. Each project has a `descriptionKey` referencing a `TranslationKey` for i18n.
- `src/data/skills.ts` -- Skills and technologies organized by category.
- `src/data/techIcons.ts` -- Technology name to SVG path mapping for inline icons.

## Layout Structure

- `src/layouts/Layout.astro` -- Base layout with `<head>`, meta tags (OG, Twitter Cards), canonical URL, hreflang tags, anti-FOUC script, skip-to-main link, Header, Footer, and IntersectionObserver for entrance animations.
- `src/layouts/BlogPostLayout.astro` -- Blog post layout extending the base. Includes `<article>` semantics, prose styles (`.prose`), date, tags, reading time, and back link.
- **Page composition:** Home composes sections in order: `HeroSection` -> `SkillsSection` -> `ProjectsSection` -> `LatestPosts`.
