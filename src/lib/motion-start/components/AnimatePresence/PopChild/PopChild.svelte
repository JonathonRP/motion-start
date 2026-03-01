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
    // Snapshot captured while element is still in normal flow
    let snapshot: Size | null = null;

    const { nonce } = $derived(useMotionConfigContext().current);
    const presenceRef = usePresenceContext();

    // measurePop is called by ExitAnimationFeature.mount() with the DOM element.
    // We store the element reference here so we can snapshot its position.
    $effect(() => {
        const context = presenceRef.current;
        if (!context) return;
        context.measurePop = (node) => {
            child = node as HTMLElement;
        };
        return () => {
            context.measurePop = undefined;
            child = null;
        };
    });

    // $effect.pre: runs BEFORE DOM is patched — equivalent to getSnapshotBeforeUpdate.
    // Capture position while element is still in normal flow (isPresent = true).
    $effect.pre(() => {
        // Track isPresent reactively so this re-runs when it changes
        if (isPresent && child) {
            const rect = child.getBoundingClientRect();
            snapshot = {
                width: rect.width,
                height: rect.height,
                top: rect.top,
                left: rect.left,
            };
        }
    });

    // $effect: runs AFTER DOM is patched.
    // Apply snapshot to size when element becomes not-present.
    $effect(() => {
        if (!isPresent && snapshot && child) {
            size.width = snapshot.width;
            size.height = snapshot.height;
            size.top = snapshot.top;
            size.left = snapshot.left;
            snapshot = null;
        }
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
