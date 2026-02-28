/** Ported from framer-motion/packages/framer-motion/src/render/dom/utils/__tests__/camel-to-dash.test.ts */
import { describe, it, expect } from 'vitest';
import { camelToDash } from '../camel-to-dash';

describe('camelToDash', () => {
	it('Converts camel case to dash case', () => {
		expect(camelToDash('camelCase')).toBe('camel-case');
	});
});
