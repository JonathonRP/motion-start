<script lang="ts">
	import MsLogo from "$lib/components/ms-logo.svelte";
	import DocsSidebarRail from "$lib/components/docs-sidebar-rail.svelte";
	import DocsFooter from "$lib/components/docs-footer.svelte";
	import { DocsLayout } from "@svecodocs/kit";
	import { navDirection, navigation } from "$lib/navigation";
	import { motion, AnimatePresence } from "motion-start";
	import { beforeNavigate } from "$app/navigation";
	import { MediaQuery } from "svelte/reactivity";
	import { page } from "$app/state";

	let { children } = $props();

	/*
	 * The page transition slides along the sidebar's own axis: go down the list
	 * and the next page comes in from the right, go up and it comes in from the
	 * left. `beforeNavigate` is what makes that work - it fires while `page`
	 * still holds the old URL, so the direction is already settled by the time
	 * the keyed block re-creates and reads `initial`. Deriving it from `page`
	 * instead would be a frame late and every transition would run forwards.
	 */
	let direction = $state<1 | -1>(1);

	beforeNavigate(({ from, to }) => {
		if (!to) return;
		direction = navDirection(from?.url.pathname, to.url.pathname);
	});

	const reducedMotion = new MediaQuery("prefers-reduced-motion: reduce");
	const travel = $derived(reducedMotion.current ? 0 : 28 * direction);
</script>

<DocsLayout {navigation}>
	{#snippet logo()}
		<!-- The kit already wraps this snippet in an <a href="/docs">, so this
		     must not contain another anchor. -->
		<MsLogo />
		<span class="sr-only">Motion Start</span>
		<span class="ml-auto font-mono text-[10px] leading-tight text-foreground-alt/70">
			<span class="block">alpha</span>
			<span class="block">v0.2</span>
		</span>
	{/snippet}

	<DocsSidebarRail />
	<DocsFooter />

	<!--
		`popLayout`, not `wait`. Under `wait` there was a ~200ms window on every
		navigation where the outgoing page had collapsed to zero height and the
		incoming one had not been released into flow yet, so #content was empty
		and the footer flew up the viewport before the page arrived.

		`popLayout` takes the outgoing page out of flow at its measured position
		and lays the incoming one out immediately, so the row is never empty and
		the footer never moves. The two pages cross instead of queueing, which is
		also what a directional slide wants.
	-->
	<AnimatePresence mode="popLayout" initial={false}>
		{#key page.url.pathname}
			<!-- DocPage emits the TOC <aside> and the article as siblings that the
			     kit expects to be direct flex children of #content. This wrapper
			     has to reproduce that row, or the two stack and the column's width
			     shrink-wraps its content — which, in a row-reverse flex, shifts the
			     left edge on every navigation. -->
			<motion.div
				class="flex w-full flex-row-reverse xl:gap-4"
				initial={{ opacity: 0, x: travel }}
				animate={{ opacity: 1, x: 0 }}
				exit={{ opacity: 0, x: -travel }}
				transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
			>
				{@render children?.()}
			</motion.div>
		{/key}
	</AnimatePresence>
</DocsLayout>
