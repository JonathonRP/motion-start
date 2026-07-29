<script lang="ts">
	import { motion, useTime, useTransform } from "motion-start";
	import MsMark from "$lib/components/ms-mark.svelte";
	import { githubUrl, siteConfig } from "$lib/site-config";

	/**
	 * Landing hero.
	 *
	 * The logo lockup and its motion are the original pre-mockup treatment:
	 * an 88px mark drifting above a large monospace wordmark, over a soft
	 * radial glow. The tagline and CTA pill keep the reference design's
	 * styling.
	 */

	const time = useTime();
	// Original drift: wide travel, quick cycle.
	const drift = useTransform(time, (t: number) => Math.sin(t / 1400) * 10);

	const container = {
		hidden: { opacity: 0 },
		visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
	};

	const rise = {
		hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
		visible: {
			opacity: 1,
			y: 0,
			filter: "blur(0px)",
			transition: { type: "spring", stiffness: 220, damping: 26 },
		},
	};
</script>

<svelte:head>
	<title>{siteConfig.name} — declarative motion for Svelte</title>
	<meta name="description" content={siteConfig.description} />
</svelte:head>

<main class="relative grid min-h-svh place-items-center overflow-hidden bg-background px-6">
	<div class="landing-glow" aria-hidden="true"></div>

	<motion.div
		class="relative flex flex-col items-center text-center"
		variants={container}
		initial="hidden"
		animate="visible"
	>
		<!-- Logo sits above the wordmark, drifting on its own, as it did before
		     the mockup-driven rewrite. -->
		<motion.div variants={rise} style={{ y: drift }} class="mb-7">
			<motion.div
				class="rounded-3xl shadow-[0_0_70px_-10px_var(--ms-glow)]"
				whileHover={{ scale: 1.06, rotate: -4 }}
				transition={{ type: "spring", stiffness: 320, damping: 18 }}
			>
				<MsMark size={88} title="Motion Start" class="size-22" />
			</motion.div>
		</motion.div>

		<motion.h1
			variants={rise}
			class="font-display text-4xl leading-[1.05] font-medium tracking-tight sm:text-5xl"
		>
			motion start
		</motion.h1>

		<motion.p variants={rise} class="mt-7 max-w-[19rem] text-[13px] leading-snug font-bold">
			A production-ready declarative motion library for Svelte.
		</motion.p>

		<motion.a
			variants={rise}
			href="/docs"
			class="ms-cta mt-8 inline-flex items-center rounded-full px-5 py-2 font-mono text-[13px]"
			whileHover={{ scale: 1.05 }}
			whileTap={{ scale: 0.96 }}
			transition={{ type: "spring", stiffness: 420, damping: 20 }}
		>
			Get Started
		</motion.a>

		<motion.div variants={rise} class="mt-14 flex items-center gap-5 font-mono text-xs">
			<a class="text-foreground-alt transition-colors hover:text-foreground" href="/docs/getting-started">
				Install
			</a>
			<span class="text-border">/</span>
			<a class="text-foreground-alt transition-colors hover:text-foreground" href={githubUrl}>
				GitHub
			</a>
			<span class="text-border">/</span>
			<span class="text-foreground-alt">alpha</span>
		</motion.div>
	</motion.div>
</main>

<style>
	.landing-glow {
		position: absolute;
		inset: -20% 0 auto 50%;
		width: min(900px, 120vw);
		height: 700px;
		translate: -50% 0;
		background: radial-gradient(
			circle at 50% 45%,
			color-mix(in oklab, var(--ms-glow) 45%, transparent),
			transparent 65%
		);
		filter: blur(20px);
		pointer-events: none;
	}

	/* Soft lavender/pink pill with dark text, as in the design. */
	:global(.ms-cta) {
		background: linear-gradient(100deg, oklch(78% 0.13 340), oklch(76% 0.12 300));
		color: oklch(22% 0.02 300);
	}
</style>
