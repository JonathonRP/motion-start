/** Ported from framer-motion/packages/framer-motion/src/motion/utils/__tests__/should-inherit-variants.test.ts */
import { describe, test, expect } from 'vitest';
import { animationControls } from '../../../animation/hooks/animation-controls';
import { checkShouldInheritVariant } from '../should-inhert-variant';

describe('checkShouldInheritVariant', () => {
	test('Detects when a component should inherit variants', () => {
		expect(checkShouldInheritVariant({ animate: { x: 0 } })).toBe(false);
		expect(checkShouldInheritVariant({ variants: {} })).toBe(true);
		expect(checkShouldInheritVariant({ variants: {}, inherit: false })).toBe(false);
		expect(checkShouldInheritVariant({ variants: {}, inherit: false })).toBe(false);
		expect(checkShouldInheritVariant({ variants: {}, animate: 'variant' })).toBe(false);
		expect(checkShouldInheritVariant({ animate: animationControls(), variants: {} })).toBe(false);
		expect(
			checkShouldInheritVariant({ animate: animationControls(), variants: {}, inherit: true })
		).toBe(true);
	});
});
