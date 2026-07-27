<script lang="ts">
	import { motion, useTime, useTransform } from "motion-start";
	import { siteConfig } from "$lib/site-config";

	/**
	 * Landing hero.
	 *
	 * Layout follows the reference design — logo and wordmark side by side, a
	 * small bold tagline, and a lavender CTA pill — combined with the richer
	 * atmosphere of the earlier pass: a soft radial glow behind the lockup, a
	 * bloom on the logo, and a quiet set of footer links.
	 */

	const time = useTime();
	const drift = useTransform(time, (t: number) => Math.sin(t / 1600) * 7);

	const container = {
		hidden: { opacity: 0 },
		visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
	};

	const rise = {
		hidden: { opacity: 0, y: 20, filter: "blur(6px)" },
		visible: {
			opacity: 1,
			y: 0,
			filter: "blur(0px)",
			transition: { type: "spring", stiffness: 240, damping: 28 },
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
		<!-- Logo and wordmark share a row, as in the design. -->
		<motion.div variants={rise} class="flex items-center gap-3.5" style={{ y: drift }}>
			<motion.img
				src="/logo.webp"
				alt=""
				width="60"
				height="60"
				class="size-15 rounded-2xl shadow-[0_0_60px_-12px_var(--ms-glow)]"
				whileHover={{ scale: 1.06, rotate: -4 }}
				transition={{ type: "spring", stiffness: 320, damping: 18 }}
			/>
			<span class="text-left font-mono text-2xl leading-[1.1] font-normal tracking-tight">
				<span class="block">motion</span>
				<span class="block">start</span>
			</span>
		</motion.div>

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
			<a class="text-foreground-alt transition-colors hover:text-foreground" href={siteConfig.links.github}>
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
			color-mix(in oklab, var(--ms-glow) 40%, transparent),
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
