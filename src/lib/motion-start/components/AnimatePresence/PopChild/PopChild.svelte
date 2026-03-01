<!-- based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V. -->
<svelte:options runes />

<script lang="ts">
    import { useMotionConfigContext } from "../../../context/MotionConfigContext.svelte";
    import type { Props } from "./types";
    import { usePresenceContext } from "../../../context/PresenceContext.svelte";

    let { isPresent, children }: Props = $props();

    const id = $props.id();
    const { nonce } = $derived(useMotionConfigContext().current);
    const presenceRef = usePresenceContext();

    // Keep a reference to the injected style element so we can clean it up.
    let injectedStyle: HTMLStyleElement | null = null;

    function removeStyle() {
        if (injectedStyle && document.head.contains(injectedStyle)) {
            document.head.removeChild(injectedStyle);
            injectedStyle = null;
        }
    }

    // measurePop is called from VisualElement.update() inside $effect.pre —
    // before the DOM is patched — so the element is still in normal flow.
    // We apply the absolute-position styles directly and imperatively here,
    // avoiding $state mutations inside $effect.pre which cause timing issues.
    $effect(() => {
        const context = presenceRef.current;
        if (!context) return;
        context.measurePop = (node) => {
            const child = node as HTMLElement;

            // Measure while element is still in normal flow.
            const width = child.offsetWidth;
            const height = child.offsetHeight;
            const top = child.offsetTop;
            const left = child.offsetLeft;

            // Remove any previously injected style.
            removeStyle();

            child.dataset.motionPopId = id;

            const style = document.createElement("style");
            if (nonce) style.nonce = nonce;
            document.head.appendChild(style);
            injectedStyle = style;

            if (style.sheet) {
                style.sheet.insertRule(
                    '[data-motion-pop-id="' + id + '"] {' +
                    ' position: absolute !important;' +
                    ' width: ' + width + 'px !important;' +
                    ' height: ' + height + 'px !important;' +
                    ' top: ' + top + 'px !important;' +
                    ' left: ' + left + 'px !important;' +
                    '}'
                );
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
