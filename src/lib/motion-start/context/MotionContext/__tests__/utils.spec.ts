/**
 * Ported from framer-motion/packages/framer-motion/src/context/MotionContext/__tests__/utils.test.ts
 *
 * Note: getCurrentTreeVariants uses $derived.by (Svelte rune) which requires a Svelte
 * reactive context. These tests are skipped as they cannot be run in a plain Vitest environment.
 * Integration behavior is covered by Cypress E2E tests.
 */
import { describe, test, expect } from 'vitest';
import { animationControls } from '../../../animation/hooks/animation-controls';
import { getCurrentTreeVariants } from '../utils.svelte';

describe('getCurrentTreeVariants', () => {
	test.skip('It returns the correct variant to render currently', () => {
		expect(getCurrentTreeVariants(() => ({ initial: false }), {})).toEqual({});

		expect(
			getCurrentTreeVariants(() => ({ initial: false, animate: { opacity: 0 } }), { animate: 'hello' })
		).toEqual({ animate: 'hello' });

		expect(
			getCurrentTreeVariants(() => ({ initial: false, animate: 'hello' }), {})
		).toEqual({
			initial: false,
			animate: 'hello',
		});

		expect(
			getCurrentTreeVariants(
				() => ({ initial: { opacity: 0 }, animate: { opacity: 1 } }),
				{ initial: 'a', animate: 'b' }
			)
		).toEqual({ initial: 'a', animate: 'b' });

		expect(
			getCurrentTreeVariants(
				() => ({ initial: { opacity: 0 }, animate: { opacity: 1 }, inherit: false }),
				{ initial: 'a', animate: 'b' }
			)
		).toEqual({ initial: undefined, animate: undefined });

		expect(
			getCurrentTreeVariants(
				() => ({ initial: false, animate: ['a', 'b'] }),
				{ initial: 'c', animate: 'b' }
			)
		).toEqual({ initial: false, animate: ['a', 'b'] });

		expect(
			getCurrentTreeVariants(
				() => ({ initial: ['c', 'd'], animate: ['a', 'b'] }),
				{ initial: ['e', 'f'], animate: ['g', 'h'] }
			)
		).toEqual({
			initial: ['c', 'd'],
			animate: ['a', 'b'],
		});

		expect(
			getCurrentTreeVariants(
				() => ({ initial: false, animate: animationControls() }),
				{ initial: 'a', animate: 'b' }
			)
		).toEqual({ initial: false, animate: undefined });
	});
});
