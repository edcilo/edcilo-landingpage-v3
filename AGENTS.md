# AGENTS.md

> Instructions for AI coding agents operating in this repository.

## Project Overview

This is an **Astro 5.x** static landing page project (`edc-landingpage-v3`). It uses TypeScript in strict mode, ESM modules, and Astro single-file components (`.astro`). The build system is Astro's built-in Vite-based pipeline. Package manager is **npm**.

- **Node.js:** v22+
- **Astro:** ^5.17.1
- **Output:** Static site (default mode, generates to `./dist/`)

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
npx astro check
```

## Testing

No test framework is currently configured. If tests are added in the future:

- Prefer **Vitest** as the test runner (native Vite/Astro compatibility).
- Place test files next to their source files as `*.test.ts` or in a `__tests__/` directory.
- Add a `"test"` script to `package.json`.
- To run a single test: `npx vitest run path/to/file.test.ts`
- To run tests in watch mode: `npx vitest`

## Linting / Formatting

No linter or formatter is currently configured. If tooling is added:

- Prefer **ESLint** with `eslint-plugin-astro` for linting.
- Prefer **Prettier** with `prettier-plugin-astro` for formatting.
- Run lint: `npm run lint` (once configured)
- Run format: `npm run format` (once configured)

## Directory Structure

```
├── public/              # Static assets served at root (favicon, etc.)
├── src/
│   ├── assets/          # Processed assets (images, SVGs optimized by Astro)
│   ├── components/      # Reusable Astro components (PascalCase)
│   ├── layouts/         # Page layout wrappers (PascalCase)
│   └── pages/           # File-based routing (lowercase)
├── astro.config.mjs     # Astro configuration
├── tsconfig.json        # TypeScript config (extends astro/tsconfigs/strict)
└── package.json
```

## TypeScript Configuration

- **Strict mode** is enabled (`extends: "astro/tsconfigs/strict"`).
- Target: `ESNext`, Module: `ESNext`, Module resolution: `Bundler`.
- `verbatimModuleSyntax` is enabled -- use `import type { ... }` for type-only imports.
- `isolatedModules` is enabled -- avoid `const enum` and other non-isolated patterns.
- `noEmit` is true -- Astro handles compilation; TS is for type-checking only.
- Always define a `Props` interface in components that accept props.

## Code Style Guidelines

### File Naming

- **Components:** PascalCase (`MyComponent.astro`)
- **Layouts:** PascalCase (`BaseLayout.astro`)
- **Pages:** lowercase/kebab-case (`index.astro`, `about-us.astro`)
- **TypeScript files:** camelCase (`utils.ts`, `apiClient.ts`)
- **Assets:** lowercase/kebab-case (`hero-background.svg`)

### Astro Component Structure

Follow this order within `.astro` files:

```astro
---
// 1. Imports (components, then assets, then utilities)
import MyComponent from '../components/MyComponent.astro';
import heroImage from '../assets/hero.svg';

// 2. Props interface
interface Props {
	title: string;
}

// 3. Props destructuring and logic
const { title } = Astro.props;
---

<!-- 4. Template (HTML markup) -->
<div class="container">
	<h1>{title}</h1>
	<MyComponent />
</div>

<!-- 5. Scoped styles -->
<style>
	.container {
		max-width: 1200px;
	}
</style>
```

### Imports

- Use **relative paths** (`../components/...`). No path aliases are configured.
- Import Astro components with their `.astro` extension.
- Import assets from `src/assets/` and access `.src` for the URL (e.g., `heroImage.src`).
- Group imports: components first, then assets, then utilities/types.
- Use `import type { ... }` for type-only imports (enforced by `verbatimModuleSyntax`).

### HTML / Templates

- Use **tabs** for indentation (consistent with the Astro starter).
- Use **double quotes** for HTML attributes.
- Use Astro expression syntax for dynamic values: `attr={value}`.
- Use `<slot />` in layouts and wrapper components for content projection.

### CSS

- Use **scoped `<style>` blocks** within Astro components (default Astro behavior).
- Prefer **class selectors** (`.my-class`) over ID selectors for reusable components.
- Use **kebab-case** for CSS class and ID names.
- Use modern CSS features (flexbox, grid, custom properties).
- Mobile-first responsive design using `@media` queries.
- No CSS preprocessor or framework is installed. Use vanilla CSS.
- Prefer CSS custom properties (`--color-primary`) for theming and reuse.

### JavaScript / TypeScript

- All code is ESM (`"type": "module"` in package.json).
- Use `const` by default; use `let` only when reassignment is needed. Never use `var`.
- Use arrow functions for inline callbacks; named `function` declarations for top-level.
- Prefer template literals over string concatenation.
- Always annotate function parameters and return types in `.ts` files.
- Use strict equality (`===`, `!==`).

### Error Handling

- Wrap async operations in `try/catch` blocks.
- Provide meaningful error messages with context.
- In Astro pages/endpoints, return appropriate HTTP status codes.
- Never silently swallow errors -- at minimum, log them.

### Naming Conventions

- **Variables / functions:** camelCase (`getUserData`, `isActive`)
- **Types / Interfaces:** PascalCase (`UserProfile`, `PageProps`)
- **Constants:** UPPER_SNAKE_CASE for true constants (`MAX_RETRIES`, `API_BASE_URL`)
- **Booleans:** prefix with `is`, `has`, `should` (`isVisible`, `hasPermission`)
- **Event handlers:** prefix with `handle` or `on` (`handleClick`, `onSubmit`)

### General Principles

- Keep components small and focused on a single responsibility.
- Extract shared logic into utility functions in `src/utils/`.
- Keep pages thin -- delegate rendering to layout and component files.
- Prefer static rendering (Astro's default). Only add client-side JS when necessary.
- When adding framework islands (React, Vue, etc.), use `client:*` directives judiciously.
- Do not commit `node_modules/`, `dist/`, or `.astro/` (covered by `.gitignore`).
