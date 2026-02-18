# AGENTS.md

> Instructions for AI coding agents operating in this repository.

## Project Overview

This is an **Astro 5.x** static landing page project (`edc-landingpage-v3`) for [edcilo.com](https://edcilo.com). It uses TypeScript in strict mode, ESM modules, **Tailwind CSS v4** (via `@tailwindcss/vite`), and Astro single-file components (`.astro`). The build system is Astro's built-in Vite-based pipeline. Package manager is **npm**.

- **Node.js:** v22+
- **Astro:** ^5.17.1
- **Tailwind CSS:** ^4.1.18 (v4, using `@tailwindcss/vite` plugin — NOT the classic PostCSS setup)
- **TypeScript:** ^5.9.3
- **Output:** Static site (default mode, generates to `./dist/`)
- **Fonts:** Inter Variable (sans), IBM Plex Mono (mono)

## Build / Dev / Preview Commands

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:4321)
npm run dev

# Production build (outputs to ./dist/)
npm run build

# Preview production build locally
npm run preview

# Astro CLI passthrough (e.g., npm run astro -- add react)
npm run astro -- <command>

# Type-check the project (uses astro check internally)
npm run check
```

## Testing

No test framework is currently configured. If tests are added in the future:

- Prefer **Vitest** as the test runner (native Vite/Astro compatibility).
- Place test files next to their source files as `*.test.ts` or in a `__tests__/` directory.
- Add a `"test"` script to `package.json`.
- To run a single test: `npx vitest run path/to/file.test.ts`
- To run tests in watch mode: `npx vitest`

## Linting / Formatting

ESLint and Prettier are configured and **must pass before committing**.

```bash
# Check formatting (Prettier)
npm run format:check

# Auto-fix formatting
npm run format

# Lint (ESLint with eslint-plugin-astro + typescript-eslint)
npm run lint

# Auto-fix lint errors
npm run lint:fix
```

**Pre-commit verification order:** `format:check` → `lint` → `build` → `check`

## i18n (Internationalization)

The site supports **two locales**: Spanish (default) and English.

- **Default locale:** `es` (no URL prefix — served at `/`)
- **English locale:** `en` (prefixed at `/en/`)
- **Configuration:** `src/i18n/config.ts` — exports `DEFAULT_LOCALE`, `LOCALES`, `Locale` type
- **Translation strings:** `src/i18n/ui.ts` — `UI_STRINGS` object with `as const` (keys are auto-inferred as `TranslationKey`)
- **Utilities:** `src/i18n/utils.ts` — `useTranslations(locale)` returns a typed `t()` function
- **Routing:** Astro's built-in `i18n` with `prefixDefaultLocale: false`

When adding new UI text:

1. Add the key to **both** `es` and `en` in `src/i18n/ui.ts`
2. Use `t('key.name')` in components via `useTranslations()`
3. For pages that need both locales, create `src/pages/<page>.astro` (es) and `src/pages/en/<page>.astro` (en)

## Content Collections

Blog posts use Astro's Content Collections (v5).

- **Content directory:** `src/content/blog/` (Markdown files)
- **Schema config:** `src/content.config.ts`
- Blog posts support frontmatter fields: `title`, `description`, `date`, `updatedDate`, `tags`, `draft`

## Directory Structure

```
├── public/              # Static assets served at root (favicon, etc.)
├── src/
│   ├── assets/          # Processed assets (images, SVGs optimized by Astro)
│   ├── components/      # Reusable Astro components (PascalCase)
│   ├── content/
│   │   └── blog/        # Markdown blog posts (Content Collections)
│   ├── data/            # Static data modules (projects, skills, techIcons)
│   ├── i18n/            # Internationalization (config, ui strings, utils)
│   ├── layouts/         # Page layout wrappers (PascalCase)
│   ├── pages/           # File-based routing (lowercase)
│   │   ├── blog/        # Blog pages (es locale)
│   │   └── en/          # English locale pages
│   │       └── blog/    # Blog pages (en locale)
│   └── styles/
│       └── global.css   # Tailwind v4 import, design tokens, dark mode
├── astro.config.mjs     # Astro configuration (Tailwind vite plugin, sitemap, i18n)
├── tsconfig.json        # TypeScript config (extends astro/tsconfigs/strict)
└── package.json
```

## Tailwind CSS v4

This project uses **Tailwind CSS v4** — NOT the legacy v3 PostCSS setup.

- **Integration:** Via `@tailwindcss/vite` plugin in `astro.config.mjs`
- **Entry point:** `src/styles/global.css` — imports `tailwindcss` directly
- **Dark mode:** Class-based via `@custom-variant dark (&:where(.dark, .dark *));`
- **Design tokens:** Defined in `@theme { }` block in `global.css` (custom colors, fonts)
- **Semantic color tokens:** `--color-background`, `--color-foreground`, `--color-muted`, `--color-muted-foreground`, `--color-border`, `--color-primary`, `--color-primary-foreground`, `--color-accent`, `--color-accent-foreground`
- **No `tailwind.config.js`** — Tailwind v4 uses CSS-first configuration

When styling components:

- Use Tailwind utility classes directly in templates
- Use semantic color tokens (e.g., `text-foreground`, `bg-muted`, `border-border`)
- Use `font-sans` (Inter) for body text, `font-mono` (IBM Plex Mono) for headings and code
- Prefer Tailwind utilities over scoped `<style>` blocks

## TypeScript Configuration

- **Strict mode** is enabled (`extends: "astro/tsconfigs/strict"`).
- Target: `ESNext`, Module: `ESNext`, Module resolution: `Bundler`.
- `verbatimModuleSyntax` is enabled — use `import type { ... }` for type-only imports.
- `isolatedModules` is enabled — avoid `const enum` and other non-isolated patterns.
- `noEmit` is true — Astro handles compilation; TS is for type-checking only.
- Always define a `Props` interface in components that accept props.

## Code Style Guidelines

### File Naming

- **Components:** PascalCase (`MyComponent.astro`)
- **Layouts:** PascalCase (`BaseLayout.astro`)
- **Pages:** lowercase/kebab-case (`index.astro`, `about-us.astro`)
- **TypeScript files:** camelCase (`utils.ts`, `apiClient.ts`)
- **Data files:** camelCase (`projects.ts`, `skills.ts`, `techIcons.ts`)
- **Assets:** lowercase/kebab-case (`hero-background.svg`)
- **Blog posts:** lowercase/kebab-case (`my-blog-post.md`)

### Astro Component Structure

Follow this order within `.astro` files:

```astro
---
// 1. Imports (components, then assets, then data/utilities)
import MyComponent from '../components/MyComponent.astro';
import heroImage from '../assets/hero.svg';
import { someData } from '../data/someData';

