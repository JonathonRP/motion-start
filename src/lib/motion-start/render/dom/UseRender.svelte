<!-- based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V. -->
<svelte:options runes />

<script lang="ts">
import type { RenderComponent } from '../../motion/features/types';
import type { HTMLRenderState } from '../html/types';
import type { SVGRenderState } from '../svg/types';
import { filterProps } from './utils/filter-props';
import { isSVGComponent } from './utils/is-svg-component';
import { useSvgProps } from '../svg/use-props.svelte';
import { useHTMLProps } from '../html/use-props.svelte';
import { createAttachmentKey, type Attachment } from 'svelte/attachments';
import { untrack } from 'svelte';
import { isMotionValue } from '../../value/utils/is-motion-value';
import { useMotionOutroContext } from '../../context/OutroContext.svelte';
import { flushPendingMotionExitLayout, motionEnterIntro, motionExitOutro } from './motion-outro';

type Props = Parameters<RenderComponent<HTMLElement | SVGElement, HTMLRenderState | SVGRenderState>>[1] & {
	forwardMotionProps: boolean;
};

let { Component, props, ref, visualState, isStatic, forwardMotionProps, visualElement = undefined }: Props = $props();

const motionOutroContext = useMotionOutroContext();


const useVisualProps = $derived(isSVGComponent(Component) ? useSvgProps : useHTMLProps);

const visualProps = $derived.by(() =>
	useVisualProps(
		() => props as any,
		() => visualState.latestValues,
		isStatic,
		Component
	)()
);

const filteredProps = $derived(filterProps(() => props, typeof Component === 'string', forwardMotionProps));

const styleAttachmentKey = createAttachmentKey();

function isCustomStyleProperty(key: string) {
	return key.startsWith('--') || key.includes('-');
}

const styleAttachment: Attachment<HTMLElement | SVGElement> = (node) => {
	const elementStyle = node.style as CSSStyleDeclaration & Record<string, string | number>;
	let managedKeys = new Set<string>();

	function applyPlainStyles() {
		const style =
			visualProps.style && typeof visualProps.style === 'object' ? (visualProps.style as Record<string, unknown>) : {};
		const entries = Object.entries(style).filter(([, value]) => value != null && !isMotionValue(value));
		const nextKeys = new Set(entries.map(([key]) => key));

		for (const key of managedKeys) {
			if (!nextKeys.has(key)) {
				if (isCustomStyleProperty(key)) {
					elementStyle.removeProperty(key);
				} else {
					elementStyle[key] = '';
				}
			}
		}

		for (const [key, value] of entries) {
			if (isCustomStyleProperty(key)) {
				elementStyle.setProperty(key, String(value));
			} else {
				elementStyle[key] = value as string | number;
			}
		}

		managedKeys = nextKeys;
	}

	applyPlainStyles();

	$effect(() => {
		applyPlainStyles();
	});

	return () => {
		for (const key of managedKeys) {
			if (isCustomStyleProperty(key)) {
				elementStyle.removeProperty(key);
			} else {
				elementStyle[key] = '';
			}
		}
	};
};

// Build spread object: user/visual props + attachments for feature listeners and
// plain style values. We keep Svelte from owning the entire style attribute so
// imperative MotionValue/layout updates on element.style do not get overwritten.
const elementProps = $derived.by(() => {
	const withAttachments = { ...filteredProps, ...visualProps } as Record<string, unknown> &
		Record<symbol, Attachment<HTMLElement | SVGElement> | false | null | undefined>;

	if (withAttachments.style && typeof withAttachments.style === 'object') {
		delete withAttachments.style;
		withAttachments[styleAttachmentKey] = styleAttachment;
	}

	const listeners = visualElement?.listeners ?? {};
	for (const key of Object.getOwnPropertySymbols(listeners)) {
		withAttachments[createAttachmentKey()] = listeners[key];
	}

	return withAttachments;
});

// Use untrack to prevent the visualElement.current $state write (inside
// visualElement.mount) from triggering a reactive cascade. Without untrack,
// drag feature's addListeners() can be called before projection is ready.
const motionRef: Attachment<HTMLElement | SVGElement> = (node) => {
	return untrack(() => {
		if (typeof ref === 'function') {
			ref(node);
		} else if (ref) {
			(ref as any).current = node;
		}

		return () => {
			flushPendingMotionExitLayout(node);
			if (typeof ref === 'function') {
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
		in:motionEnterIntro|global={{ context: motionOutroContext, visualElement }}
		out:motionExitOutro|global={{ context: motionOutroContext, visualElement }}
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
