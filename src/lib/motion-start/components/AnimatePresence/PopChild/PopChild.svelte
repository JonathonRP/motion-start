<!-- based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V. -->
<svelte:options runes />

<script lang="ts">
    import { useMotionConfig } from "../../../context/MotionConfigContext.svelte";
    import type { Props, Size } from "./types";
    import type { MutableRefObject } from "../../../utils/safe-react-types";
    import PopChildMeasure from "./PopChildMeasure.svelte";

    let { isPresent, children }: Props = $props();

    const id = $props.id();
    let ref: MutableRefObject<HTMLElement> = $state({
        current: null!,
    });
    let size: MutableRefObject<Size> = $state({
        current: {
            width: 0,
            height: 0,
            top: 0,
            left: 0,
        },
    });

    const { nonce } = $derived(useMotionConfig());

    /**
     * We create and inject a style block so we can apply this explicit
     * sizing in a non-destructive manner by just deleting the style block.
     *
     * We can't apply size via render as the measurement happens
     * in getSnapshotBeforeUpdate (post-render), likewise if we apply the
     * styles directly on the DOM node, we might be overwriting
     * styles set via the style prop.
     */
    $effect(() => {
        const { width, height, top, left } = size.current;
        if (isPresent || !ref.current || !width || !height) return;

        ref.current.dataset.motionPopId = id;

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

<PopChildMeasure {isPresent} bind:childRef={ref} bind:sizeRef={size}>
    {@render children()}
</PopChildMeasure>

<style>
    :global([data-motion-pop-id]) {
        position: absolute !important;
        width: var(--width) !important;
        height: var(--height) !important;
        top: var(--top) !important;
        left: var(--left) !important;
    }
</style>
