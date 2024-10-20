/// <reference types="vitest" />
/// <reference types="vite/client" />
/// <reference types="svelte" />

// Configure Vitest (https://vitest.dev/config/)

import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	test: {
		/* for example, use global to avoid globals imports (describe, test, expect): */
		globals: true,
		typecheck: {
			enabled: true,
		},
	},
	server: {
		port: 5000,
		strictPort: true,
		host: '127.0.0.1',
	},
});
