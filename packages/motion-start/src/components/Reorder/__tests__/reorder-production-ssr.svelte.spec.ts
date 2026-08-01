// @vitest-environment node

import { fileURLToPath } from 'node:url';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { build } from 'vite';
import { describe, expect, it } from 'vitest';

type SsrEnvironment = 'development' | 'production';

type SsrFixtureModule = {
	renderFixture: (withItem?: boolean) => string;
	renderGroupWithoutValues: () => string;
};

const ssrModules = new Map<SsrEnvironment, Promise<SsrFixtureModule>>();

function loadSsrModule(environment: SsrEnvironment) {
	let ssrModule = ssrModules.get(environment);
	if (ssrModule) return ssrModule;

	// Bundle the fixture with Svelte's server runtime so its render helper and
	// components share one SSR context when the in-memory chunk is imported.
	ssrModule = build({
		root: fileURLToPath(new URL('../../../../', import.meta.url)),
		configFile: false,
		logLevel: 'silent',
		plugins: [svelte()],
		define: {
			'process.env.NODE_ENV': JSON.stringify(environment),
		},
		build: {
			ssr: 'src/components/Reorder/__tests__/production-ssr-entry.ts',
			write: false,
			rollupOptions: {
				output: {
					format: 'es',
					inlineDynamicImports: true,
				},
			},
		},
		ssr: {
			noExternal: true,
		},
	}).then(async (result) => {
		const builds = Array.isArray(result) ? result : [result];
		const entry = builds
			.flatMap((buildResult) => ('output' in buildResult ? buildResult.output : []))
			.find((output) => output.type === 'chunk' && output.isEntry);

		if (entry?.type !== 'chunk') {
			throw new Error('SSR build did not emit an entry chunk');
		}

		const url = `data:text/javascript;base64,${Buffer.from(entry.code).toString('base64')}`;
		return (await import(/* @vite-ignore */ url)) as SsrFixtureModule;
	});

	ssrModules.set(environment, ssrModule);
	return ssrModule;
}

function elementMarkup(body: string, tag: string, testId: string) {
	const match = body.match(new RegExp(`<${tag}\\b[^>]*>[\\s\\S]*?data-testid="${testId}"[\\s\\S]*?</${tag}>`));
	if (!match) throw new Error(`Could not find ${tag} containing ${testId}`);
	return match[0];
}

describe('Reorder production SSR', () => {
	it('does not render the Group values invariant result as literal text', async () => {
		const { renderFixture } = await loadSsrModule('production');

		const group = elementMarkup(renderFixture(), 'ul', 'group-content');

		expect(group).not.toContain('true');
	}, 30_000);

	it('does not render the Item context invariant result as literal text', async () => {
		const { renderFixture } = await loadSsrModule('production');

		const item = elementMarkup(renderFixture(true), 'li', 'item-content');

		expect(item).not.toContain('true');
	}, 30_000);
});

describe('Reorder.Group development invariant', () => {
	it('throws the established error when values is missing', async () => {
		const { renderGroupWithoutValues } = await loadSsrModule('development');

		expect(renderGroupWithoutValues).toThrowError('Reorder.Group must be provided a values prop');
	}, 30_000);
});
