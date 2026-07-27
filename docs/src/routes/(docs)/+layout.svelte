<script lang="ts">
	import MsLogo from "$lib/components/ms-logo.svelte";
	import { DocsLayout } from "@svecodocs/kit";
	import { navigation } from "$lib/navigation";
	import { motion, AnimatePresence } from "motion-start";
	import { page } from "$app/state";

	let { children } = $props();
</script>

<DocsLayout {navigation}>
	{#snippet logo()}
		<a href="/" class="flex items-center">
			<MsLogo />
			<span class="sr-only">Motion Start</span>
		</a>
		<span class="ml-auto font-mono text-[10px] leading-tight text-foreground-alt/70">
			<span class="block">alpha</span>
			<span class="block">v0.2</span>
		</span>
	{/snippet}

	<AnimatePresence mode="wait">
		{#key page.url.pathname}
			<motion.div
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
