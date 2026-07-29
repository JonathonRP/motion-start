/**
 * Regenerates the favicon set from the shared mark geometry.
 *
 * Run with `bun run icons` after changing `src/lib/ms-mark-art.js` so the
 * static icons stay in step with the animated `<MsMark />`.
 *
 * Outputs into `static/`:
 *   favicon.svg, favicon-16x16.png, favicon-32x32.png, favicon.ico,
 *   apple-touch-icon.png, android-chrome-{192,512}x{192,512}.png, og.png
 */

import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import pngToIco from 'png-to-ico';
import sharp from 'sharp';
import { BASE, BLOBS, renderStaticMark } from '../src/lib/ms-mark-art.js';

const [BLUE, YELLOW] = BLOBS.map((blob) => blob.colors[0]);
const MAGENTA = BASE[1].colors[0];

const staticDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'static');

/** @param {string} svg @param {number} size */
const raster = (svg, size) => sharp(Buffer.from(svg), { density: 384 }).resize(size, size).png().toBuffer();

/**
 * Open Graph card: the mark and wordmark on the docs' dark page colour, over
 * the same gradient bloom the landing hero uses.
 */
function renderOgCard() {
	const mark = renderStaticMark({ size: 168, x: 516, y: 168, idPrefix: 'og' });

	return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
	<defs>
		<radialGradient id="bloom" cx="0.5" cy="0.5" r="0.5">
			<stop offset="0" stop-color="${MAGENTA}" stop-opacity="0.5" />
			<stop offset="0.5" stop-color="${YELLOW}" stop-opacity="0.2" />
			<stop offset="1" stop-color="${BLUE}" stop-opacity="0" />
		</radialGradient>
	</defs>
	<rect width="1200" height="630" fill="#232327" />
	<ellipse cx="600" cy="260" rx="640" ry="430" fill="url(#bloom)" />
	${mark}
	<text x="600" y="428" fill="#ffffff" font-family="ui-monospace, 'DejaVu Sans Mono', monospace" font-size="72" font-weight="500" text-anchor="middle">motion start</text>
	<text x="600" y="486" fill="#a9a9b3" font-family="ui-monospace, 'DejaVu Sans Mono', monospace" font-size="26" text-anchor="middle">declarative motion for Svelte</text>
</svg>
`;
}

async function main() {
	await mkdir(staticDir, { recursive: true });

	const markSvg = renderStaticMark({ size: 64 });
	await writeFile(join(staticDir, 'favicon.svg'), markSvg, 'utf8');

	/** @type {Array<[string, number]>} */
	const pngs = [
		['favicon-16x16.png', 16],
		['favicon-32x32.png', 32],
		['apple-touch-icon.png', 180],
		['android-chrome-192x192.png', 192],
		['android-chrome-512x512.png', 512],
	];

	for (const [name, size] of pngs) {
		await writeFile(join(staticDir, name), await raster(markSvg, size));
	}

	// .ico wants a few square sizes; 16/32/48 covers browser tabs and Windows.
	const icoSources = await Promise.all([16, 32, 48].map((size) => raster(markSvg, size)));
	await writeFile(join(staticDir, 'favicon.ico'), await pngToIco(icoSources));

	const og = await sharp(Buffer.from(renderOgCard()), { density: 288 }).resize(1200, 630).png().toBuffer();
	await writeFile(join(staticDir, 'og.png'), og);

	console.log(`icons written to ${staticDir}`);
}

await main();
