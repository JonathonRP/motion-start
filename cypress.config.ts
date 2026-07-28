import { defineConfig } from 'cypress';

export default defineConfig({
	allowCypressEnv: false,
	video: true,
	screenshotOnRunFailure: false,
	retries: 2,
	e2e: {
		// The specs drive the playground's `?test=` harness (sites/playground/src/routes/tests),
		// so that dev server has to be up first: `bun run dev` from the repo root.
		baseUrl: 'http://localhost:5000',
		specPattern: 'cypress/integration/**/*.ts',
		supportFile: 'cypress/support/index.js',
	},
});
