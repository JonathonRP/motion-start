/**
 * Geometry for the motion-start mark.
 *
 * Shared by `ms-mark.svelte` (which animates the gradient with motion-start)
 * and `scripts/build-icons.js` (which rasterises a still version into the
 * favicon set). Keeping it in one plain module means the animated logo and the
 * generated icons can never drift apart.
 *
 * The artwork is a 64 x 64 square:
 *   - a rounded tile filled by a three-stop diagonal gradient
 *   - two sets of trailing "speed line" arcs about the centre
 *   - a bold monoline "MS", slanted and rotated
 */

/** Bold monoline glyphs. Each is 22 x 30 once the 6.6 stroke is applied. */
export const M_PATH = 'M 3.3 26.7 L 3.3 3.3 L 11 17 L 18.7 3.3 L 18.7 26.7';

export const S_PATH =
	'M 18.7 9.9 C 18.7 5.3 14.8 3.3 11 3.3 C 6.5 3.3 3.3 5.7 3.3 9.3 C 3.3 12.9 6 14.5 11 15 C 16.5 15.6 18.7 17.3 18.7 20.7 C 18.7 24.3 15.5 26.7 11 26.7 C 7 26.7 3.3 24.7 3.3 20.1';

export const GLYPH_STROKE = 6.6;

/** Centres the 48 x 30 "MS" lockup on the tile and gives it its italic slant. */
export const GLYPH_TRANSFORM = 'translate(32 32) rotate(-7) skewX(-11) scale(0.8) translate(-24 -15)';

/** Concentric arcs, drawn top-left and mirrored through the centre. */
export const TRAILS = [
	{ d: 'M 21.67 12.58 A 22 22 0 0 0 12.06 22.7', width: 2.9 },
	{ d: 'M 18.69 8.29 A 26.5 26.5 0 0 0 7.11 20.48', width: 2.9 },
	{ d: 'M 15.71 4 A 31 31 0 0 0 2.16 18.26', width: 2.9 },
];

/**
 * Gradient stop keyframes: deep indigo -> violet -> magenta, the original
 * logo's blue carried through the docs accent palette. Index 0 is also the
 * still colour used for the favicons.
 */
export const STOP_A = ['#0f1191', '#241bb4', '#0f1191'];
export const STOP_B = ['#4a3ce4', '#7f5cf0', '#4a3ce4'];
export const STOP_C = ['#a555ef', '#e05bc9', '#a555ef'];

/** Gradient vector keyframes, in the 64 x 64 user space. */
export const GRADIENT_FROM = { x1: -14, y1: -6, x2: 70, y2: 72 };
export const GRADIENT_TO = { x1: 22, y1: -26, x2: 104, y2: 92 };

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
	const trails = TRAILS.map((t) => `<path d="${t.d}" stroke-width="${t.width}" />`).join('');
	const fill = `${idPrefix}-fill`;
	const trail = `${idPrefix}-trail`;
	const trailSet = `${idPrefix}-trails`;

	return `<svg xmlns="http://www.w3.org/2000/svg" x="${x}" y="${y}" width="${size}" height="${size}" viewBox="0 0 64 64" role="img">
	<title>Motion Start</title>
	<defs>
		<linearGradient id="${fill}" gradientUnits="userSpaceOnUse" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">
			<stop offset="0" stop-color="${STOP_A[0]}" />
			<stop offset="0.55" stop-color="${STOP_B[0]}" />
			<stop offset="1" stop-color="${STOP_C[0]}" />
		</linearGradient>
		<linearGradient id="${trail}" gradientUnits="userSpaceOnUse" x1="22" y1="24" x2="2" y2="2">
			<stop offset="0" stop-color="#ffffff" stop-opacity="0.95" />
			<stop offset="1" stop-color="#ffffff" stop-opacity="0" />
		</linearGradient>
		<g id="${trailSet}" fill="none" stroke="url(#${trail})" stroke-linecap="round">${trails}</g>
	</defs>
	<rect x="0" y="0" width="64" height="64" rx="${rounded ? 14 : 0}" fill="url(#${fill})" />
	<use href="#${trailSet}" />
	<use href="#${trailSet}" transform="rotate(180 32 32)" />
	<g transform="${GLYPH_TRANSFORM}" fill="none" stroke="#ffffff" stroke-width="${GLYPH_STROKE}" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="2.4">
		<path d="${M_PATH}" />
		<path d="${S_PATH}" transform="translate(26 0)" />
	</g>
</svg>
`;
}
