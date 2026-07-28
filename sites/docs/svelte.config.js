import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { mdsx } from "mdsx";
import mdsxConfig from "./mdsx.config.js";
import adapter from "@sveltejs/adapter-static";

// This file stays `.js` while the other workspaces use `svelte.config.ts`.
// SvelteKit itself accepts either, but mdsx only looks for svelte.config
// {.js,.cjs,.mjs} - given a `.ts` it logs "no svelte config found" and silently
// returns without applying `extensions`, so the .md routes stop preprocessing.
// Revisit once mdsx learns about TypeScript configs.

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [mdsx(mdsxConfig), vitePreprocess()],
	kit: {
		alias: {
			"$content/*": ".velite/*",
		},
		adapter: adapter(),
	},
	extensions: [".svelte", ".md"],
};

export default config;
