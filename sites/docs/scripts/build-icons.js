/**
 * Regenerates the favicon set and the Open Graph card.
 *
 * The app icons come from `static/logo.webp` â€” the original navy MS mark. It is
 * a raster, so there is no vector favicon: the PNG sizes and the .ico are
 * resampled from the 698px source.
 *
 * The OG card still uses the animated mark's palette and geometry, since that
 * is the artwork the site itself shows.
 *
 * Run with `bun run icons` after changing either source.
 *
 * Outputs into `static/`:
 *   favicon-16x16.png, favicon-32x32.png, favicon.ico,
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
const iconSource = join(staticDir, 'logo.webp');

/**
 * Downsampling a 698px raster to 16px with a plain box filter turns the italic
 * MS to mud, so use Lanczos and give the small sizes a light sharpen back.
 *
 * @param {number} size
 */
const rasterIcon = (size) => {
	const pipeline = sharp(iconSource).resize(size, size, { kernel: 'lanczos3', fit: 'cover' });
	return (size <= 48 ? pipeline.sharpen({ sigma: 0.6 }) : pipeline).png().toBuffer();
};

/**
 * Open Graph card.
 *
 * Asymmetric rather than centred: the tile sits left with a soft bloom of its
 * own colours behind it, and the wordmark, tagline and a sample of the API
 * stack up on the right. The background aura deliberately drops the tile's
 * yellow - yellow at low opacity over a neutral dark reads as olive sludge -
 * and keeps magenta and blue, which stay chromatic when they dim.
 *
 * `font-family` is a plain stack rather than `ui-monospace`: the rasteriser has
 * no UA to resolve the generic against and silently falls back to a serif.
 */
function renderOgCard() {
	const mark = renderStaticMark({ size: 268, x: 96, y: 181, idPrefix: 'og' });
	const mono = "Consolas, 'DejaVu Sans Mono', monospace";

	return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
	<defs>
		<radialGradient id="wash" cx="0.5" cy="0.5" r="0.5">
			<stop offset="0" stop-color="${MAGENTA}" stop-opacity="0.30" />
			<stop offset="1" stop-color="${MAGENTA}" stop-opacity="0" />
		</radialGradient>
		<radialGradient id="cool" cx="0.5" cy="0.5" r="0.5">
			<stop offset="0" stop-color="${BLUE}" stop-opacity="0.17" />
			<stop offset="1" stop-color="${BLUE}" stop-opacity="0" />
		</radialGradient>
		<radialGradient id="halo" cx="0.5" cy="0.5" r="0.5">
			<stop offset="0" stop-color="${YELLOW}" stop-opacity="0.22" />
			<stop offset="0.55" stop-color="${MAGENTA}" stop-opacity="0.14" />
			<stop offset="1" stop-color="${MAGENTA}" stop-opacity="0" />
		</radialGradient>
		<linearGradient id="rule" x1="0" y1="0" x2="1200" y2="0" gradientUnits="userSpaceOnUse">
			<stop offset="0" stop-color="${BLUE}" />
			<stop offset="0.5" stop-color="${MAGENTA}" />
			<stop offset="1" stop-color="${YELLOW}" />
		</linearGradient>
	</defs>

	<rect width="1200" height="630" fill="#131316" />
	<ellipse cx="1010" cy="90" rx="620" ry="420" fill="url(#wash)" />
	<ellipse cx="150" cy="600" rx="620" ry="420" fill="url(#cool)" />

	<ellipse cx="230" cy="315" rx="250" ry="250" fill="url(#halo)" />
	${mark}

	<text x="452" y="272" fill="#f6f6f8" font-family="${mono}" font-size="82" font-weight="700" letter-spacing="-1">motion start</text>
	<text x="456" y="322" fill="#a7a7b4" font-family="${mono}" font-size="28">declarative motion for Svelte</text>

	<rect x="456" y="366" width="668" height="88" rx="16" fill="#1b1b20" stroke="#2e2e36" stroke-width="2" />
	<text x="488" y="420" font-family="${mono}" font-size="26" xml:space="preserve">
		<tspan fill="#6f6f7d">&lt;</tspan><tspan fill="${MAGENTA}">motion.div</tspan><tspan fill="#6f6f7d"> </tspan><tspan fill="${YELLOW}">animate</tspan><tspan fill="#6f6f7d">={{ </tspan><tspan fill="${YELLOW}">x</tspan><tspan fill="#6f6f7d">: </tspan><tspan fill="${BLUE}">100</tspan><tspan fill="#6f6f7d"> }} /&gt;</tspan>
	</text>

	<text x="456" y="512" fill="#75757f" font-family="${mono}" font-size="24">motion-start.com</text>

	<rect x="0" y="624" width="1200" height="6" fill="url(#rule)" />
</svg>
`;
}

async function main() {
	await mkdir(staticDir, { recursive: true });

	/** @type {Array<[string, number]>} */
	const pngs = [
		['favicon-16x16.png', 16],
		['favicon-32x32.png', 32],
		['apple-touch-icon.png', 180],
		['android-chrome-192x192.png', 192],
		['android-chrome-512x512.png', 512],
	];

	for (const [name, size] of pngs) {
		await writeFile(join(staticDir, name), await rasterIcon(size));
	}

	// .ico wants a few square sizes; 16/32/48 covers browser tabs and Windows.
	const icoSources = [];
	for (const size of [16, 32, 48]) icoSources.push(await rasterIcon(size));
	await writeFile(join(staticDir, 'favicon.ico'), await pngToIco(icoSources));

	const og = await sharp(Buffer.from(renderOgCard()), { density: 288 }).resize(1200, 630).png().toBuffer();
	await writeFile(join(staticDir, 'og.png'), og);

	console.log(`icons written to ${staticDir}`);
}

await main();
