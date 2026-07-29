<script lang="ts">
	import { motion } from "motion-start";
	import { MediaQuery } from "svelte/reactivity";
	import {
		BASE,
		BLOBS,
		GLYPH_FILL,
		GLYPH_STROKE,
		M_PATH,
		M_TRANSFORM,
		S_PATH,
		S_TRANSFORM,
		TILE_RADIUS,
	} from "$lib/ms-mark-art.js";

	/**
	 * The motion-start mark, drawn as vectors rather than a raster logo.
	 *
	 * The tile is a mesh gradient animated with the library itself: two
	 * `motion.radialGradient` blobs drift over a `motion.linearGradient` base
	 * while every `motion.stop` cycles its colour. All of it runs on one long,
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
	const id = (name: string) => `ms-${name}-${uid}`;

	// The blobs get a springy overshoot so the tile feels alive; their colours
	// stay on a plain ease, because a spring's overshoot on a colour would push
	// channels out of gamut and just read as a flicker. Each blob runs at its
	// own duration so the two drift out of phase rather than pulsing together.
	const blobLoop = (duration: number) =>
		({
			type: "spring",
			bounce: 0.62,
			duration,
			repeat: Number.POSITIVE_INFINITY,
			repeatType: "mirror",
		}) as const;

	const colorLoop = {
		duration: 4,
		repeat: Number.POSITIVE_INFINITY,
		repeatType: "mirror",
		ease: "easeInOut",
	} as const;

	// The lockup is deliberately slower than the tile. It is on an ease, not a
	// spring: a spring spends most of its duration asymptotically parked on the
	// target, which at this amplitude is indistinguishable from not animating at
	// all - the first attempt at this looked completely static.
	const glyphLoop = (duration: number) =>
		({
			duration,
			repeat: Number.POSITIVE_INFINITY,
			repeatType: "mirror",
			ease: "easeInOut",
		}) as const;

	const drift = $derived(
		BLOBS.map((blob) =>
			playing
				? {
						cx: [blob.from.cx, blob.to.cx],
						cy: [blob.from.cy, blob.to.cy],
						r: [blob.from.r, blob.to.r],
					}
				: undefined
		)
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
		<motion.linearGradient id={id("base")} gradientUnits="userSpaceOnUse" x1="0" y1="64" x2="64" y2="0">
			{#each BASE as stop (stop.offset)}
				<motion.stop
					offset={stop.offset}
					stop-color={stop.colors[0]}
					animate={playing ? { stopColor: stop.colors } : undefined}
					transition={colorLoop}
				/>
			{/each}
		</motion.linearGradient>

		{#each BLOBS as blob, i (blob.id)}
			<motion.radialGradient
				id={id(blob.id)}
				gradientUnits="userSpaceOnUse"
				cx={blob.from.cx}
				cy={blob.from.cy}
				r={blob.from.r}
				animate={drift[i]}
				transition={blobLoop(blob.duration)}
			>
				{#each [0, blob.solid, 1] as offset, stopIndex (offset)}
					<motion.stop
						{offset}
						stop-color={blob.colors[0]}
						stop-opacity={stopIndex === 2 ? 0 : 1}
						animate={playing ? { stopColor: blob.colors } : undefined}
						transition={colorLoop}
					/>
				{/each}
			</motion.radialGradient>
		{/each}

		<clipPath id={id("clip")}>
			<rect x="0" y="0" width="64" height="64" rx={TILE_RADIUS} />
		</clipPath>
	</defs>

	<g clip-path="url(#{id('clip')})">
		<rect x="0" y="0" width="64" height="64" fill="url(#{id('base')})" />
		{#each BLOBS as blob (blob.id)}
			<rect x="0" y="0" width="64" height="64" fill="url(#{id(blob.id)})" />
		{/each}

		<!-- Drawn last so the lockup always sits in front of the gradient blobs. -->
		<g
			fill="none"
			stroke={GLYPH_FILL}
			stroke-width={GLYPH_STROKE}
			stroke-linecap="butt"
			stroke-linejoin="miter"
			stroke-miterlimit="2.6"
		>
			<!--
				Placement stays on a plain wrapper `g`: motion writes its transform to
				`style.transform`, which would win over a `transform` attribute on the
				same element and throw the lockup back to the origin. Motion measures
				each path's own bbox for the transform origin, so the M breathes about
				its centre and the s pivots about its own.
			-->
			<g transform={M_TRANSFORM}>
				<motion.path
					d={M_PATH}
					animate={playing ? { scale: [1, 1.09] } : undefined}
					transition={glyphLoop(6)}
				/>
			</g>
			<g transform={S_TRANSFORM}>
				<motion.path
					d={S_PATH}
					animate={playing ? { rotate: [-7, 7] } : undefined}
					transition={glyphLoop(7.5)}
				/>
			</g>
		</g>
	</g>
</svg>