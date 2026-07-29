// @vitest-environment node

import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import SsrInitialStylesFixture from './SsrInitialStylesFixture.svelte';

function parseStyleAttribute(style: string) {
	return Object.fromEntries(
		style
			.split(';')
			.map((declaration) => declaration.trim())
			.filter(Boolean)
			.map((declaration) => {
				const separator = declaration.indexOf(':');
				return [declaration.slice(0, separator).trim(), declaration.slice(separator + 1).trim()];
			})
	);
}

describe('motion element SSR styles', () => {
	it('serializes raw styles, CSS variables, and resolved initial animation values', () => {
		const { body } = render(SsrInitialStylesFixture);
		const motionElement = body.match(/<div[^>]*data-testid="ssr-motion"[^>]*>/)?.[0];
		const style = motionElement?.match(/\sstyle="([^"]*)"/)?.[1];

		expect(style).toBeDefined();
		const declarations = parseStyleAttribute(style ?? '');
		expect(declarations).toMatchObject({
			'background-color': 'tomato',
			'--accentColor': 'rebeccapurple',
			'-webkit-filter': 'blur(1px)',
			color: 'red\\00003b position: fixed',
			opacity: '0.25',
			transform: 'translateX(24px)',
		});
		expect(declarations).not.toHaveProperty('position');
	});
});
