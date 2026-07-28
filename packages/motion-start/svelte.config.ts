import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import type { SvelteConfig } from "@sveltejs/vite-plugin-svelte";

export default {
	preprocess: vitePreprocess(),
} satisfies SvelteConfig;
