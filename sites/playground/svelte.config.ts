import adapter from '@sveltejs/adapter-auto';
import type { Config } from '@sveltejs/kit';

const config = {
	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter(),

		// The playground is the library's dev and E2E surface, so it resolves
		// `motion-start` straight to source: edits to the library hot-reload here
		// without a rebuild, and Cypress exercises the code as written rather than
		// the packaged output. (The docs site does the opposite - it consumes the
		// workspace package through its exports map, which is what keeps the
		// published entrypoints honest.)
		//
		// Declaring the alias here rather than in vite.config.ts means SvelteKit
		// generates the matching tsconfig `paths` too, so vite and tsc cannot drift.
		// A few routes import internals that have no public export
		// (`utils/ref.svelte`, `utils/safe-react-types`, `components/Reorder`,
		// `motion/features/viewport/types`, `gestures/pan/PanSession`); the prefix
		// form covers those.
		alias: {
			'motion-start': '../../packages/motion-start/src',
			'motion-start/*': '../../packages/motion-start/src/*',
		},
	},
	// compilerOptions: {
	//   runes: false,
	// },
} satisfies Config;

export default config;
