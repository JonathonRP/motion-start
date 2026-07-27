/// <reference types="vite/client" />
/// <reference types="svelte" />
import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import devtoolsJson from "vite-plugin-devtools-json";
import { defineConfig } from "vite";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
	resolve: {
		alias: {
			// The playground consumes the library through its public entrypoints so
			// that the published surface is what gets exercised. A handful of routes
			// also reach for internal types and helpers that are deliberately not
			// exported (`utils/ref.svelte`, `utils/safe-react-types`,
			// `motion/features/viewport/types`, `components/Reorder`); this alias is
			// the escape hatch for those, and should not be used for anything that
			// has a real export.
			"motion-start": resolve(__dirname, "../../packages/motion-start/src/lib/motion-start"),
		},
	},

	plugins: [tailwindcss(), sveltekit(), devtoolsJson()],

	server: {
		port: 5000,
		strictPort: true,
		host: "127.0.0.1",
		fs: {
			allow: [resolve(__dirname, "../../packages/motion-start")],
		},
		watch: {
			ignored: ["**/node_modules/**", "**/.svelte-kit/**", "**/dist/**"],
		},
	},

	build: {
		watch: {
			exclude: ["**/node_modules/**", "**/.svelte-kit/**", "**/dist/**"],
		},
	},
});
