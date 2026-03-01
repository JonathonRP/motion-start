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
    // snapshot holds the last measurement taken while isPresent=true
    let snapshot: Size | null = null;

    const { nonce } = $derived(useMotionConfigContext().current);
    const presenceRef = usePresenceContext();

    // measurePop is called by ExitAnimationFeature.mount() to register the element ref.
    $effect(() => {
        const context = presenceRef.current;
        if (!context) return;
        context.measurePop = (node) => {
            child = node as HTMLElement;
        };
        return () => {
            context.measurePop = undefined;
            child = null;
            snapshot = null;
        };
    });

    // $effect.pre runs BEFORE DOM is patched — equivalent to getSnapshotBeforeUpdate.
    // When isPresent=true, keep refreshing the snapshot so it's always current.
    // When isPresent transitions to false, apply the last snapshot to size.
    $effect.pre(() => {
        isPresent; // track reactively
        if (child) {
            if (isPresent) {
                // Still in flow — update snapshot with current position
                const rect = child.getBoundingClientRect();
                snapshot = { width: rect.width, height: rect.height, top: rect.top, left: rect.left };
            } else if (snapshot) {
                // Just became not-present, before DOM patches — apply snapshot
                size.width = snapshot.width;
                size.height = snapshot.height;
                size.top = snapshot.top;
                size.left = snapshot.left;
                snapshot = null;
            }
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
