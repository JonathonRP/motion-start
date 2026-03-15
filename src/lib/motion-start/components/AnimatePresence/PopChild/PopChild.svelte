<!-- based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V. -->
<svelte:options runes />

<script lang="ts">
    import { useMotionConfigContext } from "../../../context/MotionConfigContext.svelte";
    import type { Props } from "./types";
    import { usePresenceContext } from "../../../context/PresenceContext.svelte";

    let { isPresent, children }: Props = $props();

    const id = $props.id();
    const { nonce } = $derived(useMotionConfigContext());
    const presenceContext = usePresenceContext();

    // Keep a reference to the injected style element so we can clean it up.
    let injectedStyle: HTMLStyleElement | null = null;

    function removeStyle() {
        if (injectedStyle && document.head.contains(injectedStyle)) {
            document.head.removeChild(injectedStyle);
            injectedStyle = null;
        }
    }

    // measurePop is called by ExitAnimationFeature.update() when isPresent
    // transitions to false. At that point the element is still in normal flow
    // (position:absolute hasn't been applied yet), so offsetTop/offsetLeft give
    // the correct parent-relative coordinates for the absolute positioning.
    $effect(() => {
        const context = presenceContext;
        if (!context) return;
        context.measurePop = (node) => {
            const child = node as HTMLElement;

            // offsetTop/offsetLeft are already relative to offsetParent (nearest
            // positioned ancestor), so they work directly with position:absolute
            // regardless of page scroll position.
            const width = child.offsetWidth;
            const height = child.offsetHeight;
            const top = child.offsetTop;
            const left = child.offsetLeft;

            // Remove any previously injected style before creating a new one.
            removeStyle();

            child.dataset.motionPopId = id;

            const style = document.createElement("style");
            if (nonce) style.nonce = nonce;
            document.head.appendChild(style);
            injectedStyle = style;

            if (style.sheet) {
                style.sheet.insertRule(`[data-motion-pop-id="${id}"] { position: absolute !important; width: ${width}px !important; height: ${height}px !important; top: ${top}px !important; left: ${left}px !important; }`);
            }
        };
        return () => {
            context.measurePop = undefined;
            removeStyle();
        };
    });

    // When the element becomes present again, remove the absolute positioning.
    $effect(() => {
        if (isPresent) {
            removeStyle();
        }
    });
</script>

{@render children()}
