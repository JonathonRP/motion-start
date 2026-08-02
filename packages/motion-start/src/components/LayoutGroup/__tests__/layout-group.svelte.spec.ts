import { flushSync, mount, unmount } from 'svelte';
import { afterEach, describe, expect, it } from 'vitest';
import { useLayoutGroupContext } from '../../../context/LayoutGroupContext.svelte.js';
import LayoutGroupConsumer from './LayoutGroupConsumer.svelte';
import LayoutGroupFixture from './LayoutGroupFixture.svelte';

let instance: ReturnType<typeof mount> | undefined;

function content(id: string) {
	return document.querySelector(`[data-testid="${id}"]`)?.textContent;
}

afterEach(async () => {
	if (instance) await unmount(instance);
	instance = undefined;
	document.body.innerHTML = '';
});

describe('LayoutGroup context ownership', () => {
	it('sets the first group id', () => {
		instance = mount(LayoutGroupFixture, { target: document.body });
		flushSync();
		expect(content('first')).toBe('a');
	});

	it('appends nested group ids', () => {
		instance = mount(LayoutGroupFixture, { target: document.body });
		flushSync();
		expect(content('nested')).toBe('a-b');
	});

	it('preserves a parent id through an undefined nested id', () => {
		instance = mount(LayoutGroupFixture, { target: document.body });
		flushSync();
		expect(content('undefined')).toBe('a');
	});

	it('continues appending after an undefined nested id', () => {
		instance = mount(LayoutGroupFixture, { target: document.body });
		flushSync();
		expect(content('nested-after-undefined')).toBe('a-b');
	});
});

describe('useLayoutGroupContext', () => {
	it('reports a missing provider as null rather than throwing', () => {
		instance = mount(LayoutGroupConsumer, { target: document.body, props: { id: 'no-provider' } });
		flushSync();
		expect(content('no-provider')).toBe('');
	});

	it('throws when read outside component initialisation', () => {
		// A blanket try/catch here would turn this misuse into a silently
		// unprefixed `layoutId`, so it has to stay loud.
		expect(() => useLayoutGroupContext()).toThrow();
	});
});
