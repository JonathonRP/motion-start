<script lang="ts">
	import { motion } from "motion-start";
	import { MediaQuery } from "svelte/reactivity";
	import {
		GLYPH_STROKE,
		GLYPH_TRANSFORM,
		GRADIENT_FROM,
		GRADIENT_TO,
		M_PATH,
		S_PATH,
		STOP_A,
		STOP_B,
		STOP_C,
		TRAILS,
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
	const trailId = `ms-trail-${uid}`;
	const trailsId = `ms-trails-${uid}`;

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
				offset="0"
				stop-color={STOP_A[0]}
				animate={playing ? { stopColor: STOP_A } : undefined}
				transition={loop}
			/>
			<motion.stop
				offset="0.55"
				stop-color={STOP_B[0]}
				animate={playing ? { stopColor: STOP_B } : undefined}
				transition={loop}
			/>
			<motion.stop
				offset="1"
				stop-color={STOP_C[0]}
				animate={playing ? { stopColor: STOP_C } : undefined}
				transition={loop}
			/>
		</motion.linearGradient>

		<linearGradient id={trailId} gradientUnits="userSpaceOnUse" x1="22" y1="24" x2="2" y2="2">
			<stop offset="0" stop-color="#ffffff" stop-opacity="0.95" />
			<stop offset="1" stop-color="#ffffff" stop-opacity="0" />
		</linearGradient>

		<g id={trailsId} fill="none" stroke="url(#{trailId})" stroke-linecap="round">
			{#each TRAILS as trail (trail.d)}
				<path d={trail.d} stroke-width={trail.width} />
			{/each}
		</g>
	</defs>

	<rect x="0" y="0" width="64" height="64" rx="14" fill="url(#{fillId})" />

	<use href="#{trailsId}" />
	<use href="#{trailsId}" transform="rotate(180 32 32)" />

	<g
		transform={GLYPH_TRANSFORM}
		fill="none"
		stroke="#ffffff"
		stroke-width={GLYPH_STROKE}
		stroke-linecap="butt"
		stroke-linejoin="miter"
		stroke-miterlimit="2.4"
	>
		<path d={M_PATH} />
		<path d={S_PATH} transform="translate(26 0)" />
	</g>
</svg>
