# TODO - Mejoras para edcilo.com v3

Lista priorizada de mejoras organizadas por area.

---

## Home

- [x] [Alta] Agregar meta tags Open Graph (`og:title`, `og:description`, `og:image`, `og:url`) y Twitter Cards en `Layout.astro`
- [x] [Alta] Agregar enlace "Saltar al contenido principal" (skip-to-main) visible al hacer focus, antes del `<Header>`
- [x] [Media] Optimizar imagenes del portafolio con el componente `<Image>` de Astro en lugar de `<img>` en `ProjectCard.astro`
- [x] [Media] Agregar animaciones de entrada (fade-in / slide-up) en las secciones al hacer scroll con `IntersectionObserver`
- [ ] [Media] Incluir seccion de contacto o formulario en la pagina principal
- [ ] [Baja] Agregar mas proyectos al portafolio en `src/data/projects.ts` (minimo 3 adicionales)
- [x] [Baja] Mostrar contador de articulos publicados en `HeroStats`

## Blog

- [ ] [Alta] Agregar tabla de contenidos (TOC) automatica en `BlogPostLayout.astro` a partir de los headings del post
- [x] [Alta] Mostrar tiempo estimado de lectura en cada post (calcular en base a ~200 palabras/minuto)
- [ ] [Media] Implementar paginacion en el indice del blog (`/blog/index.astro`) cuando supere 10 posts
- [ ] [Media] Agregar navegacion entre posts (anterior / siguiente) al final de cada articulo
- [ ] [Media] Agregar componente de compartir en redes sociales (Twitter/X, LinkedIn, copiar enlace) en cada post
- [x] [Baja] Agregar busqueda de posts por titulo/contenido con filtro en tiempo real
- [ ] [Baja] Agregar vista de archivo por fecha (agrupados por mes/anio)

## SEO

- [x] [Alta] Crear archivo `public/robots.txt` con reglas para permitir rastreo y referencia al sitemap
- [ ] [Alta] Agregar datos estructurados JSON-LD: `Person` en Home y `BlogPosting` en cada articulo del blog
- [x] [Alta] Agregar etiquetas `<link rel="canonical">` en todas las paginas, especialmente las rutas i18n
- [ ] [Media] Crear `public/manifest.webmanifest` con nombre, iconos y colores del tema
- [ ] [Media] Agregar meta tag `article:published_time` y `article:modified_time` en posts del blog
- [ ] [Baja] Generar feed RSS (`/rss.xml`) con `@astrojs/rss` para los articulos del blog
- [ ] [Baja] Validar todas las paginas con Lighthouse SEO score >= 95

## Performance

- [x] [Alta] Usar el componente `<Image>` de Astro para todas las imagenes (portafolio y blog) con formatos optimizados (avif/webp)
- [ ] [Media] Aplicar subset a las fuentes Inter Variable e IBM Plex Mono para reducir peso (solo latin + latin-ext)
- [ ] [Media] Agregar `<link rel="preconnect">` para origenes de fuentes y recursos externos
- [ ] [Media] Implementar `<link rel="preload">` para la fuente principal (Inter Variable)
- [ ] [Baja] Medir y registrar puntuacion de Core Web Vitals (LCP < 2.5s, CLS < 0.1, INP < 200ms) con Lighthouse CI
- [x] [Baja] Agregar cabeceras de cache (`Cache-Control`) en la configuracion del servidor/CDN para assets estaticos

## UX/Accesibilidad

- [ ] [Alta] Verificar contraste de color del texto `muted-foreground` contra fondo en modo claro y oscuro (cumplir WCAG AA, ratio >= 4.5:1)
- [ ] [Alta] Asegurar navegacion completa por teclado en `BlogTagFilter` (flechas, Enter, focus visible)
- [ ] [Media] Agregar indicador visual de seccion activa en la navegacion movil (`MobileDrawer`)
- [ ] [Media] Agregar transicion suave al cambiar entre modo claro/oscuro (transition en `background-color` y `color`)
- [ ] [Media] Revisar y mejorar el tamano de los targets tactiles en movil (minimo 44x44px segun WCAG 2.5.8)
- [ ] [Baja] Agregar soporte para `prefers-reduced-motion: reduce` en todas las animaciones CSS y JS
- [ ] [Baja] Ejecutar auditoria completa con axe-core o Lighthouse Accessibility y corregir issues reportados

## Contenido

- [ ] [Alta] Traducir al ingles los 23 posts del blog existentes o marcar los no traducidos con aviso de idioma
- [ ] [Media] Publicar al menos 2 articulos nuevos por mes para mantener el blog activo
- [ ] [Media] Agregar seccion "Sobre mi" (`/about`) con biografia extendida, experiencia y stack tecnologico
- [ ] [Baja] Actualizar `README.md` del repositorio con descripcion real del proyecto, stack, y pasos de instalacion
- [ ] [Baja] Agregar pagina 404 personalizada con diseno coherente y enlace al inicio

## DevEx

- [ ] [Alta] Configurar pipeline CI con GitHub Actions: lint, format check, type check y build en cada PR
- [ ] [Alta] Agregar framework de testing (Vitest) con al menos tests unitarios para funciones de `src/i18n/utils.ts` y `src/data/`
- [ ] [Media] Configurar pre-commit hooks con Husky + lint-staged para ejecutar lint y format antes de cada commit
- [ ] [Media] Agregar tests E2E con Playwright para flujos criticos: navegacion, cambio de idioma, filtro de tags del blog
- [ ] [Media] Configurar despliegue automatico (Vercel/Netlify/Cloudflare Pages) desde la rama `main`
- [ ] [Baja] Agregar Lighthouse CI en el pipeline para monitorear regresiones de performance y accesibilidad
- [ ] [Baja] Documentar la arquitectura del proyecto y convenciones en `CONTRIBUTING.md`
