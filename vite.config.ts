/// <reference types="vitest" />
/// <reference types="vite/client" />
/// <reference types="svelte" />

// Configure Vitest (https://vitest.dev/config/)

import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vite';

const isBrowserMode = process.env.VITEST_BROWSER === 'true';
const isTypeCheckMode = process.env.VITEST_TYPECHECK === 'true';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	test: {
		/* for example, use global to avoid globals imports (describe, test, expect): */
		globals: true,
		typecheck: {
			enabled: isTypeCheckMode, // Only enable when explicitly requested
		},
		// Browser mode configuration for e2e-like tests
		browser: isBrowserMode
			? {
					enabled: true,
					instances: [{ browser: 'chromium' }],
					provider: playwright(),
					headless: true,
				}
			: undefined,
		// Include pattern - browser tests only when VITEST_BROWSER is set
		include: isBrowserMode ? ['src/**/*.browser.{test,spec}.{js,ts,svelte}'] : ['src/**/*.{test,spec}.{js,ts,svelte}'],
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
