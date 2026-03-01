<!-- based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V. -->
<svelte:options runes />

<script lang="ts">
    import { useMotionConfigContext } from "../../../context/MotionConfigContext.svelte";
    import type { Props, Size } from "./types";
    import { usePresenceContext } from "../../../context/PresenceContext.svelte";

    let { isPresent, children }: Props = $props();

    const id = $props.id();
    let child = $state<HTMLElement | null>(null);
    let size = $state<Size>({ width: 0, height: 0, top: 0, left: 0 });

    const { nonce } = $derived(useMotionConfigContext().current);
    const presenceRef = usePresenceContext();

    // measurePop is called by ExitAnimationFeature:
    //   - mount(): element is freshly mounted and in normal flow
    //   - update(): called when isPresent transitions false, BEFORE exit animation
    // Both calls happen while the element is still in normal flow, so
    // getBoundingClientRect() gives the correct laid-out position.
    $effect(() => {
        const context = presenceRef.current;
        if (!context) return;
        context.measurePop = (node) => {
            child = node as HTMLElement;
            // Use offsetTop/offsetLeft — already relative to offsetParent (the
            // nearest positioned ancestor), so they work directly with position:absolute
            // regardless of page scroll or viewport position.
            size.width = child.offsetWidth;
            size.height = child.offsetHeight;
            size.top = child.offsetTop;
            size.left = child.offsetLeft;
        };
        return () => {
            context.measurePop = undefined;
            child = null;
        };
    });

    // Inject a style block with captured dimensions so position:absolute
    // can be applied without overwriting the element's own style prop.
    $effect(() => {
        const { width, height, top, left } = size;
        if (isPresent || !child || !width || !height) return;

        child.dataset.motionPopId = id;

        const style = document.createElement("style");
        if (nonce) style.nonce = nonce;
        document.head.appendChild(style);

        if (style.sheet) {
            style.sheet.insertRule(`
                [data-motion-pop-id="${id}"] {
                    --width: ${width}px;
                    --height: ${height}px;
                    --top: ${top}px;
                    --left: ${left}px;
                }
            `);
        }
        return () => {
            if (document.head.contains(style)) {
                document.head.removeChild(style);
            }
        };
    });
</script>

{@render children()}

<style>
    :global([data-motion-pop-id]) {
        position: absolute !important;
        width: var(--width) !important;
        height: var(--height) !important;
        top: var(--top) !important;
        left: var(--left) !important;
    }
</style>
