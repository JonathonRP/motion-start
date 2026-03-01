import { defineConfig } from 'cypress';

export default defineConfig({
	video: true,
	screenshotOnRunFailure: false,
	retries: 2,
	e2e: {
		baseUrl: 'http://localhost:5000',
		specPattern: 'cypress/integration/**/*.ts',
		supportFile: 'cypress/support/index.js',
	},
});
