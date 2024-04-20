<!-- based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V. -->

<script lang="ts" context="module">
    import type { MotionContextProps } from './index.js';
    import type { VisualElement } from '../../render/types';
    import {writable, type Writable} from 'svelte/store';
    export const MotionContext = (c?: any): Writable<MotionContextProps> => (getDomContext("Motion",c) || writable({}));
    
    export const useVisualElementContext = (c?: any) => {
        return (getContext(MotionContext) || MotionContext(c)) as VisualElement<any,any> | undefined
    }
</script>
<script lang="ts">
    import { getContext } from "svelte";
    import { getDomContext } from '../DOMcontext';
    export let isCustom;
    const motionContext = getContext<Writable<MotionContextProps>>(MotionContext) || MotionContext(isCustom);
</script>
<slot parent={$motionContext.visualElement}/>
