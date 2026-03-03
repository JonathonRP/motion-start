import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		svelte({
			compilerOptions: {
				discloseVersion: false,
			},
		}),
	],
	build: {
		lib: {
			entry: 'src/lib/motion-start/index.ts',
			formats: ['es'],
			fileName: 'index',
		},
		outDir: 'dist/cdn',
		rollupOptions: {
			// svelte/internal/client stays external so the playground's Rollup
			// resolver maps it to the same instance used by user code — required
			// for Svelte 5 component flags ($.f) and lifecycle to work correctly.
			// svelte/internal/flags/legacy is bundled (tiny, no shared state).
			// svelte/internal/disclose-version is suppressed by discloseVersion:false.
			external: (id) =>
				id === 'svelte' ||
				(id.startsWith('svelte/') && id !== 'svelte/internal/flags/legacy'),
		},
	},
});
