import { flushSync, mount, tick, unmount } from 'svelte';
import { afterEach, describe, expect, it } from 'vitest';
import PresenceLifecycleFixture from './PresenceLifecycleFixture.svelte';

let instance: ReturnType<typeof mount> | undefined;

function click(selector: string) {
	(document.querySelector(selector) as HTMLButtonElement).click();
	flushSync();
}

function completed() {
	return document.querySelector('#completed')?.textContent;
}

afterEach(async () => {
	if (instance) await unmount(instance);
	instance = undefined;
	document.body.innerHTML = '';
});

describe('PresenceChild ownership', () => {
	it('waits for every registered descendant before completing an exit', async () => {
		instance = mount(PresenceLifecycleFixture, { target: document.body });
		flushSync();

		click('#exit');
		expect(document.querySelector('#complete-0')?.getAttribute('data-present')).toBe('false');
		expect(document.querySelector('#complete-1')?.getAttribute('data-present')).toBe('false');

		click('#complete-0');
		expect(completed()).toBe('0');

		click('#complete-1');
		expect(completed()).toBe('1');
	});

	it('resets descendant completion across multiple exit cycles', async () => {
		instance = mount(PresenceLifecycleFixture, { target: document.body });
		flushSync();

		click('#exit');
		click('#complete-0');
		click('#complete-1');
		expect(completed()).toBe('1');

		click('#enter');
		click('#exit');
		click('#complete-0');
		expect(completed()).toBe('1');
		click('#complete-1');
		expect(completed()).toBe('2');
	});

	it('completes on the next tick when no descendant registers exit work', async () => {
		instance = mount(PresenceLifecycleFixture, {
			target: document.body,
			props: { participants: 0 },
		});
		flushSync();

		click('#exit');
		expect(completed()).toBe('0');
		await tick();
		await tick();

		expect(completed()).toBe('1');
	});
});
