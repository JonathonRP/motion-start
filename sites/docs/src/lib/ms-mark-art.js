/**
 * Geometry for the motion-start mark.
 *
 * Shared by `ms-mark.svelte` (which animates the gradient with motion-start)
 * and `scripts/build-icons.js` (which rasterises a still version into the
 * favicon set). Keeping it in one plain module means the animated logo and the
 * generated icons can never drift apart.
 *
 * The artwork is a 64 x 64 square, traced from the design concept:
 *   - a rounded tile filled by a three-stop diagonal gradient that runs
 *     blue (bottom left) -> orchid (centre) -> sage (top right)
 *   - an oversized, heavily slanted "Ms" that bleeds past the tile and is
 *     clipped by the rounded corners
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

export const S_OFFSET = { x: 24, y: 15 };

export const GLYPH_STROKE = 7.8;

/** Light periwinkle, sampled from the concept - deliberately not pure white. */
export const GLYPH_FILL = '#ccd0d8';

/**
 * Slants the lockup, rotates it clockwise so the cap line drops to the right,
 * and scales it up until it bleeds past the tile edges.
 */
export const GLYPH_TRANSFORM = 'translate(28 33) rotate(9) scale(0.76) skewX(-13) translate(-18 -27)';

/**
 * Gradient stop keyframes: cornflower -> orchid -> sage, sampled from the
 * design concept. Index 0 is also the still colour used for the favicons.
 */
export const STOP_A = ['#7aa9e6', '#6f9ce8', '#7aa9e6'];
export const STOP_B = ['#aa7aca', '#b075d4', '#aa7aca'];
export const STOP_C = ['#a7c088', '#adc885', '#a7c088'];

/** Gradient vector keyframes, in the 64 x 64 user space. Runs bottom-left to top-right. */
export const GRADIENT_FROM = { x1: 0, y1: 64, x2: 64, y2: 0 };
export const GRADIENT_TO = { x1: 10, y1: 84, x2: 80, y2: 12 };

/**
 * Stop positions. The outer two sit well inside the vector so the blue and the
 * sage read as solid corner blocks rather than meeting only at the corners,
 * which is how the concept is built. Sampled from it: the tile is still pure
 * blue at t = 0.23 and fully sage by t = 0.77.
 */
export const STOP_OFFSETS = [0.31, 0.55, 0.78];

/**
 * A standalone, un-animated SVG document for the mark. Used to generate the
 * favicon set and the static `favicon.svg`, and embedded (with `x`/`y`) as a
 * nested `<svg>` inside the Open Graph card.
 *
 * @param {{ size?: number, rounded?: boolean, x?: number, y?: number, idPrefix?: string }} [options]
 * @returns {string}
 */
export function renderStaticMark({ size = 64, rounded = true, x = 0, y = 0, idPrefix = 'ms' } = {}) {
	const { x1, y1, x2, y2 } = GRADIENT_FROM;
	const fill = `${idPrefix}-fill`;
	const clip = `${idPrefix}-clip`;
	const radius = rounded ? 14 : 0;

	return `<svg xmlns="http://www.w3.org/2000/svg" x="${x}" y="${y}" width="${size}" height="${size}" viewBox="0 0 64 64" role="img">
	<title>Motion Start</title>
	<defs>
		<linearGradient id="${fill}" gradientUnits="userSpaceOnUse" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">
			<stop offset="${STOP_OFFSETS[0]}" stop-color="${STOP_A[0]}" />
			<stop offset="${STOP_OFFSETS[1]}" stop-color="${STOP_B[0]}" />
			<stop offset="${STOP_OFFSETS[2]}" stop-color="${STOP_C[0]}" />
		</linearGradient>
		<clipPath id="${clip}">
			<rect x="0" y="0" width="64" height="64" rx="${radius}" />
		</clipPath>
	</defs>
	<g clip-path="url(#${clip})">
		<rect x="0" y="0" width="64" height="64" fill="url(#${fill})" />
		<g transform="${GLYPH_TRANSFORM}" fill="none" stroke="${GLYPH_FILL}" stroke-width="${GLYPH_STROKE}" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="2.6">
			<path d="${M_PATH}" />
			<path d="${S_PATH}" transform="translate(${S_OFFSET.x} ${S_OFFSET.y})" />
		</g>
	</g>
</svg>
`;
}
