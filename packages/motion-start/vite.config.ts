/// <reference types="vitest" />
/// <reference types="vite/client" />
/// <reference types="svelte" />
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { defineConfig } from "vite";

// The library is framework-agnostic within Svelte: it has no `$app`, `$lib` or
// `$env` imports, so it needs the Svelte plugin but not SvelteKit. Keeping
// SvelteKit out means no placeholder `app.html`/`routes` scaffolding.
export default defineConfig({
	resolve: {
		conditions: process.env.VITEST ? ["browser"] : undefined,
	},

	plugins: [svelte()],

	test: {
		globals: true,
		environment: "happy-dom", // Provides DOM APIs including DOMRect for tests
		typecheck: { enabled: true },
		include: ["src/**/*.{test,spec}.{js,ts}", "src/**/*.svelte.{test,spec}.ts"],
		exclude: ["**/node_modules/**", "**/dist/**"],
	},
});
