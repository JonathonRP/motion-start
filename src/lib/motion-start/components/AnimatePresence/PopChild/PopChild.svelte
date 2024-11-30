<!-- based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V. -->

<script context="module" module lang="ts">
    let presenceId = 0;
    function getPresenceId() {
        const id = presenceId;
        presenceId++;
        return id;
    }
</script>

<script lang="ts">
    import { createRawSnippet, mount } from "svelte";
    import { MotionConfigContext } from "../../../context/MotionConfigContext";
    import { useContext } from "../../../context/utils/context.svelte";
    import type { Props, MeasureProps, Size } from "./types";
    import type { RefObject } from "../../../utils/safe-react-types";
    import { fromStore } from "svelte/store";

    let { isPresent, children }: Props = $props();

    const PopChildMeasure = createRawSnippet<[MeasureProps]>((measureProps) => {
        return {
            render: () => "<slot></slot>",
            setup(node) {
                $effect(() => {
                    const { children, childRef, sizeRef } = measureProps();
                    childRef.current = node as HTMLElement;

                    if (!children) return;

                    mount(children!, { target: node });

                    const elementMeasurements =
                        childRef.current!.getBoundingClientRect()!;
                    if (
                        elementMeasurements &&
                        prevProps.isPresent &&
                        !isPresent
                    ) {
                        const size = sizeRef.current!;
                        size.height = elementMeasurements.height || 0;
                        size.width = elementMeasurements.width || 0;
                        size.top = elementMeasurements.top;
                        size.left = elementMeasurements.left;
                    }
                });
            },
        };
    });

    // PopChild ---

    const id = getPresenceId();
    let ref: RefObject<HTMLElement>;
    let size: RefObject<Size> = {
        current: {
            width: 0,
            height: 0,
            top: 0,
            left: 0,
        },
    };
    $: prevProps = { isPresent };

    $: ({ nonce } = fromStore(useContext(MotionConfigContext)).current);

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
        const { width, height, top, left } = size.current!;
        if (isPresent || !ref.current || !width || !height) return;

        ref.current.dataset.motionPopId = id.toString();

        const style = document.createElement("style");
        if (nonce) style.nonce = nonce;
        document.head.appendChild(style);

        /**
         old pop logic - remove need for size ref
            isolation: isolate;
            display: grid;
            grid-column: 1/-1;
        */
        if (style.sheet) {
            style.sheet.insertRule(`
          [data-motion-pop-id="${id}"] {
            position: absolute !important;
            width: ${width}px !important;
            height: ${height}px !important;
            top: ${top}px !important;
            left: ${left}px !important;
          }
        `);
        }

        return () => {
            document.head.removeChild(style);
        };
    });
</script>

{@render PopChildMeasure({
    children,
    childRef: ref!,
    isPresent,
    sizeRef: size,
})}
