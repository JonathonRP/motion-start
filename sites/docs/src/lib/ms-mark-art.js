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
 * `from` is the concept's measured position and frame 0 of the loop, so the
 * still icons and the OG card match the design exactly; `to` is the far end of
 * the sweep, which the snap briefly overshoots.
 *
 * The travel is mostly positional, not scalar. An earlier pass grew the yellow
 * radius by 20% and it swallowed the magenta entirely at the far end - the tile
 * stopped being a three-colour mesh and just read as a slow brightness pulse.
 * Swinging the centres while holding the radii roughly steady keeps all three
 * colours on screen the whole time, so the movement reads as movement.
 *
 * Both blobs share the mark's single clock; `lead` is how far each is held back
 * within it. The blue sweep runs first and the yellow answers it, and both land
 * before the lockup reacts, which is what makes the beat look caused rather
 * than coincidental.
 */
export const BLOBS = [
	{
		id: 'blue',
		colors: ['#b4c6e6', '#aac1ea', '#b4c6e6'],
		solid: 0.8,
		lead: 0,
		from: { cx: 9.5, cy: 85.9, r: 45 },
		to: { cx: 27, cy: 80, r: 47 },
	},
	{
		id: 'yellow',
		colors: ['#f2de58', '#f6e550', '#f2de58'],
		solid: 0.78,
		lead: 0.28,
		from: { cx: 48, cy: 6, r: 30 },
		to: { cx: 42, cy: 11, r: 31 },
	},
];

/** Corner radius of the tile, in the 64 x 64 user space. */
export const TILE_RADIUS = 13;

/*
 * ------------------------------------------------------------------ timing --
 *
 * The mark is one bounce, and every moving part is a consequence of it.
 *
 * This used to be four clocks: an 8.8s sine float on the landing page, two
 * blob springs, a colour cycle and a glyph beat. Each part moved and none of
 * them ever agreed, so the whole thing read as drift with unrelated twitches
 * in it. Sharing one period and one phase vocabulary is what turns a pile of
 * loops into a character.
 *
 * The story: the tile falls, lands, squashes, splashes light out sideways, and
 * the letters get jolted by the impact before it springs back up. Everything
 * below is expressed as a fraction of BOUNCE, so retiming is one number.
 */
export const BOUNCE = 2.9;

/** apex - falling - contact - squashed - launch - rising - apex */
export const PHASES = [0, 0.34, 0.46, 0.52, 0.6, 0.78, 1];

/** The exact phase of impact. Everything reactive is pinned to it. */
export const IMPACT = PHASES[3];

/**
 * Gravity: accelerate into the floor, decelerate out of it. `circIn`/`circOut`
 * are much closer to a real fall than `easeIn`/`easeOut`, which are too gentle
 * at the extremes to read as weight.
 */
export const GRAVITY = ['circIn', 'circIn', 'linear', 'circOut', 'circOut', 'easeOut'];

/**
 * Squash and stretch on the tile itself. Volume is roughly conserved - x grows
 * as y shrinks - which is the whole trick that makes a rectangle read as
 * something with mass rather than something being scaled.
 *
 * `transform-origin: bottom` keeps the base planted while it squashes, so it
 * lands on the floor instead of shrinking towards its middle.
 */
export const HOP = {
	y: [-16, -3, 5, 8, 1, -12, -16],
	scaleX: [1, 0.96, 1.05, 1.17, 0.93, 0.99, 1],
	scaleY: [1, 1.05, 0.95, 0.83, 1.11, 1.01, 1],
	rotate: [-2.5, -1, 0.5, 1.5, 0, -2, -2.5],
};

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
