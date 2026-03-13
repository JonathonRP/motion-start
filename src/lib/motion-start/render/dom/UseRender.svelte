<!-- based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V. -->
<svelte:options runes />

<script lang="ts">
	import type { RenderComponent } from "../../motion/features/types";
	import type { HTMLRenderState } from "../html/types";
	import type { SVGRenderState } from "../svg/types";
	import { filterProps } from "./utils/filter-props";
	import { isSVGComponent } from "./utils/is-svg-component";
	import { useSvgProps } from "../svg/use-props.svelte";
	import { useHTMLProps } from "../html/use-props.svelte";
	import type { Attachment } from "svelte/attachments";
	import { untrack } from "svelte";

	type Props = Parameters<
		RenderComponent<
			HTMLElement | SVGElement,
			HTMLRenderState | SVGRenderState
		>
	>[1] & {
		forwardMotionProps: boolean;
	};

	let {
		Component,
		props,
		ref,
		visualState,
		isStatic,
		forwardMotionProps,
	}: Props = $props();

	const useVisualProps = $derived(
		isSVGComponent(Component) ? useSvgProps : useHTMLProps,
	);

	const visualProps = $derived.by(() =>
		useVisualProps(
			() => props as any,
			() => visualState.latestValues,
			isStatic,
			Component,
		)(),
	);

	const filteredProps = $derived(
		filterProps(
			() => props,
			typeof Component === "string",
			forwardMotionProps,
		),
	);

	// Stable element props without the attachment - attachment is applied separately via {@attach}
	const elementProps = $derived({
		...filteredProps,
		...visualProps,
	});

	// Use untrack to prevent the visualElement.current $state write (inside
	// visualElement.mount) from triggering a reactive cascade. Without untrack,
	// drag feature's addListeners() can be called before projection is ready.
	const motionRef: Attachment<HTMLElement | SVGElement> = (node) => {
		return untrack(() => {
			if (typeof ref === "function") {
				ref(node);
			} else if (ref) {
				(ref as any).current = node;
			}
			return () => {
				if (typeof ref === "function") {
					ref(null);
				} else if (ref) {
					(ref as any).current = null;
				}
			};
		});
	};
</script>

{#if typeof Component === "string"}
	<svelte:element
		this={Component}
		{...elementProps}
		{@attach motionRef}
		xmlns={isSVGComponent(Component)
			? "http://www.w3.org/2000/svg"
			: undefined}
	>
		{@render props.children?.()}
	</svelte:element>
{:else}
	<Component {...elementProps} {@attach motionRef}>
		{@render props.children?.()}
	</Component>
{/if}
