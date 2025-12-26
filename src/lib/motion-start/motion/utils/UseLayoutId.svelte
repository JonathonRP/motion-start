<!-- based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V. -->

<script lang="ts">
import type { Snippet } from 'svelte';
import { getContext } from 'svelte';
import { LAYOUT_GROUP_CONTEXT_KEY, LayoutGroupContext } from '../../context/LayoutGroupContext.js';

let {
	props,
	isCustom,
	children,
}: {
	props: any;
	isCustom: any;
	children?: Snippet<[{ layoutId?: string }]>;
} = $props();

let { layoutId } = $derived(props);

const layoutGroupId = getContext<string | null>(LAYOUT_GROUP_CONTEXT_KEY) || LayoutGroupContext.get();

const computedLayoutId = $derived(layoutGroupId && layoutId !== undefined ? layoutGroupId + '-' + layoutId : layoutId);
</script>

{@render children?.({ layoutId: computedLayoutId })}
