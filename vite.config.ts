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
		// Configure environment based on test file pattern
		// Browser tests use .browser.test.ts suffix
		poolOptions: {
			threads: {
				singleThread: true,
			}
		},
		// Browser mode configuration for e2e-like tests
		browser: {
			enabled: isBrowserMode,
			name: 'chromium',
			provider: 'playwright',
			headless: true,
			screenshotFailures: false,
		},
		// Include pattern - browser tests only when VITEST_BROWSER is set
		include: isBrowserMode
			? ['**/*.browser.{test,spec}.{js,ts,svelte}']
			: ['**/*.{test,spec}.{js,ts,svelte}'],
		// Exclude pattern
		exclude: isBrowserMode
			? ['**/node_modules/**', '**/dist/**', '**/.{idea,git,cache,output,temp}/**']
			: [
				'**/node_modules/**',
				'**/dist/**',
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
