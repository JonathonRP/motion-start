<svelte:options runes />

<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import { cn } from "$lib/utils.js";

	type Props = HTMLAttributes<HTMLDivElement>;

	const { class: className, children, ...restProps }: Props = $props();

	// let className: $$Props["class"] = undefined;
	// export { className as class };
</script>

<div class={cn("p-6", className)} {...restProps}>
	<svelte:boundary onerror={console.log}>
		{@render children?.()}
		{#snippet failed()}
			<p>whoops!</p>
			<p>check console for error</p>
		{/snippet}
	</svelte:boundary>
</div>
