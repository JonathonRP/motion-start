<script lang="ts">
	import { motion } from "motion-start";
	import { MediaQuery } from "svelte/reactivity";
	import {
		BASE,
		BLOBS,
		BOUNCE,
		GLYPH_FILL,
		GLYPH_STROKE,
		GRAVITY,
		IMPACT,
		M_PATH,
		M_TRANSFORM,
		PHASES,
		S_PATH,
		S_TRANSFORM,
		TILE_RADIUS,
	} from "$lib/ms-mark-art.js";

	/**
	 * The motion-start mark, drawn as vectors rather than a raster logo, and
	 * animated with the library itself.
	 *
	 * The tile is a mesh gradient: two `motion.radialGradient` blobs over a
	 * `motion.linearGradient` base, with a third gradient used as impact light.
	 * All of it hangs off the single bounce defined in `$lib/ms-mark-art.js`,
	 * which the landing hero also uses to hop the tile - so the insides always
	 * react on the exact frame the tile hits the floor.
	 *
	 * Geometry and palette live in `$lib/ms-mark-art.js` too, shared with the
	 * icon generator so the favicons cannot drift from the animated mark.
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
	 * Every part of the mark is a consequence of the bounce defined in
	 * `ms-mark-art.js`. Timing constants come from there so the tile's hop (on
	 * the landing hero) and the tile's insides cannot drift apart.
	 *
	 * The story, in order: it falls, it lands, the mesh sloshes sideways from
	 * the impact, light splashes out across the face, and the letters get
	 * jolted a frame or two later.
	 */
	const cycle = (delay = 0) =>
		({
			duration: BOUNCE,
			times: PHASES,
			ease: GRAVITY,
			delay,
			repeat: Number.POSITIVE_INFINITY,
			repeatType: "loop",
		}) as const;

	/*
	 * The mesh sloshes. It sits still through the fall, lurches past `to` at
	 * the moment of contact, then wobbles back - liquid in a dropped glass.
	 *
	 * The travel is positional, not scalar. An earlier pass grew the yellow
	 * radius 20% and it swallowed the magenta entirely at the far end, so the
	 * tile stopped reading as a three-colour mesh and became a brightness
	 * pulse. Radii barely move; the centres do the work.
	 */
	const slosh = (from: number, to: number) => {
		const d = to - from;
		return [from, from + d * 0.15, from + d * 0.5, to + d * 0.45, to, from + d * 0.3, from];
	};

	const blobKeyframes = (blob: (typeof BLOBS)[number]) => ({
		cx: slosh(blob.from.cx, blob.to.cx),
		cy: slosh(blob.from.cy, blob.to.cy),
		r: slosh(blob.from.r, blob.to.r),
	});

	// Colours ride the same clock but on a plain ease: a springy or snapped
	// colour pushes channels out of gamut and just reads as a flicker.
	const colorLoop = {
		duration: BOUNCE,
		repeat: Number.POSITIVE_INFINITY,
		repeatType: "mirror",
		ease: "easeInOut",
	} as const;

	/*
	 * Impact light. A hard-edged highlight rips across the face at the moment
	 * of contact and is invisible the rest of the time.
	 *
	 * This is the piece that makes the whole thing land. Two soft blobs are
	 * inherently gentle however far they travel, so without it the lockup had
	 * nothing visible to react to and the tile just swelled.
	 *
	 * It gets its own `times` because a flash needs a much sharper envelope
	 * than a fall, but it shares BOUNCE, so it stays pinned to the impact.
	 */
	const streakTimes = [0, IMPACT - 0.12, IMPACT, IMPACT + 0.16, 1];
	const streakLoop = {
		duration: BOUNCE,
		times: streakTimes,
		ease: ["easeIn", "easeOut", "easeIn", "linear"],
		repeat: Number.POSITIVE_INFINITY,
		repeatType: "loop",
	} as const;

	const streak = {
		x1: [-24, -24, 20, 70, 70],
		x2: [-8, -8, 36, 86, 86],
		opacity: [0, 0, 1, 0, 0],
	};

	/*
	 * The lockup, reacting to the landing.
	 *
	 * Amplitude has to be big or it may as well not exist: at 88px a 4 degree
	 * rotation moves the s by roughly one pixel. So instead of easing the
	 * letters continuously, they ride the fall almost still, compress into the
	 * squash, then over-pop out of it and wobble down - the M as a scale, the
	 * s as a floppy whip, both with a little vertical bob of their own so they
	 * look loose inside the tile rather than painted onto it.
	 *
	 * The s is held back another 90ms so the pair lands as two beats, not one
	 * thud, and its rotation runs opposite to its own resting slant so the
	 * whip is visible against the M.
	 */
	const mBeat = {
		scale: [1, 1.03, 1, 0.9, 1.2, 1.03, 1],
		y: [0, -0.6, 0.4, 2, -2.4, 0.4, 0],
	};

	const sBeat = {
		rotate: [0, -4, -7, 11, -21, 7, 0],
		scale: [1, 1.02, 1, 0.92, 1.15, 1.02, 1],
		y: [0, -0.8, 0.6, 2.6, -2.8, 0.6, 0],
	};
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
			x1="-24"
			y1="64"
			x2="-8"
			y2="0"
			animate={playing ? { x1: streak.x1, x2: streak.x2 } : undefined}
			transition={streakLoop}
		>
			<!-- A narrow, bright glint rather than a wide wash. At 26 units and
			     0.62 it flooded the whole tile and the letters vanished into it
			     on the two frames that matter most. -->
			<stop offset="0" stop-color={GLYPH_FILL} stop-opacity="0" />
			<stop offset="0.5" stop-color={GLYPH_FILL} stop-opacity="0.5" />
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