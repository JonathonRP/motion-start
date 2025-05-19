/// <reference types="vitest" />
/// <reference types="vite/client" />
/// <reference types="svelte" />

// Configure Vitest (https://vitest.dev/config/)

import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
	resolve: {
		alias: {
			'framer-motion/dist/es/render/html/HTMLVisualElement.mjs': path.resolve(
				__dirname,
				'node_modules/framer-motion/dist/es/render/html/HTMLVisualElement.mjs'
			),
			'framer-motion/dist/es/render/svg/SVGVisualElement.mjs': path.resolve(
				__dirname,
				'node_modules/framer-motion/dist/es/render/svg/SVGVisualElement.mjs'
			),
		},
	},
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
