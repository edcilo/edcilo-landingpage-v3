# Changelog

Registro de cambios del proyecto edcilo.com v3.

---

## 2026-03-12 — Herramienta URL Encoder/Decoder

**ID:** TASK-2026-03-12-007

**Solicitud:** Crear una herramienta funcional "URL Encoder / Decoder" en su propia página bajo Dev Tools. La página tiene dos textareas (texto sin codificar arriba, URL codificada abajo) con un botón "Convertir" en medio que detecta automáticamente la dirección de la conversión. Bilingüe (es/en). La pill "URL" en el índice de Dev Tools se convierte en link navegable a la herramienta. Incluye link al artículo del blog sobre anatomía de URLs.

**Plan ejecutado:**

1. Se agregaron 10 claves de traducción i18n (`devtools.url.*`) en español e inglés en `src/i18n/ui.ts`.
2. Se actualizó `src/data/toolCategories.ts` para agregar `href: '/dev-tools/url-encoder/'` a la pill "URL" en la categoría Encoders.
3. Se creó `src/components/UrlEncoderTool.astro` con: 2 textareas (`rows="8"`), botón de conversión con icono SVG, mensaje de error con `role="alert"`, lógica vanilla JS con `encodeURIComponent()`/`decodeURIComponent()`, patrón `data-*-initialized`, listener `astro:page-load`.
4. Se crearon las páginas `src/pages/dev-tools/url-encoder/index.astro` (es) y `src/pages/en/dev-tools/url-encoder/index.astro` (en) con back link, SectionHeading, UrlEncoderTool y link al artículo `url-anatomy`.
5. QA validó: build (81 páginas, 0 errores), lint (0 errores), format (pass), i18n simétrico (10 claves × 2 idiomas), consistencia con Base64Tool, accesibilidad (labels, role="alert", focus styles, aria-hidden), no-regresión — 9/9 checks PASS.

**Resultado:**

- **3 archivos creados:** `src/components/UrlEncoderTool.astro`, `src/pages/dev-tools/url-encoder/index.astro`, `src/pages/en/dev-tools/url-encoder/index.astro`
- **2 archivos modificados:** `src/i18n/ui.ts`, `src/data/toolCategories.ts`
- **Rutas nuevas:** `/dev-tools/url-encoder/` (es), `/en/dev-tools/url-encoder/` (en)
- **Build:** 81 páginas generadas exitosamente, sin errores
- **QA:** Build, lint, format, i18n, consistencia, accesibilidad y no-regresión — todos PASS

---

## 2026-03-12 — Link al artículo del blog en la herramienta Base64

**ID:** TASK-2026-03-12-006

**Solicitud:** Agregar un link en la página de la herramienta Base64 que redirija al artículo del blog sobre Base64 en terminal, con un copy informativo estilo "para saber más...".

**Plan ejecutado:**

1. Se agregaron 2 claves de traducción i18n (`devtools.base64.learnMore`, `devtools.base64.learnMore.link`) en español e inglés en `src/i18n/ui.ts`.
2. Se agregó un párrafo con link localizado debajo del componente `Base64Tool` en ambas páginas (es/en).
3. QA validó: i18n simétrico, link correcto con `getLocalizedPath`, build (79 páginas, 0 errores), lint (0 errores), format (pass) — 18/18 checks PASS.

**Resultado:**

- **3 archivos modificados:** `src/i18n/ui.ts`, `src/pages/dev-tools/base64/index.astro`, `src/pages/en/dev-tools/base64/index.astro`
- **Build:** 79 páginas generadas exitosamente, sin errores
- **QA:** Todos los checks PASS

---

## 2026-03-12 — Nuevo artículo de blog: base64 en terminal

**ID:** TASK-2026-03-12-005

**Solicitud:** Crear un artículo para el blog sobre cómo codificar y decodificar texto y archivos en Base64 desde la terminal (comando `base64`), con un link al artículo existente de portapapeles en terminal. Artículo corto y enfocado, estilo `scp.md`.

**Plan ejecutado:**

