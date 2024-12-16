<svelte:options runes />

<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import { cn, type WithElementRef } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();
</script>

<div
	bind:this={ref}
	data-slot="card-content"
	class={cn("px-6", className)}
	{...restProps}
>
	<svelte:boundary onerror={console.log}>
		{@render children?.()}
		{#snippet failed()}
			<p>whoops!</p>
			<p>check console for error</p>
		{/snippet}
	</svelte:boundary>
</div>
