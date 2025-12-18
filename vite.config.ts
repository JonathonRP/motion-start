/// <reference types="vitest" />
/// <reference types="vite/client" />
/// <reference types="svelte" />
// Configure Vitest (https://vitest.dev/config/)
import { sveltekit } from '@sveltejs/kit/vite';

import tailwindcss from '@tailwindcss/vite';
import devtoolsJson from 'vite-plugin-devtools-json';
import { defineConfig } from 'vite';
import path from 'node:path';

export default defineConfig({
	resolve: {
		alias: {},
	},

	plugins: [tailwindcss(), sveltekit(), devtoolsJson()],

	test: {
		/* for example, use global to avoid globals imports (describe, test, expect): */
		globals: true,
		environment: 'happy-dom', // Provides DOM APIs including DOMRect for tests
		typecheck: { enabled: true },
	},

	server: {
		port: 5000,
		strictPort: true,
		host: '127.0.0.1',
		watch: {
			ignored: ['**/node_modules/**', '**/.svelte-kit/**', '**/dist/**', '**/.beads/**'],
		},
	},

	build: {
		watch: {
			exclude: ['**/node_modules/**', '**/.svelte-kit/**', '**/dist/**', '**/.beads/**'],
		},
	},
});
