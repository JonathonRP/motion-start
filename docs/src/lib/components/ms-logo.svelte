<script lang="ts">
	import { motion } from "motion-start";
	import { cn } from "@svecodocs/kit";

	let { class: className = "", wordmark = true } = $props();
</script>

<span class={cn("flex items-center gap-2.5", className)}>
	<motion.span
		class="block shrink-0 rounded-[10px] shadow-[0_0_24px_-6px_var(--ms-glow)]"
		whileHover={{ scale: 1.08, rotate: -3 }}
		whileTap={{ scale: 0.94 }}
		transition={{ type: "spring", stiffness: 400, damping: 18 }}
	>
		<img src="/logo.webp" alt="" width="28" height="28" class="block size-7 rounded-[10px]" />
	</motion.span>
	{#if wordmark}
		<span class="font-mono text-[13px] leading-[1.05] font-medium tracking-tight">
			<span class="block">motion</span>
			<span class="block">start</span>
		</span>
	{/if}
</span>
