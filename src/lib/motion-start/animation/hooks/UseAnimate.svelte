<!-- based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V. -->

<script lang="ts" generics="T extends Element = any">
    import { createScopedAnimate } from "../animate";
    import type { AnimationScope } from "../types";
    import { onDestroy } from "svelte";

    let current: T;

    const scope: AnimationScope<T> = {
        current, // Will be hydrated by Svelte
        animations: [],
    };

    const animate = createScopedAnimate(scope);

    onDestroy(() => {
        scope.animations.forEach((animation) => animation.stop);
    });
</script>

<slot this={current} {...[scope, animate] as [AnimationScope<T>, typeof animate]} />