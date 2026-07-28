import { createRequire } from 'module';

const require = createRequire(import.meta.url);

export function getNpmTag() {
	// Read the publishable package, not the private workspace root - the root has
	// no version field, which would silently make every release tag `latest`.
	const version = require('../packages/motion-start/package.json').version;

	const prerelease = version.includes('-') ? version.slice(version.indexOf('-') + 1).split('+')[0] : null;

	return prerelease ? prerelease.split('.')[0] : 'latest';
}