1. Se analizaron las convenciones editoriales de los artículos existentes del blog (scp, grep, clipboard-terminal).
2. Se redactó el artículo completo en español con 7 secciones: introducción, sintaxis, banderas comunes, ejemplos de uso (6 subsecciones), diferencias Linux/macOS, combinaciones útiles (con link a `/blog/clipboard-terminal/`), y buenas prácticas.
3. Se creó el archivo `src/content/blog/base64.md`.
4. QA validó: frontmatter, valores Base64 verificados contra terminal real, contenido editorial, link interno, build (79 páginas, 0 errores), lint (0 errores), format (pass), no-regresión — todos PASS.

**Resultado:**

- **1 archivo creado:** `src/content/blog/base64.md`
- **Tags:** `linux`, `terminal`
- **Contenido:** 138 líneas, 7 secciones, 2 tablas, 10 bloques de código, 7 buenas prácticas, 1 link interno a `/blog/clipboard-terminal/`
- **Build:** 79 páginas generadas exitosamente, sin errores
- **QA:** Build, lint, format, contenido y no-regresión — todos PASS

---

## 2026-03-12 — Herramienta Base64 Encoder/Decoder

**ID:** TASK-2026-03-12-004

**Solicitud:** Crear una herramienta funcional "Base64 Text Encoder/Decoder" en su propia página bajo Dev Tools. La página tiene dos textareas grandes (texto plano arriba, Base64 abajo) con un botón "Convertir" en medio que detecta automáticamente la dirección de la conversión: si el textarea superior tiene contenido lo codifica a Base64, si solo el inferior tiene contenido lo decodifica a texto plano, y si ambos tienen contenido da prioridad al texto plano. Bilingüe (es/en). La pill "Base64" en el índice de Dev Tools se convierte en link navegable a la herramienta.

**Plan ejecutado:**

1. Se realizó brainstorming con el usuario para definir: ruta (`/dev-tools/base64/`), pill clickeable (solo Base64 como link), link de retorno "← Volver a Dev Tools".
2. Se agregaron 9 claves de traducción i18n (`devtools.backToDevTools`, `devtools.base64.*`) en español e inglés en `src/i18n/ui.ts`.
3. Se extendió `src/data/toolCategories.ts` con la interfaz `Tool` (`name` + `href?`) para soportar pills clickeables. Solo Base64 tiene `href`.
4. Se modificó `src/components/ToolCategoryCard.astro` para renderizar pills con `href` como `<a>` con estilo diferenciado (hover primario + icono flecha) y pills sin `href` como `<span>`.
5. Se creó `src/components/Base64Tool.astro` con: 2 textareas (`rows="8"`), botón de conversión con icono SVG, mensaje de error con `role="alert"`, lógica vanilla JS con soporte Unicode (TextEncoder/TextDecoder), patrón `data-*-initialized`, listener `astro:page-load`.
6. Se crearon las páginas `src/pages/dev-tools/base64/index.astro` (es) y `src/pages/en/dev-tools/base64/index.astro` (en) con back link, SectionHeading y Base64Tool.
7. Se agregó prop `locale` a las páginas index de dev-tools (es/en) para la localización de links en pills.
8. QA validó: build (77 páginas, 0 errores), lint (0 errores), format (corregido automáticamente), i18n simétrico (9 claves × 2 idiomas), accesibilidad (labels, role="alert", focus styles, aria-hidden), no-regresión — todos PASS.

**Resultado:**

- **3 archivos creados:** `src/components/Base64Tool.astro`, `src/pages/dev-tools/base64/index.astro`, `src/pages/en/dev-tools/base64/index.astro`
- **4 archivos modificados:** `src/i18n/ui.ts`, `src/data/toolCategories.ts`, `src/components/ToolCategoryCard.astro`, `src/pages/dev-tools/index.astro`, `src/pages/en/dev-tools/index.astro`
- **Rutas nuevas:** `/dev-tools/base64/` (es), `/en/dev-tools/base64/` (en)
- **Build:** 77 páginas generadas exitosamente, sin errores
- **QA:** Build, lint, format, i18n, accesibilidad, navegación y no-regresión — todos PASS

