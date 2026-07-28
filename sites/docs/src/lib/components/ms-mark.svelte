<script lang="ts">
	import { motion } from "motion-start";
	import { MediaQuery } from "svelte/reactivity";
	import {
		GLYPH_FILL,
		GLYPH_STROKE,
		GLYPH_TRANSFORM,
		GRADIENT_FROM,
		GRADIENT_TO,
		M_PATH,
		S_OFFSET,
		S_PATH,
		STOP_A,
		STOP_B,
		STOP_C,
		STOP_OFFSETS,
	} from "$lib/ms-mark-art.js";

	/**
	 * The motion-start mark, drawn as vectors rather than a raster logo.
	 *
	 * The rounded tile is filled by a gradient animated with the library itself:
	 * `motion.linearGradient` sweeps the gradient vector across the tile while
	 * three `motion.stop`s cycle their colours. Both run on the same long,
	 * mirrored loop so the tile reads as a slow drift rather than a strobe.
	 *
	 * Geometry and palette live in `$lib/ms-mark-art.js`, shared with the icon
	 * generator so the favicons cannot drift from the animated mark.
	 */

	type Props = {
		/** Rendered edge length in px. The artwork is square. */
		size?: number | string;
		class?: string;
		/** Set false for a still mark. */
		animated?: boolean;
		/** When provided the mark is exposed to assistive tech with this name. */
		title?: string;
	};

	let { size = 28, class: className = "", animated = true, title = "" }: Props = $props();

	// The drift is decorative, so drop it entirely when the visitor asks for
	// reduced motion; the mark keeps its first-frame gradient.
	const reducedMotion = new MediaQuery("prefers-reduced-motion: reduce");
	const playing = $derived(animated && !reducedMotion.current);

	const uid = $props.id();
	const fillId = `ms-fill-${uid}`;
	const clipId = `ms-clip-${uid}`;

	const loop = {
		duration: 9,
		repeat: Number.POSITIVE_INFINITY,
		repeatType: "mirror",
		ease: "easeInOut",
	} as const;

	const sweep = $derived(
		playing
			? {
					x1: [GRADIENT_FROM.x1, GRADIENT_TO.x1],
					y1: [GRADIENT_FROM.y1, GRADIENT_TO.y1],
					x2: [GRADIENT_FROM.x2, GRADIENT_TO.x2],
					y2: [GRADIENT_FROM.y2, GRADIENT_TO.y2],
				}
			: undefined
	);
</script>

<svg
	viewBox="0 0 64 64"
	width={size}
	height={size}
	class={className}
	role={title ? "img" : undefined}
	aria-hidden={title ? undefined : "true"}
	xmlns="http://www.w3.org/2000/svg"
>
	{#if title}
		<title>{title}</title>
	{/if}

	<defs>
		<motion.linearGradient
			id={fillId}
			gradientUnits="userSpaceOnUse"
			x1={GRADIENT_FROM.x1}
			y1={GRADIENT_FROM.y1}
			x2={GRADIENT_FROM.x2}
			y2={GRADIENT_FROM.y2}
			animate={sweep}
			transition={loop}
		>
			<motion.stop
				offset={STOP_OFFSETS[0]}
				stop-color={STOP_A[0]}
				animate={playing ? { stopColor: STOP_A } : undefined}
				transition={loop}
			/>
			<motion.stop
				offset={STOP_OFFSETS[1]}
				stop-color={STOP_B[0]}
				animate={playing ? { stopColor: STOP_B } : undefined}
				transition={loop}
			/>
			<motion.stop
				offset={STOP_OFFSETS[2]}
				stop-color={STOP_C[0]}
				animate={playing ? { stopColor: STOP_C } : undefined}
				transition={loop}
			/>
		</motion.linearGradient>

		<clipPath id={clipId}>
			<rect x="0" y="0" width="64" height="64" rx="14" />
		</clipPath>
	</defs>

	<g clip-path="url(#{clipId})">
		<rect x="0" y="0" width="64" height="64" fill="url(#{fillId})" />

		<g
			transform={GLYPH_TRANSFORM}
			fill="none"
			stroke={GLYPH_FILL}
			stroke-width={GLYPH_STROKE}
			stroke-linecap="butt"
			stroke-linejoin="miter"
			stroke-miterlimit="2.6"
		>
			<path d={M_PATH} />
			<path d={S_PATH} transform="translate({S_OFFSET.x} {S_OFFSET.y})" />
		</g>
	</g>
</svg>
