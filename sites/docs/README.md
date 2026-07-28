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

## Building

```bash
bun run build
bun run preview
```

The site is fully prerendered with `@sveltejs/adapter-static`. Pushes to `main` that affect the
package or docs deploy `sites/docs/build` to GitHub Pages through `.github/workflows/docs.yaml`.
The Pages custom domain is `motion-start.com`.

### Custom-domain DNS

The domain currently uses Hover DNS. To activate the GitHub Pages custom domain, replace the
existing apex `A` record with GitHub Pages' four records:

```text
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

Point `www.motion-start.com` to `jonathonrp.github.io` with a `CNAME` record. After DNS propagates
and GitHub provisions the certificate, enable **Enforce HTTPS** in the repository's Pages settings.

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
