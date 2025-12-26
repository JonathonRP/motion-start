<!-- LayoutGroup component for grouping layout animations
Based on Motion v11.11.11 -->

<script lang="ts">
import { getContext, setContext } from 'svelte';
import { setDomContext } from '../../context/DOMcontext.js';
import { LAYOUT_GROUP_CONTEXT_KEY, LayoutGroupContext } from '../../context/LayoutGroupContext.js';
import type { LayoutGroupProps } from './types.js';

type $$Props = LayoutGroupProps;

let { id = undefined, inheritId = true, children, isCustom = false }: $$Props = $props();

// Get parent layout group ID if inheriting
const parentLayoutGroupId = inheritId
	? getContext<string | null>(LAYOUT_GROUP_CONTEXT_KEY) || LayoutGroupContext.get()
	: null;

// Generate unique layout group ID
const layoutGroupId = $state(
	id || (inheritId && parentLayoutGroupId)
		? `${parentLayoutGroupId || ''}-${id || Math.random().toString(36).slice(2, 9)}`
		: id || Math.random().toString(36).slice(2, 9)
);

// Provide layout group ID to children
setContext(LAYOUT_GROUP_CONTEXT_KEY, layoutGroupId);
setDomContext('LayoutGroup', isCustom, layoutGroupId);
</script>

{@render children?.()}
