import type { HTMLMotionComponents } from './types.js';

describe('HTMLMotionComponents', () => {
	it('includes every HTML element supported by the Svelte port', () => {
		type SupportedElementComponents = Pick<
			HTMLMotionComponents,
			'big' | 'center' | 'keygen' | 'menuitem' | 'noindex' | 'search' | 'slot' | 'template'
		>;

		assertType<SupportedElementComponents>({} as HTMLMotionComponents);
	});
});
