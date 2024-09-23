<!-- based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V. -->

<script lang="ts">
    import { getContext } from "svelte";
    import { get, type Writable } from 'svelte/store';
    import { MotionContext, type MotionContextProps } from './index.js';
    import { getCurrentTreeVariants } from './utils.js';

    export let props: any, 
        isStatic: any,
        isCustom: any = undefined;

    let mc: Writable<MotionContextProps> = getContext(MotionContext)||MotionContext(isCustom);
    let {initial, animate} = getCurrentTreeVariants(props, get(mc));
    $: ({initial,animate} = getCurrentTreeVariants(props, $mc));

    const variantLabelsAsDependency = (prop) => {
        return Array.isArray(prop) ? prop.join(" ") : prop;
    }

    const memo = () => { return (
        { initial: initial, animate: animate }
        ); 
    } 
    /**
     * Only break memoisation in static mode
     */
     let value = memo();
     $: if (isStatic){
         value = memo(variantLabelsAsDependency(initial),variantLabelsAsDependency(animate))
     }
</script>
<slot {value}/>
