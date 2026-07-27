<script lang="ts">
	import { motion } from "motion-start";
	import { Button } from "@svecodocs/kit";

	let toggled = $state(false);

	const transitions = [
		{ label: "spring", value: { type: "spring", stiffness: 300, damping: 20 } },
		{ label: "tween", value: { type: "tween", duration: 0.6, ease: "easeInOut" } },
		{ label: "bouncy spring", value: { type: "spring", stiffness: 500, damping: 10 } },
	] as const;
</script>

<div class="flex flex-col gap-4">
	<Button variant="brand" size="sm" onclick={() => (toggled = !toggled)}>Animate</Button>

	{#each transitions as t (t.label)}
		<div class="flex items-center gap-4">
			<span class="w-28 shrink-0 font-mono text-xs text-foreground-alt">{t.label}</span>
			<div class="relative h-12 w-full max-w-xs rounded-xl border border-border bg-background-alt">
				<motion.div
					class="absolute top-1 left-1 size-10 rounded-lg bg-brand"
					animate={{ x: toggled ? 208 : 0 }}
					transition={t.value}
				></motion.div>
			</div>
		</div>
	{/each}
</div>