---

## 2026-03-12 — Nueva página Dev Tools (catálogo de herramientas)

**ID:** TASK-2026-03-12-003

**Solicitud:** Crear una nueva página `/dev-tools` como catálogo de herramientas de desarrollo. La página muestra tarjetas por categoría (Encoders/Decoders, Converters, Formatters, Generators, Text Utils), cada tarjeta con icono, nombre y pills con los nombres de las herramientas. Solo la página índice (sin herramientas funcionales). Bilingüe (es/en). Con enlace en la navegación principal.

**Plan ejecutado:**

1. Se realizó brainstorming con el usuario para definir: alcance (solo índice, tarjetas no clicables), contenido de tarjetas (icono + nombre + pills sin descripción), 5 categorías con sus herramientas, i18n completo y enlace en navegación.
2. Se agregaron 8 claves de traducción i18n (`nav.devtools`, `devtools.title`, `devtools.subtitle`, 5 `devtools.category.*`) en español e inglés en `src/i18n/ui.ts`.
3. Se creó `src/data/toolCategories.ts` con la interface `ToolCategory` y el array `TOOL_CATEGORIES` (5 categorías con Heroicons SVG paths).
4. Se creó `src/components/ToolCategoryCard.astro` siguiendo el patrón visual de `SkillCategoryCard.astro` (decorative glow, icono con color hover por categoría, título mono, separator dashed, pills con `SkillPill`).
5. Se crearon las páginas `src/pages/dev-tools/index.astro` (es) y `src/pages/en/dev-tools/index.astro` (en) con grid responsivo (1/2/3 columnas).
6. Se agregó el enlace "Dev Tools" al array `navLinks` en `src/components/Header.astro` (el MobileDrawer lo hereda automáticamente).
7. QA validó: integridad de código, i18n simétrico, navegación, componente, páginas, datos, build (75 páginas, 0 errores), lint (0 errores), format (pass), no regresiones — 8/8 checks PASS.

**Resultado:**

- **4 archivos creados:** `src/data/toolCategories.ts`, `src/components/ToolCategoryCard.astro`, `src/pages/dev-tools/index.astro`, `src/pages/en/dev-tools/index.astro`
- **2 archivos modificados:** `src/i18n/ui.ts`, `src/components/Header.astro`
- **Rutas nuevas:** `/dev-tools/` (es), `/en/dev-tools/` (en)
- **Build:** 75 páginas generadas exitosamente, sin errores
- **QA:** Build, lint, format, i18n, accesibilidad, navegación y no-regresión — todos PASS

---

## 2026-03-12 — Agregar proyecto planTimer al portfolio

**ID:** TASK-2026-03-12-002

**Solicitud:** Agregar el proyecto https://timer.edcilo.com al portfolio como primer elemento del array de proyectos, con las mismas tecnologías que MD2PDF (Astro, TypeScript, Tailwind).

**Plan ejecutado:**

1. Se tomó una captura de pantalla de la app con Playwright (viewport 1280x720) y se convirtió a WebP con sharp (`src/assets/portfolio/06_timer.webp`).
2. Se agregaron las traducciones de la descripción en español e inglés en `src/i18n/ui.ts` (`project.planTimer.description`).
3. Se agregó el proyecto como primer elemento del array `PROJECTS` en `src/data/projects.ts` con tecnologías: Astro, TypeScript, Tailwind.
4. QA validó: build (73 páginas, 28 imágenes optimizadas, 0 errores), lint (0 errores), format (pass), revisión de código (11/11 criterios cumplidos).

**Resultado:**

- **1 archivo creado:** `src/assets/portfolio/06_timer.webp`
- **2 archivos modificados:** `src/data/projects.ts`, `src/i18n/ui.ts`
- **Build:** 73 páginas generadas exitosamente, sin errores
- **QA:** Build, lint, format y revisión de código — todos PASS

---

## 2026-03-12 — Página dedicada de proyectos y limitación a 6 en home

**ID:** TASK-2026-03-12-001

