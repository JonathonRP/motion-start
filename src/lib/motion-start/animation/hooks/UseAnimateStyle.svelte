<!-- based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V. -->

<script lang="ts" generics="T extends Element = any">
    import { createScopedWaapiAnimate } from "../animators/waapi/animate-style";
    import type { AnimationScope } from "../types";
    import { onDestroy } from "svelte";

    let current: T;

    const scope: AnimationScope<T> = {
        current, // Will be hydrated by Svelte
        animations: [],
    };

    const animate = createScopedWaapiAnimate(scope);

    onDestroy(() => {
        scope.animations.forEach((animation) => animation.stop);
    });
</script>

<slot this={current} {...[scope, animate] as [AnimationScope<T>, typeof animate]} />
