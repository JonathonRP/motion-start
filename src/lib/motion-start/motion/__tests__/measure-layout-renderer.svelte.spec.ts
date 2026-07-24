import { flushSync, mount, unmount } from 'svelte';
import { afterEach, describe, expect, test, vi } from 'vitest';
import MeasureLayoutRendererFixture from './MeasureLayoutRendererFixture.svelte';

let instance: ReturnType<typeof mount> | undefined;

afterEach(async () => {
	if (instance) await unmount(instance);
	instance = undefined;
	document.body.innerHTML = '';
});

function click(label: string) {
	const button = [...document.querySelectorAll('button')].find((candidate) => candidate.textContent === label);
	(button as HTMLButtonElement).click();
	flushSync();
}

describe('MeasureLayoutRenderer', () => {
	test('keeps the instance across prop updates and destroys it when the feature disappears', async () => {
		const onmount = vi.fn();
		const ondestroy = vi.fn();
		instance = mount(MeasureLayoutRendererFixture, { target: document.body, props: { onmount, ondestroy } });
		flushSync();

		expect(onmount).toHaveBeenCalledTimes(1);
		click('update');
		expect(onmount).toHaveBeenCalledTimes(1);
		expect(ondestroy).not.toHaveBeenCalled();

		click('toggle');
		expect(ondestroy).toHaveBeenCalledTimes(1);

		click('toggle');
		expect(onmount).toHaveBeenCalledTimes(2);
	});
});
