<script lang="ts">
	import { motion, useTime, useTransform } from "motion-start";
	import { siteConfig } from "$lib/site-config";

	/**
	 * Landing hero, matching the reference design: logo and wordmark sit
	 * side by side, a small bold two-line tagline sits beneath, and a lavender
	 * pill leads into the docs. Everything is centred on a near-black field.
	 */

	const time = useTime();
	const drift = useTransform(time, (t: number) => Math.sin(t / 1600) * 6);

	const container = {
		hidden: { opacity: 0 },
		visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
	};

	const rise = {
		hidden: { opacity: 0, y: 16, filter: "blur(6px)" },
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

<main class="grid min-h-svh place-items-center bg-background px-6">
	<motion.div
		class="flex flex-col items-center text-center"
		variants={container}
		initial="hidden"
		animate="visible"
	>
		<!-- Logo and wordmark share a row, as in the design. -->
		<motion.div variants={rise} class="flex items-center gap-3.5" style={{ y: drift }}>
			<motion.img
				src="/logo.webp"
				alt=""
				width="56"
				height="56"
				class="size-14 rounded-2xl"
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
	</motion.div>
</main>

<style>
	/* Soft lavender/pink pill with dark text, as in the design. */
	:global(.ms-cta) {
		background: linear-gradient(100deg, oklch(78% 0.13 340), oklch(76% 0.12 300));
		color: oklch(22% 0.02 300);
	}
</style>
