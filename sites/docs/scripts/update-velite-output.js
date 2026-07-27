import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const dtsPath = join(__dirname, '../.velite/index.d.ts');
const indexPath = join(__dirname, '../.velite/index.js');

async function replaceContents() {
	const data = await readFile(dtsPath, 'utf8').catch((err) => {
		console.error('Error reading file:', err);
	});
	if (!data) return;

	const updatedContent = data.replace("'../velite.config'", "'../velite.config.js'");
	if (updatedContent === data) return;

	await writeFile(dtsPath, updatedContent, 'utf8').catch((err) => {
		console.error('Error writing file:', err);
	});
}

// Velite 0.4 emits the `with { type: 'json' }` import attribute itself, but
// older versions did not. Only append it where it is genuinely missing,
// otherwise re-running the patch stacks duplicate attributes onto the same
// specifier and the generated module stops parsing.
async function replaceIndexContents() {
	const data = await readFile(indexPath, 'utf8').catch((err) => {
		console.error('Error reading file:', err);
	});
	if (!data) return;

	const updatedContent = data.replace(/\.json'(?! with \{ type: 'json' \})/g, ".json' with { type: 'json' }");
	if (updatedContent === data) return;

	await writeFile(indexPath, updatedContent, 'utf8').catch((err) => {
		console.error('Error writing file:', err);
	});
}

await replaceContents();
await replaceIndexContents();