**Solicitud:** Modificar la sección de proyectos del home para mostrar solo los 6 proyectos más recientes y agregar un link que redireccione a una página dedicada donde se muestren todos los proyectos.

**Plan ejecutado:**

1. Se realizó brainstorming con el usuario para definir: estilo de la página (grid simple, consistente con el sitio), y convención de rutas (`/projects/` para ambos idiomas, igual que `/blog/`).
2. Se agregaron 2 claves de traducción i18n (`projects.viewAll`) en español e inglés en `src/i18n/ui.ts`.
3. Se modificó `src/components/ProjectsSection.astro` para limitar los proyectos a `.slice(0, 6)` y agregar un link "Ver todos los proyectos" siguiendo el mismo patrón visual de `LatestPosts.astro` (flecha SVG + clases de estilo).
4. Se creó `src/pages/projects/index.astro` (ruta `/projects/`) para el locale español.
5. Se creó `src/pages/en/projects/index.astro` (ruta `/en/projects/`) para el locale inglés.
6. Ambas páginas muestran todos los proyectos en un grid responsive (1 col móvil, 2 cols tablet, 3 cols desktop) con `SectionHeading` y `ProjectCard`.
7. QA validó: build (73 páginas, 0 errores), lint (0 errores), format (corregido automáticamente), type check (1 error preexistente no relacionado). Revisión de código: i18n completo, paths correctos, indentación con tabs, estilo consistente.

**Resultado:**

- **2 archivos creados:** `src/pages/projects/index.astro`, `src/pages/en/projects/index.astro`
- **2 archivos modificados:** `src/components/ProjectsSection.astro`, `src/i18n/ui.ts`
- **Rutas nuevas:** `/projects/` (es), `/en/projects/` (en)
- **Build:** 73 páginas generadas exitosamente, sin errores
- **QA:** Build, lint, format y revisión de código — todos PASS

---

## 2026-03-10 — Animación typewriter en encabezado del blog

**ID:** TASK-2026-03-10-003

**Solicitud:** Agregar una animación tipo "máquina de escribir" (typewriter) en la página principal del blog, donde el título "Blog" se escribe letra por letra, seguido del subtítulo "Pensamientos y aprendizajes" (es) / "Thoughts and learnings" (en), con un cursor `|` parpadeante que acompaña la escritura. Velocidad moderada (~100ms por letra). La animación se ejecuta cada vez que se carga la página.

**Plan ejecutado:**

1. Se realizó brainstorming con el usuario para definir: alcance (solo páginas `/blog` y `/en/blog`), velocidad (moderada, ~100ms por letra), comportamiento (cada recarga).
2. Se evaluaron 3 enfoques: A) componente dedicado, B) prop en `SectionHeading`, C) CSS puro. Se eligió el enfoque A.
3. Se creó el componente `src/components/TypewriterHeading.astro` con:
   - Misma interfaz Props que `SectionHeading` (title, subtitle?, id?) para ser un drop-in replacement.
   - HTML con texto completo en `<span class="sr-only">` para SEO y screen readers.
   - Spans vacíos `aria-hidden="true"` que JS llena letra por letra.
   - Cursor `|` con animación CSS `blink` (step-end, 1s infinite).
   - Script vanilla JS: función `typeText()` con `setTimeout` recursivo, secuencia título → subtítulo, clonado del cursor entre secciones.
   - Respeta `prefers-reduced-motion: reduce` (muestra texto completo sin animación, cursor oculto).
   - Patrón del proyecto: `setup()` + `astro:page-load` + guarda `data-typewriter-initialized`.
4. Se reemplazó `SectionHeading` por `TypewriterHeading` en ambas páginas del blog (es y en).
5. QA validó: build (65 páginas, 0 errores), lint (0 errores), format (pass), revisión de código (6/6 criterios), no-regresión (`SectionHeading.astro` intacto).

**Resultado:**

