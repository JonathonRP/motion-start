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
		globals: true,
		typecheck: {
			enabled: true,
		},
		include: ['src/**/*.{test,spec}.{js,ts}'],
		environment: 'jsdom',
		// Browser mode for UI/integration tests
		browser: {
			enabled: false, // Enable via CLI: vitest --browser
			name: 'chromium',
			provider: 'playwright',
		},
	},
	server: {
		port: 5000,
		strictPort: true,
		host: '127.0.0.1',
	},
});
