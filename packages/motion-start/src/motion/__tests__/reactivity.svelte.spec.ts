import { flushSync, mount, unmount } from 'svelte';
import { afterEach, describe, expect, it } from 'vitest';
import ReactivityFixture from './ReactivityFixture.svelte';
import { probe, probeStyle, probeVariants, resetProbe } from './probe-motion-component.svelte.js';

let instance: ReturnType<typeof mount> | undefined;

function changeVariant() {
	(document.querySelector('#change-variant') as HTMLButtonElement).click();
}

afterEach(async () => {
	if (instance) await unmount(instance);
	instance = undefined;
	resetProbe();
	document.body.innerHTML = '';
});

describe('motion component reactivity', () => {
	it('passes nested prop objects through by reference instead of deep proxying them', () => {
		instance = mount(ReactivityFixture, { target: document.body });
		flushSync();

		expect(probe.createProps).not.toBeNull();
		expect(probe.createProps?.style).toBe(probeStyle);
		expect(probe.createProps?.variants).toBe(probeVariants);
	});

	it('keeps nested prop identity stable across recomputations', () => {
		instance = mount(ReactivityFixture, { target: document.body });
		flushSync();

		changeVariant();
		flushSync();

		const latest = probe.updateProps.at(-1);
		expect(latest).toBeDefined();
		expect(latest?.animate).toBe('hidden');
		expect(latest?.style).toBe(probeStyle);
		expect(latest?.variants).toBe(probeVariants);
		expect(latest?.style).toBe(probe.createProps?.style);
		expect(latest?.variants).toBe(probe.createProps?.variants);
	});

	it('keeps the context visual element defined across a variant change', () => {
		instance = mount(ReactivityFixture, { target: document.body });
		flushSync();

		const mounted = probe.renderProps?.visualElement;
		expect(mounted).toBeDefined();

		changeVariant();

		// Read before the commit flushes: the context must not drop its visual
		// element while the derived tree-variant object is rebuilt.
		expect(probe.renderProps?.visualElement).toBe(mounted);

		flushSync();
		expect(probe.renderProps?.visualElement).toBe(mounted);
	});
});
