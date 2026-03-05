# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Dev server at localhost:4321
npm run build        # Production build to ./dist/
npm run preview      # Preview production build
npm run check        # Astro type checking
npm run lint         # ESLint
npm run lint:fix     # ESLint with auto-fix
npm run format       # Prettier format all files
npm run format:check # Prettier check formatting
```

## Architecture

This is a personal landing page and blog for edcilo.com, built with **Astro 5**, **Tailwind CSS v4**, and **TypeScript**.

### Internationalization (i18n)

- Two locales: Spanish (`es`, default) and English (`en`).
- Spanish routes have no prefix (`/`, `/blog/...`), English routes are prefixed (`/en/`, `/en/blog/...`).
- Pages are duplicated per locale: `src/pages/index.astro` (es) and `src/pages/en/index.astro` (en).
- All UI strings live in `src/i18n/ui.ts` as a single `UI_STRINGS` object keyed by locale.
- Use `useTranslations(locale)` from `src/i18n/utils.ts` to get a `t()` function in components.
- The `TranslationKey` type is derived from the keys of `UI_STRINGS`, so adding a new string requires adding it to both `es` and `en`.

### Content (Blog)

- Blog posts are Markdown files in `src/content/blog/`.
- Content collection defined in `src/content.config.ts` with schema: `title`, `description`, `date`, `updatedDate?`, `tags[]`, `draft` (drafts are filtered out in `getStaticPaths`).
- Blog pages use `[...slug].astro` for dynamic routes with `getStaticPaths()`.

### Styling

- Tailwind CSS v4 via Vite plugin (not PostCSS), configured in `astro.config.mjs`.
- Dark mode uses class-based strategy (`dark` class on `<html>`), defined via `@custom-variant` in `src/styles/global.css`.
- Design tokens (colors, fonts) are defined in `src/styles/global.css` using `@theme` block, with dark overrides in `.dark` selector.
- Fonts: Inter Variable (sans), IBM Plex Mono (mono).

### Data Files

- `src/data/projects.ts` — Project portfolio entries. Each project has a `descriptionKey` referencing a `TranslationKey` for i18n.
- `src/data/skills.ts` — Skills/technologies data.
- `src/data/techIcons.ts` — Tech icon mappings.

### Layout Structure

- `src/layouts/Layout.astro` — Base layout with `<head>`, theme anti-FOUC script, hreflang tags, Header/Footer.
- `src/layouts/BlogPostLayout.astro` — Blog post layout extending the base.
- Pages compose sections: `HeroSection`, `SkillsSection`, `ProjectsSection`, `LatestPosts`.
