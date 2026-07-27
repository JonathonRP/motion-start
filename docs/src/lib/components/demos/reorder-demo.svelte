<script lang="ts">
	import { Reorder } from "motion-start";

	let items = $state(["spring", "tween", "inertia", "keyframes"]);
</script>

<Reorder.Group
	values={items}
	onReorder={(next: string[]) => (items = next)}
	class="flex w-full max-w-sm list-none flex-col gap-2 p-0"
>
	{#snippet children({ item }: { item: string })}
		<Reorder.Item
			value={item}
			class="flex cursor-grab items-center gap-3 rounded-xl border border-border bg-background-alt px-3 py-2.5 font-mono text-sm select-none active:cursor-grabbing"
		>
			<span class="text-foreground-alt">⇅</span>
			{item}
		</Reorder.Item>
	{/snippet}
</Reorder.Group>
