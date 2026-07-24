import { flushSync, mount, unmount } from 'svelte';
import { afterEach, describe, expect, it } from 'vitest';
import MotionConfigContextFixture from './MotionConfigContextFixture.svelte';

let instance: ReturnType<typeof mount> | undefined;

afterEach(async () => {
	if (instance) await unmount(instance);
	instance = undefined;
	document.body.innerHTML = '';
});

describe('MotionConfigContext', () => {
	it('uses the public reactive context shape for providers and consumers', () => {
		instance = mount(MotionConfigContextFixture, { target: document.body });
		flushSync();
		expect(document.querySelector('[data-testid="reduced-motion"]')?.textContent).toBe('never');

		(document.querySelector('button') as HTMLButtonElement).click();
		flushSync();

		expect(document.querySelector('[data-testid="reduced-motion"]')?.textContent).toBe('always');
	});
});
