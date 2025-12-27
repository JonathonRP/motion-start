<!-- based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V. -->

<script lang="ts">
import { UseHTMLProps } from '../html/use-props.js';
import { UseSVGProps } from '../svg/use-props.js';
import { filterProps } from './utils/filter-props.js';

let {
	props,
	visualState,
	Component,
	forwardMotionProps = false,
	isStatic,
	ref,
	targetEl = undefined,
}: {
	props: any;
	visualState: any;
	Component: any;
	forwardMotionProps?: boolean;
	isStatic: any;
	ref: any;
	targetEl?: any;
} = $props();

const motion = (node: any) => {
	ref(node);
};

let filteredProps = $derived(filterProps(props, typeof Component === 'string', forwardMotionProps));

$effect(() => {
	if (targetEl) {
		motion(targetEl);
	}
});
</script>

{#if typeof Component === 'string'}
  <!-- Direct element rendering for string components (more performant) -->
  {#if Component === 'SVG'}
    <UseSVGProps {visualState} {isStatic} {props}>
      {#snippet children(visualProps: any)}
        <slot {motion} props={{ ...filteredProps, ...visualProps }} />
      {/snippet}
    </UseSVGProps>
  {:else}
    <UseHTMLProps {visualState} {isStatic} {props}>
      {#snippet children(visualProps: any)}
        <slot {motion} props={{ ...filteredProps, ...visualProps }} />
      {/snippet}
    </UseHTMLProps>
  {/if}
{:else}
  <!-- Component-based rendering for Svelte components -->
  <svelte:component
    this={Component}
    {visualState}
    {isStatic}
    {props}
  >
    {#snippet children(visualProps: any)}
      <slot {motion} props={{ ...filteredProps, ...visualProps }} />
    {/snippet}
  </svelte:component>
{/if}
