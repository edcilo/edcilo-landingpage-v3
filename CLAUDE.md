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

| Technology       | Version                           | Purpose                                                  |
| ---------------- | --------------------------------- | -------------------------------------------------------- |
| **Astro**        | 7.3.x                             | Web framework -- Static Site Generation (SSG)            |
| **TypeScript**   | 5.9.x                             | Language -- strict typing (`astro/tsconfigs/strict`)     |
| **Tailwind CSS** | 4.3.x                             | Styles -- utility-first CSS framework                    |
| **Node.js**      | 24 LTS (`.nvmrc`, `engines.node`) | Runtime (local and Vercel builds)                        |
| **pnpm**         | 11.x (`packageManager` field)     | Package manager -- `pnpm-lock.yaml` is the only lockfile |

### Integrations and Plugins

| Library                      | Purpose                                                                  |
| ---------------------------- | ------------------------------------------------------------------------ |
| `@astrojs/sitemap`           | Automatic XML sitemap generation                                         |
| `@tailwindcss/vite`          | Vite plugin for Tailwind v4 (NOT PostCSS)                                |
| `@fontsource-variable/inter` | Sans-serif font (Inter Variable, self-hosted)                            |
| `@fontsource/ibm-plex-mono`  | Monospace font (IBM Plex Mono, self-hosted)                              |
| `@vercel/analytics`          | Vercel Web Analytics (page views, events)                                |
| `sharp`                      | Image processing for `astro:assets` at build time                        |
| `js-yaml`                    | YAML <-> JSON conversion (JSON/YAML tool)                                |
| `jsbarcode`                  | Barcode generation (QR/barcode tool)                                     |
| `qrcode`                     | QR code generation (QR/barcode tool)                                     |
| `sql-formatter`              | SQL formatting, multi-dialect (SQL formatter tool)                       |
| `highlight.js`               | SQL syntax highlighting (SQL formatter tool; core + `sql` language only) |
| `gpt-tokenizer`              | Token counting, `o200k_base` / `cl100k_base` (token counter tool)        |
| `@mediapipe/tasks-vision`    | In-browser face detection (face anonymizer tool)                         |

### Dev Tools

| Tool                                                   | Purpose                                           |
| ------------------------------------------------------ | ------------------------------------------------- |
| `eslint` + `typescript-eslint` + `eslint-plugin-astro` | Code linting for TS/Astro                         |
| `eslint-config-prettier`                               | Disables ESLint rules that conflict with Prettier |
| `prettier` + `prettier-plugin-astro`                   | Code formatting                                   |
| `@astrojs/check`                                       | Astro-specific type checking                      |

### Version Constraints (do not "fix" without reading this)

- **`prettier-plugin-astro` stays on 0.14.x.** 1.x formats `.astro` files with JSX whitespace semantics (e.g. `·⏎{expr}` -> `·{expr}`), which drops visible spaces because this project uses `compressHTML: true`. Only upgrade together with a move to `compressHTML: 'jsx'` and a full review of rendered text.
- **`typescript` stays on 5.x** until `@astrojs/check` supports TS 7 (its peer range is `^5 || ^6`).
- **ESLint 10** is required by `eslint-plugin-astro` 3; its recommended config includes `no-useless-assignment` (declare `let x: T;` instead of a dead initial value).
- **`@mediapipe/tasks-vision`:** `FaceAnonymizerTool.astro` loads the WASM files from a jsDelivr URL pinned to the installed version (`.../tasks-vision@0.10.35/wasm`). Update that URL whenever the package version changes.

## Commands

```bash
nvm use               # Switch to the Node version in .nvmrc (24 LTS)
pnpm install          # Install dependencies (pnpm version pinned via packageManager / Corepack)
pnpm run dev          # Dev server at localhost:4321
pnpm run build        # Production build to ./dist/
pnpm run preview      # Preview production build
pnpm run check        # Astro type checking
pnpm run lint         # ESLint
pnpm run lint:fix     # ESLint with auto-fix
pnpm run format       # Prettier -- format all files
pnpm run format:check # Prettier -- check formatting
```

