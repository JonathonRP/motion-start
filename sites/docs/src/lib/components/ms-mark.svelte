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

	/*
	 * Everything below runs on ONE clock.
	 *
	 * The first pass gave the blobs, the colours and the lockup three unrelated
	 * durations. Each part was moving, but nothing ever lined up, so the tile
	 * read as slow mush with an unrelated twitch in it. Motion is fun when it
	 * looks caused: here the light gathers, snaps across the tile, and the
	 * letters get knocked by it a beat later.
	 *
	 * Sharing one duration and one `times` vocabulary is what buys that. Phases
	 * are fractions of CYCLE, so retiming the whole thing is a single number.
	 */
	const CYCLE = 5.6;

	/** gather (light pulls in) - snap - rebound - settle - rest */
	const PHASES = [0, 0.4, 0.52, 0.63, 0.78, 1];

	// Slow in, hard out of the snap, then a soft recovery. Per-segment easing is
	// what makes the snap feel like an impact instead of another swell.
	const HIT_EASE = ["easeInOut", "easeIn", "circOut", "easeOut", "easeInOut"] as const;

	/** One turn of the shared clock, optionally held back by `delay`. */
	const cycle = (delay = 0) =>
		({
			duration: CYCLE,
			times: PHASES,
			ease: HIT_EASE,
			delay,
			repeat: Number.POSITIVE_INFINITY,
			repeatType: "loop",
		}) as const;

	/*
	 * The blobs travel positionally and hold their radii near-fixed. Growing a
	 * blob 20% made the yellow swallow the magenta entirely at one end and the
	 * tile stopped reading as a three-colour mesh. They overshoot `to` on the
	 * snap, which is what sells the sweep as an impact rather than a slide.
	 */
	const overshoot = (from: number, to: number, by = 0.4) => to + (to - from) * by;

	const blobKeyframes = (blob: (typeof BLOBS)[number]) => ({
		cx: [
			blob.from.cx,
			blob.to.cx,
			overshoot(blob.from.cx, blob.to.cx),
			blob.to.cx,
			(blob.from.cx + blob.to.cx) / 2,
			blob.from.cx,
		],
		cy: [
			blob.from.cy,
			blob.to.cy,
			overshoot(blob.from.cy, blob.to.cy),
			blob.to.cy,
			(blob.from.cy + blob.to.cy) / 2,
			blob.from.cy,
		],
		r: [
			blob.from.r,
			blob.to.r,
			overshoot(blob.from.r, blob.to.r, 0.15),
			blob.to.r,
			(blob.from.r + blob.to.r) / 2,
			blob.from.r,
		],
	});

	// Colours ride the same clock but on a plain ease: a springy or snapped
	// colour pushes channels out of gamut and just reads as a flicker.
	const colorLoop = {
		duration: CYCLE,
		repeat: Number.POSITIVE_INFINITY,
		repeatType: "mirror",
		ease: "easeInOut",
	} as const;

	/*
	 * The thing that makes the beat land: a specular streak that crosses the
	 * tile and is invisible the rest of the time.
	 *
	 * A mesh of two soft blobs is inherently gentle - even a third of a tile of
	 * travel only reads as a slow swell, which is why the earlier passes felt
	 * like nothing was happening. A hard-edged highlight is the opposite, and
	 * it gives the lockup something to visibly react to.
	 *
	 * It has its own `times` because the flash needs a sharper envelope than the
	 * rest, but it shares CYCLE, so it stays phase-locked. It peaks at 0.42 and
	 * the M pops at 0.52 - light first, letters second.
	 */
	const streakTimes = [0, 0.3, 0.42, 0.54, 1];
	const streakLoop = {
		duration: CYCLE,
		times: streakTimes,
		ease: ["easeIn", "easeOut", "easeIn", "linear"],
		repeat: Number.POSITIVE_INFINITY,
		repeatType: "loop",
	} as const;

	const streak = {
		x1: [-32, -32, 14, 68, 68],
		x2: [-6, -6, 40, 94, 94],
		opacity: [0, 0, 1, 0, 0],
	};

	/*
	 * The lockup. Continuous easing at an amplitude small enough to keep a logo
	 * looking like a logo is invisible at the 88px this renders at - a 4 degree
	 * rotation moves the s by about one pixel. So the letters sit still through
	 * the gather, then take the hit: the M squashes in anticipation and pops,
	 * the s coils the other way and whips through.
	 *
	 * The s is held back 90ms so the pair lands as two beats, not one thud.
	 */
	const mBeat = { scale: [1, 0.93, 1.2, 0.97, 1.03, 1] };
	const sBeat = { rotate: [0, 7, -24, 10, -4, 0], scale: [1, 0.96, 1.12, 0.99, 1.02, 1] };
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

		{#each BLOBS as blob (blob.id)}
			<motion.radialGradient
				id={id(blob.id)}
				gradientUnits="userSpaceOnUse"
				cx={blob.from.cx}
				cy={blob.from.cy}
				r={blob.from.r}
				animate={playing ? blobKeyframes(blob) : undefined}
				transition={cycle(blob.lead)}
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

		<motion.linearGradient
			id={id("streak")}
			gradientUnits="userSpaceOnUse"
			x1="-32"
			y1="64"
			x2="-6"
			y2="0"
			animate={playing ? { x1: streak.x1, x2: streak.x2 } : undefined}
			transition={streakLoop}
		>
			<stop offset="0" stop-color={GLYPH_FILL} stop-opacity="0" />
			<stop offset="0.5" stop-color={GLYPH_FILL} stop-opacity="0.62" />
			<stop offset="1" stop-color={GLYPH_FILL} stop-opacity="0" />
		</motion.linearGradient>

		<clipPath id={id("clip")}>
			<rect x="0" y="0" width="64" height="64" rx={TILE_RADIUS} />
		</clipPath>
	</defs>

	<g clip-path="url(#{id('clip')})">
		<rect x="0" y="0" width="64" height="64" fill="url(#{id('base')})" />
		{#each BLOBS as blob (blob.id)}
			<rect x="0" y="0" width="64" height="64" fill="url(#{id(blob.id)})" />
		{/each}

		<!-- Sits above the mesh but behind the lockup, so the letters stay legible
		     through the flash. Hidden entirely for a still mark. -->
		{#if playing}
			<motion.rect
				x="0"
				y="0"
				width="64"
				height="64"
				fill="url(#{id('streak')})"
				opacity="0"
				animate={{ opacity: streak.opacity }}
				transition={streakLoop}
			/>
		{/if}

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
				<motion.path d={M_PATH} animate={playing ? mBeat : undefined} transition={cycle(0.06)} />
			</g>
			<g transform={S_TRANSFORM}>
				<motion.path d={S_PATH} animate={playing ? sBeat : undefined} transition={cycle(0.15)} />
			</g>
		</g>
	</g>
</svg>