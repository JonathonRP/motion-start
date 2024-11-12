<!-- based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V. -->

<script lang="ts">
    import { getContext } from "svelte";
    import type { Writable } from "svelte/store";
    import { MotionContext, type MotionContextProps } from ".";
    import type { MotionProps } from "../../motion/types";
    import { getCurrentTreeVariants } from "./utils";

    export let props: MotionProps,
        isCustom: any = undefined;

    let mc =
        getContext<Writable<MotionContextProps>>(MotionContext) ||
        MotionContext(isCustom);
    let { initial, animate } = getCurrentTreeVariants(props, $mc);
    $: ({ initial, animate } = getCurrentTreeVariants(props, $mc));

    const memo = (
        _initial: string | boolean | undefined,
        _animate: string | boolean | undefined,
    ) => ({ initial, animate });

    let value = memo(
        variantLabelsAsDependency(initial),
        variantLabelsAsDependency(animate),
    );
    $: value = memo(
        variantLabelsAsDependency(initial),
        variantLabelsAsDependency(animate),
    );

    function variantLabelsAsDependency(
        prop: undefined | string | string[] | boolean,
    ) {
        return Array.isArray(prop) ? prop.join(" ") : prop;
    }
</script>

<slot {value} />