// 2. Props interface
interface Props {
	title: string;
}

// 3. Props destructuring and logic
const { title } = Astro.props;
---

<!-- 4. Template (HTML markup with Tailwind classes) -->
<div class="mx-auto max-w-7xl px-4">
	<h1 class="font-mono text-2xl font-bold text-foreground">{title}</h1>
	<MyComponent />
</div>

<!-- 5. Scoped styles (only when Tailwind utilities are insufficient) -->
<style>
	/* Use sparingly — prefer Tailwind utilities */
</style>

<!-- 6. Client-side scripts (only when interactivity is needed) -->
<script>
	// Vanilla JS only — no framework islands unless necessary
</script>
```

### Imports

- Use **relative paths** (`../components/...`). No path aliases are configured.
- Import Astro components with their `.astro` extension.
- Import assets from `src/assets/` and access `.src` for the URL (e.g., `heroImage.src`).
- Group imports: components first, then assets, then data/utilities/types.
- Use `import type { ... }` for type-only imports (enforced by `verbatimModuleSyntax`).

### HTML / Templates

- Use **tabs** for indentation (consistent with the Astro/Prettier config).
- Use **double quotes** for HTML attributes.
- Use Astro expression syntax for dynamic values: `attr={value}`.
- Use `<slot />` in layouts and wrapper components for content projection.

### CSS / Styling

- Use **Tailwind CSS v4 utility classes** as the primary styling method.
- Use **scoped `<style>` blocks** only when Tailwind utilities are insufficient (e.g., complex animations, `@keyframes`).
- Use semantic color tokens: `text-foreground`, `bg-background`, `border-border`, etc.
- Use **kebab-case** for CSS class and ID names when custom classes are needed.
- Mobile-first responsive design using Tailwind breakpoints (`sm:`, `md:`, `lg:`).
- Dark mode using `dark:` variant (class-based, not media query).

### JavaScript / TypeScript

- All code is ESM (`"type": "module"` in package.json).
- Use `const` by default; use `let` only when reassignment is needed. Never use `var`.
- Use arrow functions for inline callbacks; named `function` declarations for top-level.
- Prefer template literals over string concatenation.
- Always annotate function parameters and return types in `.ts` files.
- Use strict equality (`===`, `!==`).
- Client-side scripts: vanilla JS only. No framework islands unless absolutely necessary.

### Error Handling

- Wrap async operations in `try/catch` blocks.
- Provide meaningful error messages with context.
- In Astro pages/endpoints, return appropriate HTTP status codes.
- Never silently swallow errors — at minimum, log them.

### Naming Conventions

- **Variables / functions:** camelCase (`getUserData`, `isActive`)
- **Types / Interfaces:** PascalCase (`UserProfile`, `PageProps`)
- **Constants:** UPPER_SNAKE_CASE for true constants (`MAX_RETRIES`, `API_BASE_URL`)
- **Booleans:** prefix with `is`, `has`, `should` (`isVisible`, `hasPermission`)
- **Event handlers:** prefix with `handle` or `on` (`handleClick`, `onSubmit`)
- **i18n keys:** dot-separated, lowercase (`hero.cta.projects`, `blog.filter.all`)

### General Principles

- Keep components small and focused on a single responsibility.
- Extract shared logic into utility functions in `src/utils/`.
- Extract static data (projects, skills, icons) into `src/data/`.
- Keep pages thin — delegate rendering to layout and component files.
- Prefer static rendering (Astro's default). Only add client-side JS when necessary.
- When adding framework islands (React, Vue, etc.), use `client:*` directives judiciously.
- Do not commit `node_modules/`, `dist/`, or `.astro/` (covered by `.gitignore`).
