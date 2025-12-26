/**
 * Global type augmentations for motion-start
 * Consolidates all global type declarations in one place
 */

declare global {
	// Process environment for build-time and runtime usage
	// eslint-disable-next-line no-var
	var process: {
		env?: Record<string, string | undefined>;
	};

	// Window process polyfill for browser environments
	interface Window {
		process?: {
			env?: Record<string, string | undefined>;
		};
	}
}

export {};