- **1 componente creado:** `src/components/TypewriterHeading.astro` (152 líneas)
- **2 archivos modificados:** `src/pages/blog/[...page].astro`, `src/pages/en/blog/[...page].astro` (import + uso de `TypewriterHeading`)
- **Archivos NO modificados:** `SectionHeading.astro`, `global.css`, `ui.ts`
- **Build:** 65 páginas generadas exitosamente, sin errores
- **QA:** Build, lint, format, revisión de código y no-regresión — todos PASS

---

## 2026-03-10 — Nuevo artículo de blog: Anatomía de una URL

**ID:** TASK-2026-03-10-002

**Solicitud:** Crear un artículo completo para el blog sobre la estructura de una URL, orientado a desarrollo web / frontend, a partir de un borrador breve con los componentes básicos de una URL. El artículo debía cubrir: desglose de cada componente, diferencia URL/URI/URN, encoding de caracteres, URLs absolutas vs. relativas, subdominios, TLDs, protocolos comunes, query strings, fragments en SPAs y buenas prácticas para URLs limpias.

**Plan ejecutado:**

1. Se analizaron los artículos existentes del blog para identificar el patrón de estructura y convenciones de estilo.
2. Se realizó brainstorming con el usuario para definir: alcance (guía completa), orientación (desarrollo web / frontend), tags (`web, frontend, networking`), contenido conceptual sin código de programación.
3. Se generó un plan detallado con el master-planner: 12 secciones, 9 tablas de referencia, 2 diagramas de texto, ~357 líneas estimadas.
4. Se redactó el artículo completo en español siguiendo las convenciones editoriales del blog.
5. Se creó el archivo `src/content/blog/url-anatomy.md`.
6. QA validó frontmatter, formato Markdown, estructura, consistencia con otros artículos, build, lint y format — 6/6 checks passed.

**Resultado:**

- **1 archivo creado:** `src/content/blog/url-anatomy.md`
- **Tags:** `web`, `frontend`, `networking`
- **Contenido:** ~232 líneas, 12 secciones, 11 tablas de referencia, 2 diagramas de texto, 5 blockquotes, 10 buenas prácticas
- **Build:** 65 páginas generadas exitosamente, sin errores
- **QA:** Build, lint y format pasaron sin errores

---

## 2026-03-10 — Nuevo artículo de blog: Docker Networking (network_mode host)

**ID:** TASK-2026-03-10-001

**Solicitud:** Crear un artículo completo para el blog sobre networking en Docker, con `network_mode: host` como tema central, a partir de un borrador breve con un snippet de Docker Compose. El artículo debía cubrir los cinco modos de red de Docker (bridge, host, none, overlay, macvlan), incluir ejemplos con `docker run` y Docker Compose, y contener secciones de troubleshooting.

**Plan ejecutado:**

1. Se analizaron los artículos existentes del blog (netstat, grep, fail2ban, scp, systemctl) para identificar el patrón de estructura y convenciones de estilo.
2. Se realizó brainstorming con el usuario para definir alcance (guía completa), formato de ejemplos (docker run + Compose), tags (`docker, networking, sre`) e inclusión de troubleshooting.
3. Se generó un plan detallado con el master-planner: 11 secciones, 5 tablas de referencia, ~16-18 bloques de código.
4. Se redactó el artículo completo en español siguiendo las convenciones editoriales del blog.
5. Se creó el archivo `src/content/blog/docker-network-mode-host.md`.
6. QA validó frontmatter, formato Markdown, estructura, consistencia con otros artículos, build, lint y format — 6/6 checks passed.

**Resultado:**

- **1 archivo creado:** `src/content/blog/docker-network-mode-host.md`
- **Tags:** `docker`, `networking`, `sre`
- **Contenido:** ~414 líneas, 11 secciones, 6 tablas de referencia, 16 bloques de código (bash + yaml), 10 buenas prácticas, 5 problemas en troubleshooting
- **Build:** 63 páginas generadas exitosamente, sin errores
- **QA:** Build, lint y format pasaron sin errores

---

## 2026-03-09 — Lector RSVP (Rapid Serial Visual Presentation) para artículos del blog

**Solicitud:** Implementar una herramienta RSVP como lector de lectura rápida para los artículos del blog, activada desde un botón en el header del post que abre un popover superpuesto al artículo.

