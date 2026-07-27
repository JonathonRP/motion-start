import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const version = require('../package.json').version;

const prerelease = version.includes('-')
	? version.slice(version.indexOf('-') + 1).split('+')[0]
	: null;
const tag = prerelease ? prerelease.split('.')[0] : 'latest';

process.stdout.write(tag);
