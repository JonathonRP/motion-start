<script lang="ts">
	import { motion, LayoutGroup } from "motion-start";

	const tabs = ["spring", "tween", "inertia"];
	let selected = $state(tabs[0]);
</script>

<LayoutGroup>
	<div class="flex gap-1 rounded-xl border border-border bg-background-alt p-1">
		{#each tabs as tab (tab)}
			<button
				type="button"
				class="relative cursor-pointer rounded-lg px-4 py-2 font-mono text-sm"
				onclick={() => (selected = tab)}
			>
				{#if selected === tab}
					<motion.span
						layoutId="tab-pill"
						class="absolute inset-0 rounded-lg bg-brand"
						transition={{ type: "spring", stiffness: 400, damping: 32 }}
					></motion.span>
				{/if}
				<span
					class="relative z-10"
					class:text-white={selected === tab}
					class:text-foreground-alt={selected !== tab}>{tab}</span
				>
			</button>
		{/each}
	</div>
</LayoutGroup>
