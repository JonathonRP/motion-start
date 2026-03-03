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
			external: (id) =>
				id === 'svelte' ||
				(id.startsWith('svelte/') && id !== 'svelte/internal/flags/legacy'),
		},
	},
});
