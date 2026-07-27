<script lang="ts">
	import { motion } from "motion-start";
	import { Button } from "@svecodocs/kit";

	let expanded = $state(false);
</script>

<div class="flex flex-col items-start gap-4">
	<Button variant="brand" size="sm" onclick={() => (expanded = !expanded)}>
		{expanded ? "Collapse" : "Expand"}
	</Button>

	<motion.div
		layout
		class="flex items-center gap-3 rounded-2xl border border-border bg-background-alt p-3"
		style={{ width: expanded ? "100%" : "128px" }}
		transition={{ type: "spring", stiffness: 260, damping: 28 }}
	>
		<motion.div layout class="size-12 shrink-0 rounded-xl bg-brand"></motion.div>
		{#if expanded}
			<motion.p
				class="text-sm text-foreground-alt"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
			>
				The box and its contents are laid out by CSS — motion-start only animates the
				difference between the two layouts.
			</motion.p>
		{/if}
	</motion.div>
</div>
