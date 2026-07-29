/**
 * Geometry for the motion-start mark.
 *
 * Shared by `ms-mark.svelte` (which animates it with motion-start) and
 * `scripts/build-icons.js` (which rasterises a still version into the favicon
 * set). Keeping it in one plain module means the animated logo and the
 * generated icons can never drift apart.
 *
 * The artwork is a 64 x 64 rounded tile:
 *   - a magenta base with two radial blobs sitting on top of it - a tight
 *     yellow circle in the top right corner and a broad blue sweep across the
 *     bottom left. Both centres and radii were fitted by least squares to the
 *     colour regions in the design concept, which is a mesh gradient rather
 *     than a straight diagonal ramp.
 *   - a slanted "Ms" drawn last, so it always sits in front of the blobs.
 */

/**
 * Glyph skeletons, authored upright in a local space where the cap line is
 * y = 0 and the M's baseline is y = 48. They are stroked rather than filled,
 * which is what gives the concept's even monoline weight.
 */
export const M_PATH = 'M 0 48 L 0 0 L 12 42 L 24 0 L 24 48';

/** Lower case s, 23 wide x 36 tall. */
export const S_PATH =
	'M 22.4 8.4 C 22.4 3.2 17.8 0 11.6 0 C 5.5 0 1 3 1 7.8 C 1 12 4 14.6 9.7 16 C 17.2 17.8 22.4 20.6 22.4 26.2 C 22.4 32.4 17.4 36 11.2 36 C 5 36 0 32 0 26.4';

export const GLYPH_STROKE = 7.8;

/** Warm off-white, sampled from the concept - deliberately not pure white. */
export const GLYPH_FILL = '#f7f2ec';

/**
 * The two glyphs are placed independently: the M sits hard against the left
 * edge, and the s is rotated further clockwise and pushed right until it runs
 * off the tile, matching the concept. Both share the same slant and scale.
 */
const SLANT = 'scale(0.76) skewX(-13)';
export const M_TRANSFORM = `translate(22 26) rotate(9) ${SLANT} translate(-18 -27)`;
export const S_TRANSFORM = `translate(46.5 43) rotate(-14) scale(1.04) ${SLANT} translate(-11.2 -18)`;

/** Magenta base, bottom-left corner to top-right. Colour keyframes per stop. */
export const BASE = [
	{ offset: 0, colors: ['#c98ccd', '#c485d1', '#c98ccd'] },
	{ offset: 1, colors: ['#d283cb', '#d97ccf', '#d283cb'] },
];

/**
 * Radial blobs. `solid` is the offset at which the blob stops being fully
 * opaque and starts fading, so the ratio `solid` -> 1 controls how hard the
 * edge reads. The concept's yellow edge is much harder than its blue one, but
 * because the yellow circle is small and the blue sweep is large, both land at
 * about the same fraction of their own radius.
 *
 * `from` is the concept's measured position, so the still icons and the OG card
 * match the design exactly; `to` is where the spring throws it. The two blobs
 * run at different durations so they drift permanently out of phase instead of
 * pulsing in lockstep.
 */
export const BLOBS = [
	{
		id: 'blue',
		colors: ['#b4c6e6', '#aac1ea', '#b4c6e6'],
		solid: 0.8,
		duration: 4.2,
		from: { cx: 9.5, cy: 85.9, r: 45 },
		to: { cx: 24, cy: 73, r: 53 },
	},
	{
		id: 'yellow',
		colors: ['#f2de58', '#f6e550', '#f2de58'],
		solid: 0.78,
		duration: 3.4,
		from: { cx: 48, cy: 6, r: 30 },
		to: { cx: 36, cy: 18, r: 36 },
	},
];

/** Corner radius of the tile, in the 64 x 64 user space. */
export const TILE_RADIUS = 13;

/**
 * A standalone, un-animated SVG document for the mark. Embedded (with `x`/`y`)
 * as a nested `<svg>` inside the Open Graph card. The app icons come from
 * `static/logo.webp` instead, so this no longer feeds the favicon set.
 *
 * @param {{ size?: number, rounded?: boolean, x?: number, y?: number, idPrefix?: string }} [options]
 * @returns {string}
 */
export function renderStaticMark({ size = 64, rounded = true, x = 0, y = 0, idPrefix = 'ms' } = {}) {
	/** @param {string} name */
	const id = (name) => `${idPrefix}-${name}`;
	const radius = rounded ? TILE_RADIUS : 0;

	const blobs = BLOBS.map(
		(
			blob
		) => `<radialGradient id="${id(blob.id)}" gradientUnits="userSpaceOnUse" cx="${blob.from.cx}" cy="${blob.from.cy}" r="${blob.from.r}">
			<stop offset="0" stop-color="${blob.colors[0]}" stop-opacity="1" />
			<stop offset="${blob.solid}" stop-color="${blob.colors[0]}" stop-opacity="1" />
			<stop offset="1" stop-color="${blob.colors[0]}" stop-opacity="0" />
		</radialGradient>`
	).join('\n\t\t');

	const layers = BLOBS.map((blob) => `<rect x="0" y="0" width="64" height="64" fill="url(#${id(blob.id)})" />`).join(
		'\n\t\t'
	);

	return `<svg xmlns="http://www.w3.org/2000/svg" x="${x}" y="${y}" width="${size}" height="${size}" viewBox="0 0 64 64" role="img">
	<title>Motion Start</title>
	<defs>
		<linearGradient id="${id('base')}" gradientUnits="userSpaceOnUse" x1="0" y1="64" x2="64" y2="0">
			<stop offset="${BASE[0].offset}" stop-color="${BASE[0].colors[0]}" />
			<stop offset="${BASE[1].offset}" stop-color="${BASE[1].colors[0]}" />
		</linearGradient>
		${blobs}
		<clipPath id="${id('clip')}">
			<rect x="0" y="0" width="64" height="64" rx="${radius}" />
		</clipPath>
	</defs>
	<g clip-path="url(#${id('clip')})">
		<rect x="0" y="0" width="64" height="64" fill="url(#${id('base')})" />
		${layers}
		<g fill="none" stroke="${GLYPH_FILL}" stroke-width="${GLYPH_STROKE}" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="2.6">
			<path d="${M_PATH}" transform="${M_TRANSFORM}" />
			<path d="${S_PATH}" transform="${S_TRANSFORM}" />
		</g>
	</g>
</svg>
`;
}
