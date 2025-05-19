<!-- based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V. -->
<svelte:options runes />

<script lang="ts">
    import { MotionConfigContext } from "../../../context/MotionConfigContext";
    import { useContext } from "../../../context/use";
    import type { Props, MeasureProps, Size } from "./types";
    import type {
        MutableRefObject,
        RefObject,
    } from "../../../utils/safe-react-types";
    import { ElementRect, Previous } from "runed";
    import { tick } from "svelte";
    import type { Attachment } from "svelte/attachments";

    let { isPresent, children }: Props = $props();

    const id = $props.id();
    let ref: RefObject<HTMLElement> = $state({
        current: null,
    });
    let size: MutableRefObject<Size> = $state({
        current: {
            width: 0,
            height: 0,
            top: 0,
            left: 0,
        },
    });

    const { nonce } = $derived(useContext(MotionConfigContext).current);

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

{#snippet PopChildMeasure({
    children,
    childRef,
    isPresent,
    sizeRef,
}: MeasureProps)}
    {#if children}
        {@const prevIsPresent = new Previous(() => isPresent)}
        {@const elementMeasurements = new ElementRect(() => childRef.current)}
        {@const measure: Attachment = (node) => {
            childRef.current = node as HTMLElement;

            if (
                elementMeasurements.current &&
                prevIsPresent.current &&
                !isPresent
            ) {
                const size = sizeRef.current;
                size.height = elementMeasurements.height || 0;
                size.width = elementMeasurements.width || 0;
                size.top = elementMeasurements.top;
                size.left = elementMeasurements.left;
            }
        }}

        {@render children({ measure })}
    {/if}
{/snippet}

{@render PopChildMeasure({
    children,
    childRef: ref as MeasureProps["childRef"],
    isPresent,
    sizeRef: size,
})}

<style>
    :global([data-motion-pop-id]) {
        position: absolute !important;
        width: var(--width) !important;
        height: var(--height) !important;
        top: var(--top) !important;
        left: var(--left) !important;
    }
</style>
