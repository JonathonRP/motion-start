<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	interface Props {
		onmount: () => void;
		ondestroy: () => void;
		value: number;
	}

	let { onmount, ondestroy }: Props = $props();

	onMount(() => onmount());
	onDestroy(() => ondestroy());
</script>
