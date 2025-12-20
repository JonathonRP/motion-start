<script lang="ts">
    import { ElementRect, Previous } from "runed";
    import type { MeasureProps } from "./types";
    import {
        setPresenceContext,
        usePresenceContext,
    } from "../../../context/PresenceContext.svelte";

    let {
        isPresent,
        children,
        childRef = $bindable(),
        sizeRef = $bindable(),
    }: MeasureProps = $props();

    const context = usePresenceContext().current;

    if (!context) {
        throw new Error("presence context is required at this point");
    }

    /**
     * !-- PopChildMeasure Component --!
     * This is extracted out to avoid recreating
     * the measurements and attachments on every render.
     */
    const prevIsPresent = new Previous(() => isPresent);
    const elementMeasurements = new ElementRect(() => childRef.current);
    context.measurePop = (node) => {
        childRef.current = node as HTMLElement;

        if (
            elementMeasurements.current &&
            prevIsPresent.current &&
            !isPresent
        ) {
            const size = sizeRef.current;
            size.height = elementMeasurements.current.height || 0;
            size.width = elementMeasurements.current.width || 0;
            size.top = elementMeasurements.current.top;
            size.left = elementMeasurements.current.left;
        }
    };

    setPresenceContext({
        get current() {
            return context;
        },
    });
</script>

{@render children()}
