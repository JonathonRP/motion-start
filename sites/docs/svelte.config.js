import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { mdsx } from "mdsx";
import mdsxConfig from "./mdsx.config.js";
import adapter from "@sveltejs/adapter-cloudflare";

const cloudflareAdapter = adapter();

// This file stays `.js` while the other workspaces use `svelte.config.ts`.
// SvelteKit itself accepts either, but mdsx only looks for svelte.config
// {.js,.cjs,.mjs} - given a `.ts` it logs "no svelte config found" and silently
// returns without applying `extensions`, so the .md routes stop preprocessing.
// Revisit once mdsx learns about TypeScript configs.

// The Cloudflare workerd runtime can't start on some local machines, which breaks `vite dev`.
// Set NO_CF_EMULATE=1 to develop without the platform proxy (build output is unaffected).
if (process.env.NO_CF_EMULATE) {
	cloudflareAdapter.emulate = undefined;
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [mdsx(mdsxConfig), vitePreprocess()],
	kit: {
		alias: {
			"$content/*": ".velite/*",
		},
		adapter: cloudflareAdapter,
	},
	extensions: [".svelte", ".md"],
};

export default config;
