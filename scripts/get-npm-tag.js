import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const version = require('../package.json').version;
const prerelease = version.split('-')[1];
const tag = prerelease ? prerelease.split('.')[0] : 'latest';

process.stdout.write(tag);
