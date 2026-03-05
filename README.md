# edcilo.com v3

Personal landing page and blog for [edcilo.com](https://edcilo.com), built with Astro 5, Tailwind CSS v4, and TypeScript.

## Tech Stack

- **Framework:** [Astro 5](https://astro.build/) (static output)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) via Vite plugin
- **Language:** TypeScript
- **Fonts:** Inter Variable, IBM Plex Mono
- **Hosting:** Vercel
- **Other:** Sitemap generation, class-based dark mode, i18n (es/en)

## Features

- Bilingual support (Spanish default, English with `/en/` prefix)
- Blog with Markdown content, tag filtering, and real-time search
- Project portfolio with optimized images (AVIF/WebP)
- Dark/light/system theme toggle with smooth transitions
- SEO: Open Graph, canonical URLs, sitemap, robots.txt, structured data ready
- Scroll-triggered entrance animations
- Fully responsive design

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
git clone https://github.com/edcilo/edcilo-landingpage-v3.git
cd edcilo-landingpage-v3
npm install
```

### Development

```bash
npm run dev          # Dev server at localhost:4321
```

### Build & Preview

```bash
npm run build        # Production build to ./dist/
npm run preview      # Preview production build locally
```

## Commands

| Command                | Action                    |
| :--------------------- | :------------------------ |
| `npm run dev`          | Start dev server          |
| `npm run build`        | Production build          |
| `npm run preview`      | Preview production build  |
| `npm run check`        | Astro type checking       |
| `npm run lint`         | ESLint                    |
| `npm run lint:fix`     | ESLint with auto-fix      |
| `npm run format`       | Prettier format all files |
| `npm run format:check` | Prettier check formatting |

## Project Structure

```
src/
├── components/       # Astro components (Header, Footer, BlogPostCard, etc.)
├── content/blog/     # Markdown blog posts
├── data/             # Projects, skills, and tech icons data
├── i18n/             # Internationalization (ui strings, utils)
├── layouts/          # Layout.astro, BlogPostLayout.astro
├── pages/            # Route pages (es: /, en: /en/)
├── styles/           # global.css with Tailwind and design tokens
└── utils/            # Utility functions
public/               # Static assets (favicon, og-image, robots.txt)
```

## License

All rights reserved.
