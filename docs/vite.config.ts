import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
	plugins: [sveltekit(), tailwindcss()],
	resolve: {
		alias: {
			// The docs site consumes the library build from the repo root.
			// Run `bun run package` at the root before `bun run dev`/`build`.
			"motion-start": resolve(__dirname, "../dist/index.js"),
		},
	},
	server: {
		fs: {
			allow: [resolve(__dirname, "./.velite"), resolve(__dirname, "../dist")],
		},
	},
});
