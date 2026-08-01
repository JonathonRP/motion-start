<!-- based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V. -->
<svelte:options runes />

<script lang="ts">
import { watch } from 'runed';
import { untrack } from 'svelte';
import { type Attachment, createAttachmentKey } from 'svelte/attachments';
import { useMotionOutroContext } from '../../context/OutroContext.svelte.js';
import { useMotionConfigContext } from '../../context/MotionConfigContext.svelte.js';
import { usePresenceContext } from '../../context/PresenceContext.svelte.js';
import type { RenderComponent } from '../../motion/features/types.js';
import { isBrowser } from '../../utils/is-browser.js';
import { isMotionValue } from '../../value/utils/is-motion-value.js';
import type { HTMLRenderState } from '../html/types.js';
import { useHTMLProps } from '../html/use-props.svelte.js';
import type { SVGRenderState } from '../svg/types.js';
import { useSvgProps } from '../svg/use-props.svelte.js';
import { createAppearBootstrap } from './appear.js';
import { flushPendingMotionExitLayout, motionEnterIntro, motionExitOutro } from './motion-outro.js';
import { camelToDash } from './utils/camel-to-dash.js';
import { filterProps } from './utils/filter-props.js';
import { isSVGComponent } from './utils/is-svg-component.js';

type Props = Parameters<RenderComponent<HTMLElement | SVGElement, HTMLRenderState | SVGRenderState>>[1] & {
	forwardMotionProps: boolean;
};

let { Component, props, ref, visualState, isStatic, forwardMotionProps, visualElement = undefined }: Props = $props();

const motionOutroContext = useMotionOutroContext();
const motionConfigContext = useMotionConfigContext();
const presenceContext = usePresenceContext();

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

// Resolved once: the emitted <script> has to serialize identically on the server
// and during hydration so Svelte can claim the existing node. Recomputing it
// reactively would swap the parsed script for an inert `innerHTML` copy.
// SVG elements are excluded because their values are attributes, not styles.
const appearBootstrapHtml = untrack(() =>
	typeof Component === 'string' && !isSVGComponent(Component) && !isStatic
		? (createAppearBootstrap(
				props,
				visualState.latestValues,
				motionConfigContext.reducedMotion,
				presenceContext?.initial === false
			) ?? '')
		: ''
);

const styleAttachmentKey = createAttachmentKey();
const listenerAttachmentKeys = Object.create(null) as Record<symbol, symbol>;

function isCustomStyleProperty(key: string) {
	return key.startsWith('--') || key.includes('-');
}

function getServerStyleName(key: string) {
	if (key.startsWith('--')) return key;

	const name = camelToDash(key);
	return /^(webkit|moz|ms|o)-/.test(name) ? `-${name}` : name;
}

function serializeServerStyle(style: Record<string, unknown>) {
	return Object.entries(style)
		.filter(([key, value]) => !/[;:{}\s]/.test(key) && value != null && !isMotionValue(value))
		.map(([key, value]) => {
			const serializedValue = String(value).replaceAll(';', '\\00003b');
			return `${getServerStyleName(key)}: ${serializedValue};`;
		})
		.join(' ');
}

const styleAttachment: Attachment<HTMLElement | SVGElement> = (node) => {
	const elementStyle = node.style as CSSStyleDeclaration & Record<string, string | number>;
	let managedKeys = new Set<string>();
	let initialStyleCommit = true;

	const applyStyleValue = (styleValue: unknown) => {
		// AnimatePresence retains the outgoing Svelte block while Motion writes
		// its exit values imperatively. Freeze reactive prop-style writes for
		// that retained node, matching React's cached exiting element.
		if (visualElement?.presenceContext?.isPresent === false) return;

		const style = styleValue && typeof styleValue === 'object' ? (styleValue as Record<string, unknown>) : {};
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

		if (initialStyleCommit) {
			initialStyleCommit = false;
			const overflow = entries.find(([key]) => key === 'overflow')?.[1];

			if (overflow != null) {
				// Svelte captures overflow before spread attachments run and
				// restores that stale value when the zero-duration intro ends.
				// Restore only this transition-owned property after its microtask;
				// replaying the entire style object can overwrite projection.
				queueMicrotask(() => {
					if (node.isConnected && visualElement?.presenceContext?.isPresent !== false) {
						elementStyle.overflow = String(overflow);
					}
				});
			}
		}

		managedKeys = nextKeys;
	};

	// Attachments run during the DOM commit, so write once synchronously for
	// layout measurement and then track later prop/style updates.
	applyStyleValue(visualProps.style);
	watch(
		() => visualProps.style,
		(style) => applyStyleValue(style)
	);

	// The attachment remains stable for this node's lifetime. Its watcher
	// removes obsolete keys while the node is live, so teardown must leave the
	// final animated frame intact for Svelte's retained outro.
};

// Keep Svelte from owning the style attribute after commit so its reactive
// teardown can't overwrite MotionValue/layout updates on a retained outro node.
const elementProps = $derived.by(() => {
	const withAttachments = { ...filteredProps, ...visualProps } as Record<string, unknown> &
		Record<symbol, Attachment<HTMLElement | SVGElement> | false | null | undefined>;

	if (withAttachments.style && typeof withAttachments.style === 'object') {
		if (isBrowser) {
			delete withAttachments.style;
		} else {
			// Svelte stringifies style objects inside spread attributes as
			// "[object Object]", so dynamic Motion styles need serialization here.
			withAttachments.style = serializeServerStyle(withAttachments.style as Record<string, unknown>);
		}
	}
	withAttachments[styleAttachmentKey] = styleAttachment;

	const listeners = visualElement?.listeners ?? {};
	for (const key of Object.getOwnPropertySymbols(listeners)) {
		let attachmentKey = listenerAttachmentKeys[key];
		if (!attachmentKey) {
			attachmentKey = createAttachmentKey();
			listenerAttachmentKeys[key] = attachmentKey;
		}
		withAttachments[attachmentKey] = listeners[key];
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
	{@html appearBootstrapHtml}
{:else}
	{#if visualElement?.type === "svg"}
		<g
			in:motionEnterIntro|global={{ context: motionOutroContext, visualElement }}
			out:motionExitOutro|global={{ context: motionOutroContext, visualElement }}
		>
			<Component {...elementProps} {@attach motionRef}>
				{@render props.children?.()}
			</Component>
		</g>
	{:else}
		<span
			style="display: contents"
			in:motionEnterIntro|global={{ context: motionOutroContext, visualElement }}
			out:motionExitOutro|global={{ context: motionOutroContext, visualElement }}
		>
			<Component {...elementProps} {@attach motionRef}>
				{@render props.children?.()}
			</Component>
		</span>
	{/if}
{/if}
