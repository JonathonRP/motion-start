import { createRequire } from 'module';

const require = createRequire(import.meta.url);

export function getNpmTag() {
	const version = require('../package.json').version;

	const prerelease = version.includes('-')
		? version.slice(version.indexOf('-') + 1).split('+')[0]
		: null;

	return prerelease ? prerelease.split('.')[0] : 'latest';
}