**Plan ejecutado:**

1. Se investigó el algoritmo ORP (Optimal Recognition Point) analizando implementaciones open-source (OpenSpritz, Squirt, speedread). Se adoptó la tabla discreta validada contra OpenSpritz/speedread con refinamiento de descuento de puntuación de Squirt.
2. Se agregaron 8 claves de traducción `blog.rsvp.*` en español e inglés en `src/i18n/ui.ts`.
3. Se creó el componente `src/components/RSVPReader.astro` con:
   - Botón trigger (ícono bolt) en el header del post
   - Popover fijo top-center con overlay semitransparente
   - Display de palabra con ORP highlight (3 spans: before, pivot, after) y guías verticales
   - Controles: Play/Pausa, Reiniciar, slider de velocidad (150–600 WPM, default 300), Cerrar
   - Barra de progreso visual
   - Extracción lazy de texto del `.prose` (ignorando `<pre>`, `<code>`, `<table>`, `<img>`, `<svg>`, `<figure>`)
   - Delay por puntuación (3x para `.!?`, 2x para `,;:`)
   - Keyboard shortcuts: Space (play/pausa), Escape (cerrar), R (reiniciar)
   - Focus trap, body scroll lock, focus management
   - Dark mode compatible via design tokens
   - `prefers-reduced-motion: reduce` respetado
4. Se modificó `src/layouts/BlogPostLayout.astro` para integrar el componente en el header del post (a la derecha de la fecha y reading time).
5. QA validó build, estructura, a11y (18 checks), dark mode (13 tokens), i18n y `prefers-reduced-motion` con 0 defectos.

**Resultado:**

- **1 componente creado:** `src/components/RSVPReader.astro` (~590 líneas, 4.11 kB / 1.58 kB gzip)
- **2 archivos modificados:** `src/layouts/BlogPostLayout.astro`, `src/i18n/ui.ts` (16 claves i18n)
- **Build:** 61 páginas, sin errores
- **QA:** Aprobado — build, lint, format, a11y, dark mode, i18n verificados

---

## 2026-03-09 — Nuevo artículo de blog: unaccent en PostgreSQL

**Solicitud:** Crear un artículo para el blog sobre la extensión `unaccent` de PostgreSQL a partir de un borrador con las consultas de verificación e instalación.

**Plan ejecutado:**

1. Se investigó la documentación oficial de PostgreSQL sobre `unaccent`, `pg_trgm`, volatilidad de funciones y requisitos de índices funcionales.
2. Se redactó el artículo completo en español con 8 secciones: introducción, instalación, uso básico, búsquedas ignorando acentos, índices funcionales (wrapper IMMUTABLE), integración con `pg_trgm` (índice GIN), caso de uso completo con `EXPLAIN ANALYZE`, y buenas prácticas.
3. Se creó el archivo `src/content/blog/unaccent-postgresql.md` siguiendo las convenciones editoriales del blog.
4. QA validó frontmatter, estructura Markdown, patrones editoriales, build y contenido técnico con 0 defectos.

**Resultado:**

- **1 archivo creado:** `src/content/blog/unaccent-postgresql.md`
- **Tags:** `postgresql`, `sql`
- **Contenido:** 185 líneas, 8 secciones, 2 tablas, 12 bloques de código SQL, 7 buenas prácticas
- **Build:** 61 páginas generadas exitosamente, sin errores

---

## 2026-03-09 — Filtro de tags global con índice JSON (mismo enfoque que el buscador)

**Solicitud:** El filtro de tags del blog solo mostraba/ocultaba los artículos de la página actual (DOM). Con la paginación de 15 artículos por página, los posts de otras páginas con el tag seleccionado no aparecían.

**Plan ejecutado:**

