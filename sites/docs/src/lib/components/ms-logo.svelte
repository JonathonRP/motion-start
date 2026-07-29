<script lang="ts">
	import { motion } from "motion-start";
	import { cn } from "@svecodocs/kit";
	import MsMark from "./ms-mark.svelte";

	let { class: className = "", wordmark = true } = $props();
</script>

<span class={cn("flex items-center gap-2.5", className)}>
	<motion.span
		class="block shrink-0 rounded-[10px] shadow-[0_0_24px_-6px_var(--ms-glow)]"
		whileHover={{ scale: 1.08, rotate: -3 }}
		whileTap={{ scale: 0.94 }}
		transition={{ type: "spring", stiffness: 400, damping: 18 }}
	>
		<!-- A third of the hero's amplitude. HOP is authored against the 88px mark,
		     where a 16px apex is proportionate; at 28px that is taller than the
		     logo itself and would shove the header around. -->
		<MsMark size={28} bounce={0.34} class="block size-7" />
	</motion.span>
	{#if wordmark}
		<span class="font-mono text-[13px] leading-[1.05] font-medium tracking-tight">
			<span class="block">motion</span>
			<span class="block">start</span>
		</span>
	{/if}
</span>