There is no test suite. Validate changes with `check`, `lint`, `format:check` and `build`. Do not use `npm install` (it would create a `package-lock.json`); build scripts allowed for native deps (`esbuild`, `sharp`) are declared in `pnpm-workspace.yaml` under `allowBuilds`.

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
│   ├── components/             # Reusable Astro components, grouped by purpose:
│   │   #
│   │   # Layout/chrome:  Header, Footer, MobileDrawer, ThemeToggle,
│   │   #                 LanguageSwitcher, Container, SectionHeading, Tooltip
│   │   # Hero:           HeroSection (composer) + HeroContent, HeroBadge,
│   │   #                 HeroCTAs, HeroStats, HeroLocation, HeroScrollIndicator,
│   │   #                 RotatingText, TypewriterHeading
│   │   # Skills:         SkillsSection, SkillCategoryCard, SkillPill, TechIcon
│   │   # Projects:       ProjectsSection, ProjectCard
│   │   # Blog:           LatestPosts, BlogPostCard, BlogTagFilter,
│   │   #                 BlogSearchInput, BlogPagination, RSVPReader
│   │   # Dev-tools:      ToolCategoryCard + one *Tool.astro per tool
│   │   #                 (Base64Tool, UrlEncoderTool, JwtDecoderTool,
│   │   #                  QrBarcodeTool, JsonYamlTool, EpochDateTool,
│   │   #                  HexRgbTool, SqlFormatterTool, GoogleDorksTool,
│   │   #                  UuidGeneratorTool, PasswordGeneratorTool,
│   │   #                  LoremIpsumTool, DiffTool, WordCounterTool,
│   │   #                  FaceAnonymizerTool, TokenCounterTool)
│   ├── content/                # Content collections (Astro Content Layer)
│   │   └── blog/               # Markdown posts (.md)
│   ├── content.config.ts       # Zod schema for the `blog` collection
│   ├── data/                   # Typed static data
│   │   ├── passwordWords.ts    # Word list for passphrase mode (password tool)
│   │   ├── projects.ts         # Portfolio projects (with i18n descriptionKey)
│   │   ├── skills.ts           # Skills and technologies by category
│   │   ├── techIcons.ts        # Technology name to SVG path mapping
│   │   └── toolCategories.ts   # Dev-tools index (category + tool metadata)
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
│   │   ├── api/
│   │   │   └── search-index.json.ts # SSG JSON endpoint: blog search index
│   │   ├── blog/               # /blog/ index + /blog/{slug}/ (Spanish)
│   │   ├── projects/           # /projects/ portfolio listing (Spanish)
│   │   ├── dev-tools/          # /dev-tools/ hub + one route per tool:
│   │   │                       #   base64/, url-encoder/, jwt/, qr-barcode/,
│   │   │                       #   json-yaml/, epoch-date/, hex-rgb/, sql-formatter/,
│   │   │                       #   google-dorks/, uuid/, password/, lorem-ipsum/,
│   │   │                       #   diff/, word-counter/, face-anonymizer/, token-counter/
│   │   └── en/                 # English mirror of all of the above (prefixed /en/)
│   ├── styles/
│   │   └── global.css          # Global styles: @theme tokens, dark mode, animations, reduced-motion
│   └── utils/
│       └── readingTime.ts      # Reading time calculation (~200 words/min)
├── astro.config.mjs            # Astro config: site, compressHTML, i18n, sitemap, Tailwind Vite plugin
├── tsconfig.json               # TypeScript strict config (extends astro/tsconfigs/strict)
├── eslint.config.js            # ESLint flat config: TS + Astro + Prettier
├── .prettierrc                 # Prettier configuration
├── .prettierignore             # Files ignored by Prettier
├── .nvmrc                      # Node.js version (24 LTS)
├── package.json                # Scripts, deps, packageManager (pnpm) and engines.node
├── pnpm-lock.yaml              # Lockfile (the only one; ignored by Prettier)
├── pnpm-workspace.yaml         # pnpm settings: allowBuilds for esbuild and sharp
├── vercel.json                 # Cache headers for Vercel (assets immutable, images 24h)
├── CHANGELOG.md                # Project changelog
└── TODO.md                     # Prioritized list of pending improvements
```

## Architecture and Development Patterns

### Static Site Generation (SSG)

The site is generated entirely at build time. There is no server or runtime API. All pages are static HTML with minimal JavaScript for client-side interactivity (theme toggle, drawer, filters, animations).

### HTML Whitespace (`compressHTML`)

`astro.config.mjs` sets `compressHTML: true` on purpose. Astro 7's default (`'jsx'`) strips whitespace between inline elements and merged visible text (e.g. `AM · 3` -> `AM·3`, nav links). Keep it unless you migrate templates to explicit `{' '}` spacing and verify the rendered text.

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
- **Schema (Zod 4):** Defined in `src/content.config.ts` (import `z` from `astro/zod`, not `astro:content`) with fields: `title`, `description`, `date`, `updatedDate?`, `tags[]`, `draft`.
- **Draft filtering:** Posts with `draft: true` are excluded in `getStaticPaths()`.
- **Dynamic routes:** `[...slug].astro` generates one route per post.
- **Search index:** `src/pages/api/search-index.json.ts` emits a static JSON (`/api/search-index.json`) consumed by `BlogSearchInput` for client-side search. When adding fields to the blog schema that the search needs, also extend the index payload.

### Dev Tools

- **Location:** `src/pages/dev-tools/` (hub + one folder per tool) mirrored in `src/pages/en/dev-tools/`.
- **Metadata:** `src/data/toolCategories.ts` drives the hub cards (`ToolCategoryCard`).
- **UI:** Each tool page delegates to its own `*Tool.astro` in `src/components/`.
- **Hub categories:** encoders, converters, formatters, generators, text utils and AI. Tools without an `href` in `toolCategories.ts` are planned but not built yet; they render as non-link pills.
- **Client-side only:** All tool logic runs in vanilla `<script>` blocks inside each `*Tool.astro`. Heavy dependencies (`js-yaml`, `jsbarcode`, `qrcode`, `sql-formatter`, `highlight.js`, `gpt-tokenizer`, `@mediapipe/tasks-vision`) are imported from those scripts (`gpt-tokenizer` encodings are loaded with dynamic `import()`) and bundled by Astro/Vite; do not import them from the `---` frontmatter unless the code must run at build time.

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

- Images optimized with `astro:assets` + `sharp` at build time. `ProjectCard` uses `<Picture formats={['avif']} fallbackFormat="webp">` with multiple widths (`fallbackFormat` only exists on `<Picture>`, not `<Image>`).
- Font subsetting (latin + latin-ext).
- Cache headers configured in `vercel.json` (assets immutable 1 year, images 24h + stale-while-revalidate).
- Anti-FOUC inline script for theme.
- Zero client-side frameworks -- minimal vanilla JS.

### Analytics

- **Vercel Web Analytics** is wired in the base `Layout.astro` via `@vercel/analytics`. It only sends data in production builds served by Vercel; no action is needed in local dev.

## Data Files

- `src/data/projects.ts` -- Portfolio entries. Each project has a `descriptionKey` referencing a `TranslationKey` for i18n.
- `src/data/skills.ts` -- Skills and technologies organized by category.
- `src/data/techIcons.ts` -- Technology name to SVG path mapping for inline icons.
- `src/data/toolCategories.ts` -- Dev-tools catalogue (categories + tools) that drives the `/dev-tools/` hub.

## Layout Structure

- `src/layouts/Layout.astro` -- Base layout with `<head>`, meta tags (OG, Twitter Cards), canonical URL, hreflang tags, anti-FOUC script, skip-to-main link, Header, Footer, and IntersectionObserver for entrance animations.
- `src/layouts/BlogPostLayout.astro` -- Blog post layout extending the base. Includes `<article>` semantics, prose styles (`.prose`), date, tags, reading time, and back link.
- **Page composition:** Home composes sections in order: `HeroSection` -> `SkillsSection` -> `ProjectsSection` -> `LatestPosts` (see `src/pages/index.astro` and its `en/` twin).
