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
		// No external — bundle everything (including svelte runtime) so the
		// playground loads the file as a fully self-contained ES module with
		// zero bare specifiers that the playground's resolver can't reach.
	},
});