1. Se reescribió la función `setActiveTag()` en `BlogSearchInput.astro` para usar el índice JSON estático (`/api/search-index.json`) en vez de manipular el DOM. Ahora al seleccionar un tag, se hace fetch del índice global, se filtran los posts por tag, y se renderizan como cards HTML en el grid.
2. Se creó la función `renderTagResults()` que genera cards HTML idénticas visualmente a `BlogPostCard.astro` (glow decorativo, fecha localizada, reading time, título, descripción con line-clamp-2, separador dashed, tag pills estilo `SkillPill`).
3. Al seleccionar "Todos", se restaura el contenido original del grid (server-rendered) y se muestra la paginación.
4. Al seleccionar un tag específico, se oculta la paginación y se muestran todos los posts globales con ese tag.
5. Se agregó `data-blog-pagination` al `<nav>` raíz de `BlogPagination.astro` para poder ocultar/mostrar la paginación desde el script.
6. Se movió el mensaje "sin resultados" del panel de tags al área del grid (con `col-span-full`).
7. Se eliminó la regla CSS `:global(article[data-tags].filtered-hidden)` ya que el filtrado por DOM ya no se usa.

**Resultado:**

- **2 componentes modificados:** `BlogSearchInput.astro` (filtrado global), `BlogPagination.astro` (data attribute)
- **Comportamiento:** Seleccionar un tag muestra TODOS los posts con ese tag de todo el blog, no solo los de la página actual
- **Build:** 59 páginas, sin errores
- **QA:** Build, lint y format pasaron sin errores

---

## 2026-03-09 — Filtro de tags integrado al buscador (ícono funnel + dropdown)

**Solicitud:** Explorar formas alternativas de mostrar los filtros de tags del blog. Se eligió integrar un ícono de filtro (funnel) dentro del input de búsqueda que despliega un panel dropdown con los tag pills.

**Plan ejecutado:**

1. Se reescribió `src/components/BlogSearchInput.astro` para integrar el filtro de tags. Se agregó un botón con ícono funnel (Heroicons) a la derecha del input. Al hacer click despliega/colapsa un panel dropdown (posicionado `absolute top-full`) con los botones pill de tags.
2. Se actualizaron `src/pages/blog/[...page].astro` y `src/pages/en/blog/[...page].astro` para quitar el uso de `BlogTagFilter` como componente separado y pasar los props de tags directamente a `BlogSearchInput`.
3. El ícono funnel cambia de color según el estado: `muted-foreground` (default), `foreground` (panel abierto), `primary` (filtro activo).
4. Se implementó exclusividad mutua entre el dropdown de búsqueda y el panel de tags: `showDropdown()` llama a `hideTagPanel()` y `showTagPanel()` llama a `hideDropdown()`, garantizando que solo uno esté visible a la vez.

**Resultado:**

- **1 componente reescrito:** `src/components/BlogSearchInput.astro` (ahora incluye búsqueda + filtro de tags en dropdowns mutuamente excluyentes)
- **2 páginas actualizadas:** `blog/[...page].astro` (es y en) — quitado import y uso de `BlogTagFilter`
- **`BlogTagFilter.astro` queda sin uso** en las páginas del blog (puede eliminarse en el futuro)
- **Build:** 59 páginas, client JS < 2 kB gzip
- **QA:** Build, lint y format pasaron sin errores

---

## 2026-03-09 — Buscador global del blog con índice JSON estático

**Solicitud:** El buscador del blog estaba limitado a los artículos de la página actual debido a la paginación. Se pidió buscar en todos los artículos del blog.

**Plan ejecutado:**

1. Se creó el endpoint estático `src/pages/api/search-index.json.ts` que genera un JSON con todos los posts (título, descripción, fecha, tags, slug, reading time) al momento del build. El archivo pesa ~8.7 KB para 26 posts.
2. Se reescribió `src/components/BlogSearchInput.astro` para buscar contra el JSON global en vez del DOM local. El nuevo comportamiento: fetch lazy del JSON (cacheado en memoria), debounce de 300ms, resultados en dropdown overlay con navegación por teclado (↑↓ + Enter), accesibilidad completa (combobox, listbox, aria-activedescendant), cierre con Escape/click fuera, y detección automática del locale para URLs correctas.
3. Se limpió `src/components/BlogTagFilter.astro` eliminando referencias a `search-hidden` y `.blog-search-empty` que ya no existen.
4. Se actualizaron las páginas paginadas (es y en) con el nuevo prop `readingTimeLabel`.

