/// <reference types="vitest" />
/// <reference types="vite/client" />
/// <reference types="svelte" />

// Configure Vitest (https://vitest.dev/config/)

import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

const isBrowserMode = process.env.VITEST_BROWSER === 'true';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	test: {
		/* for example, use global to avoid globals imports (describe, test, expect): */
		globals: true,
		typecheck: {
			enabled: !isBrowserMode, // Type check in regular mode only
		},
		// Pool options moved to top-level in Vitest 4
		pool: 'threads',
		poolOptions: {
			threads: {
				singleThread: true,
			}
		},
		// Browser mode configuration for e2e-like tests
		browser: isBrowserMode ? {
			enabled: true,
			name: 'chromium',
			provider: 'playwright',
			headless: true,
			screenshotFailures: false,
		} : undefined,
		// Include pattern - browser tests only when VITEST_BROWSER is set
		include: isBrowserMode
			? ['src/**/*.browser.{test,spec}.{js,ts,svelte}']
			: ['src/**/*.{test,spec}.{js,ts,svelte}'],
		// Exclude pattern
		exclude: isBrowserMode
			? ['**/node_modules/**', '**/dist/**', '**/.{idea,git,cache,output,temp}/**', '**/.svelte-kit/**']
			: [
				'**/node_modules/**',
				'**/dist/**',
				'**/.svelte-kit/**',
				'**/.{idea,git,cache,output,temp}/**',
				'**/*.browser.{test,spec}.{js,ts,svelte}',
			],
	},
	server: {
		port: 5000,
		strictPort: true,
		host: '127.0.0.1',
	},
});
