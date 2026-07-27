<script lang="ts">
	import MsLogo from "$lib/components/ms-logo.svelte";
	import DocsSidebarRail from "$lib/components/docs-sidebar-rail.svelte";
	import DocsFooter from "$lib/components/docs-footer.svelte";
	import { DocsLayout } from "@svecodocs/kit";
	import { navigation } from "$lib/navigation";
	import { motion, AnimatePresence } from "motion-start";
	import { page } from "$app/state";

	let { children } = $props();
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

	<AnimatePresence mode="wait">
		{#key page.url.pathname}
			<!-- DocPage emits the TOC <aside> and the article as siblings that the
			     kit expects to be direct flex children of #content. This wrapper
			     has to reproduce that row, or the two stack and the column's width
			     shrink-wraps its content — which, in a row-reverse flex, shifts the
			     left edge on every navigation. -->
			<motion.div
				class="flex w-full flex-row-reverse xl:gap-4"
				initial={{ opacity: 0, y: 12 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: -8 }}
				transition={{ duration: 0.25, ease: "easeOut" }}
			>
				{@render children?.()}
			</motion.div>
		{/key}
	</AnimatePresence>
</DocsLayout>
