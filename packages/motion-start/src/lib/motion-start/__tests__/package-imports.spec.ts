import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, extname, join, resolve } from 'node:path';
import { describe, expect, test } from 'vitest';

const sourceRoot = resolve('src/lib/motion-start');
const sourceExtensions = ['.ts', '.js', '.svelte.ts', '.svelte.js', '.svelte'];

function walk(directory: string): string[] {
	return readdirSync(directory).flatMap((entry) => {
		const path = join(directory, entry);
		return statSync(path).isDirectory() ? walk(path) : [path];
	});
}

function resolvesToSource(importer: string, specifier: string) {
	const target = resolve(dirname(importer), specifier);
	return (
		existsSync(target) ||
		sourceExtensions.some((extension) => existsSync(`${target}${extension}`)) ||
		sourceExtensions.some((extension) => existsSync(join(target, `index${extension}`)))
	);
}

describe('package ESM imports', () => {
	test('does not advertise the Svelte component root as raw Node ESM', () => {
		const packageJson = JSON.parse(readFileSync(resolve('package.json'), 'utf8'));
		expect(packageJson.exports['.'].svelte).toBe('./dist/index.js');
		expect(packageJson.exports['.'].default).toBeUndefined();
		expect(packageJson.exports['./client'].default).toBeUndefined();
		expect(packageJson.exports['./m'].default).toBeUndefined();
		expect(packageJson.exports['./dom'].default).toBe('./dist/dom.js');
	});

	test('does not expose raw source through wildcard subpaths', () => {
		const packageJson = JSON.parse(readFileSync(resolve('package.json'), 'utf8'));
		expect(packageJson.exports['./src/*.svelte']).toBeUndefined();
		expect(packageJson.exports['./src/*.js']).toBeUndefined();
	});

	test('fully specifies relative JavaScript imports for Node ESM consumers', () => {
		const invalid: string[] = [];
		const importPattern = /(?:from\s*|import\s*(?:\(\s*)?)['"](\.\.?\/[^'"]+)['"]/g;

		for (const file of walk(sourceRoot)) {
			if (!/\.(?:ts|js|svelte)$/.test(file) || /\.(?:test|spec)\./.test(file)) continue;
			const source = readFileSync(file, 'utf8');
			for (const match of source.matchAll(importPattern)) {
				const specifier = match[1];
				if (!resolvesToSource(file, specifier)) continue;
				const extension = extname(specifier);
				if (extension !== '.js' && extension !== '.svelte') {
					invalid.push(`${file.slice(sourceRoot.length + 1)}: ${specifier}`);
				}
			}
		}

		expect(invalid).toEqual([]);
	});
});
