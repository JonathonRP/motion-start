// @vitest-environment node

import { afterEach, expect, test, vi } from 'vitest';

async function loadSupportsWaapi() {
	vi.resetModules();
	return (await import('../supports-waapi.js')).supportsWaapi;
}

afterEach(() => {
	vi.unstubAllGlobals();
});

test('returns false in a server environment without Element', async () => {
	vi.stubGlobal('Element', undefined);
	const supportsWaapi = await loadSupportsWaapi();

	expect(() => supportsWaapi()).not.toThrow();
	expect(supportsWaapi()).toBe(false);
});

test('returns false when Element.prototype.animate is not callable', async () => {
	class MockElement {}
	Object.defineProperty(MockElement.prototype, 'animate', { value: undefined });
	vi.stubGlobal('Element', MockElement);
	const supportsWaapi = await loadSupportsWaapi();

	expect(supportsWaapi()).toBe(false);
});

test('returns true when Element.prototype.animate is callable', async () => {
	class MockElement {}
	Object.defineProperty(MockElement.prototype, 'animate', { value: () => undefined });
	vi.stubGlobal('Element', MockElement);
	const supportsWaapi = await loadSupportsWaapi();

	expect(supportsWaapi()).toBe(true);
});