**Resultado:**

- **1 endpoint creado:** `src/pages/api/search-index.json.ts` → genera `/api/search-index.json`
- **1 componente reescrito:** `src/components/BlogSearchInput.astro`
- **1 componente limpiado:** `src/components/BlogTagFilter.astro`
- **2 páginas actualizadas:** `blog/[...page].astro` (es y en)
- **Build:** 59 páginas + 1 endpoint JSON generados exitosamente
- **QA:** Lint, format y build pasaron sin errores

---

## 2026-03-09 — Paginación en el blog (15 artículos por página)

**Solicitud:** Implementar paginación en la sección del blog, mostrando 15 artículos por página.

**Plan ejecutado:**

1. Se agregaron 6 claves de traducción i18n para paginación (`blog.pagination.*`) en ambos idiomas (es/en) en `src/i18n/ui.ts`.
2. Se creó el componente `src/components/BlogPagination.astro` con navegación completa: botones Primera, Anterior, números de página con ellipsis inteligente, Siguiente y Última. Estilo consistente con los `tag-filter-btn` existentes, accesible (WCAG AA, aria-labels, rel=prev/next, target size 44px), responsive (iconos en mobile, texto en desktop), y sin JavaScript del lado del cliente.
3. Se reemplazó `src/pages/blog/index.astro` por `src/pages/blog/[...page].astro` usando `getStaticPaths({ paginate })` con `pageSize: 15`.
4. Se reemplazó `src/pages/en/blog/index.astro` por `src/pages/en/blog/[...page].astro` con la misma lógica.

**Resultado:**

- **1 componente creado:** `src/components/BlogPagination.astro`
- **1 archivo modificado:** `src/i18n/ui.ts` (12 claves de traducción añadidas)
- **2 archivos reemplazados:** `blog/index.astro` → `blog/[...page].astro` (es y en)
- **Rutas generadas:** `/blog/` (pág. 1), `/blog/2/` (pág. 2), `/en/blog/`, `/en/blog/2/`
- **Build:** 59 páginas generadas exitosamente
- **QA:** Lint, format y build pasaron sin errores

---

## 2026-03-06 — Nuevo artículo de blog: scp

**Solicitud:** Crear un artículo para el blog sobre `scp` (secure copy) con contenido proporcionado por el usuario.

**Plan ejecutado:**

1. Se analizaron las convenciones de formato existentes en los artículos del blog.
2. Se transformó el contenido en bruto en un artículo pulido siguiendo las convenciones del proyecto.
3. Se creó el archivo `src/content/blog/scp.md` con secciones: sintaxis, banderas comunes, 5 ejemplos de uso y buenas prácticas.

**Resultado:**

- **1 archivo creado:** `src/content/blog/scp.md`
- **Tags:** `linux`, `terminal`, `sre`
- **Contenido:** 85 líneas, 4 secciones principales, 5 ejemplos con bloques de código, 8 buenas prácticas

---

## 2026-03-06 — Nuevo artículo de blog: systemctl

**Solicitud:** Crear un artículo para el blog sobre `systemctl` (Systemd manager) con contenido proporcionado por el usuario.

**Plan ejecutado:**

1. Se analizaron las convenciones de formato existentes en los artículos del blog (frontmatter, estructura de secciones, tablas, bloques de código, estilo de redacción).
2. Se transformó el contenido en bruto proporcionado por el usuario en un artículo de blog completo y pulido siguiendo las convenciones del proyecto.
3. Se creó el archivo `src/content/blog/systemctl.md` con todas las secciones: sintaxis, acciones principales, banderas, gestión avanzada, creación de servicios personalizados (ejemplo con Next.js) y buenas prácticas.

**Resultado:**

- **1 archivo creado:** `src/content/blog/systemctl.md`
- **Tags:** `linux`, `terminal`, `sre`
- **Contenido:** 130 líneas, 8 secciones, 6 tablas, 3 bloques de código, 8 buenas prácticas

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
