---
title: 'Building My Site with Astro 5'
description: 'A deep dive into rebuilding my personal site using Astro 5, Tailwind CSS v4, and Content Collections — shipping less JavaScript while keeping a great developer experience.'
date: 2026-02-16T16:00:00
tags: [astro, tailwind, typescript]
draft: false
---

## Why Astro?

After years of building personal sites with heavy JavaScript frameworks, I decided it was time to rethink my approach. The truth is, most of my site is **static content** — there's no reason to ship a full React runtime to the browser just to render a landing page.

> The best JavaScript is zero JavaScript — at least when it comes to content sites.

[Astro](https://astro.build/) embraces this philosophy with its **Islands Architecture**: everything renders to static HTML by default, and you only hydrate the interactive bits. For a personal portfolio and blog, this is exactly what I needed.

### The Stack

Here's what powers this site:

- **Astro 5** — static site generation with file-based routing
- **Tailwind CSS v4** — utility-first styling with the new CSS-first configuration
- **TypeScript** in strict mode — catching bugs at compile time
- **Content Collections** — type-safe markdown with Zod validation
- **Astro Sitemap** — automatic SEO-friendly sitemap generation

### Content Collections and Type Safety

One of my favorite features in Astro 5 is Content Collections with the `glob()` loader. Instead of manually parsing frontmatter and hoping it's correct, you define a schema with Zod and Astro validates _every_ markdown file at build time.

Here's a simplified version of my blog collection config:

```typescript
const blog = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		date: z.coerce.date(),
		tags: z.array(z.string()).default([]),
		draft: z.boolean().default(false),
	}),
});
```

If a post is missing a required field or has the wrong type, the build fails with a **clear error message**. No more runtime surprises.

---

## Design Decisions

I kept the design minimal and intentional. The entire site uses a **class-based dark mode** system with semantic design tokens like `--color-foreground` and `--color-muted`. This means switching themes is a single class toggle — no complex CSS overrides.

### Performance First

Since Astro ships zero client-side JavaScript by default, the initial page load is _incredibly fast_. I only use `client:*` directives for truly interactive components like the theme toggle and mobile navigation drawer.

The result? A perfect Lighthouse score and a site that feels instant on any device.

## What's Next

I plan to expand this blog with posts about web performance, TypeScript patterns, and lessons learned from over a decade of fullstack development. Stay tuned.
