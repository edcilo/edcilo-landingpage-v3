# Changelog

Registro de cambios del proyecto edcilo.com v3.

---

## 2026-03-06 — Agregar proyecto Logographic Memory

**Solicitud:** Agregar la aplicación [Logographic Memory](https://logographic.edcilo.com) a la sección de proyectos del sitio.

**Plan ejecutado:**

1. Se tomó una captura de pantalla de la app con Playwright y se convirtió a WebP (`src/assets/portfolio/05_logographic.webp`).
2. Se agregó el proyecto como primer elemento del array `PROJECTS` en `src/data/projects.ts` con las tecnologías: TypeScript, React, Next.js, Mantine, Tailwind.
3. Se agregaron las traducciones de la descripción en español e inglés en `src/i18n/ui.ts`.

**Resultado:**

- **3 archivos modificados/creados:** `src/assets/portfolio/05_logographic.webp`, `src/data/projects.ts`, `src/i18n/ui.ts`
- **Build:** Compilación exitosa (51 páginas generadas), imagen optimizada en 4 variantes AVIF.

---

## 2026-03-05 — Soporte `prefers-reduced-motion: reduce`

**Solicitud:** Implementar soporte para `prefers-reduced-motion: reduce` en todas las animaciones CSS y JS del sitio, mejorando la accesibilidad para usuarios con sensibilidad al movimiento.

**Plan ejecutado:**

1. Se agregó una regla global CSS en `src/styles/global.css` como "safety net" que cubre todas las transiciones y animaciones del sitio (incluyendo smooth scroll, hover transitions de Tailwind, drawer mobile, gradientes, glow orbs, y micro-interacciones).
2. Se cambió `animate-bounce` por `motion-safe:animate-bounce` en `HeroScrollIndicator.astro` (forma idiomática de Tailwind v4).
3. Se verificó que `ProjectCard.astro` ya contaba con `motion-reduce:transition-none`.
4. Se confirmó que las animaciones JS existentes (`RotatingText`, `HeroStats`) ya consultaban `matchMedia('(prefers-reduced-motion: reduce)')`.

**Resultado:**

- **2 archivos modificados:** `src/styles/global.css`, `src/components/HeroScrollIndicator.astro`
- **1 archivo verificado sin cambios:** `src/components/ProjectCard.astro`
- **Cobertura:** 100% de animaciones CSS y JS del sitio ahora respetan `prefers-reduced-motion: reduce`
- **QA:** Aprobado sin observaciones bloqueantes. Lint, format, build exitosos.
- **Rama:** `feature/prefers-reduced-motion`
