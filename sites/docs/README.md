# motion-start docs

The documentation site for [motion-start](https://github.com/JonathonRP/motion-start), built with
[SvelteKit](https://svelte.dev/docs/kit), [`@svecodocs/kit`](https://github.com/svecosystem/svecodocs)
and [velite](https://velite.js.org).

The site consumes the **local build** of the library (via a Vite alias to `../dist/index.js`) so the
live demos always reflect the code in this repo.

## Prerequisites

Build the library from the repo root first:

```bash
cd ..
bun install
bun run package
```

## Developing

```bash
bun install
bun run dev
```

This runs velite in watch mode alongside `vite dev` at http://localhost:5173.

To run just one half:

```bash
bun run dev:content   # velite --watch
bun run dev:svelte    # vite dev
```

### `NO_CF_EMULATE`

`@sveltejs/adapter-cloudflare` spins up a workerd/miniflare process to emulate Cloudflare bindings
during `dev` and `prerender`. On some machines (notably Windows) workerd crashes with an access
violation. Set `NO_CF_EMULATE=1` to skip the emulation — the site uses no Cloudflare bindings, so
nothing is lost locally:

```bash
NO_CF_EMULATE=1 bun run dev
```

```powershell
$env:NO_CF_EMULATE = '1'; bun run dev
```

## Building

```bash
bun run build
bun run preview
```

## Writing content

Markdown lives in `src/content/`, grouped by section directory. Each file needs frontmatter:

```md
---
title: useTransform
description: Create a motion value that transforms another.
section: Motion values
---
```

`section` must match the enum in `velite.config.js`, and the sidebar order comes from the `NN_`
filename prefix (stripped from the slug). Sidebar groups are defined in `src/lib/navigation.ts`.

Pages can import live demos from `src/lib/components/demos/` and components from `@svecodocs/kit`
inside a `<script>` block.
