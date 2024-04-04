/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import { ScrollMotionValues } from "./utils";
/**
 * Returns MotionValues that update when the provided element scrolls:
 *
 * - `scrollX` — Horizontal scroll distance in pixels.
 * - `scrollY` — Vertical scroll distance in pixels.
 * - `scrollXProgress` — Horizontal scroll progress between `0` and `1`.
 * - `scrollYProgress` — Vertical scroll progress between `0` and `1`.
 *
 * This element must be set to `overflow: scroll` on either or both axes to report scroll offset.
 *
 * @motion
 *
 * ```jsx
 * <script>
 *   import { useElementScroll, MotionDiv } from 'svelte-motion'

 *   const scroll = useElementScroll()
 *
 *  </script>
 * 
 * <div bind:this={scroll.ref}>
 *    <MotionDiv style={{ scaleX: scroll.scrollYProgress }} />
 *  </div>
 * 
 * ```
 *
 * @public
 */
export declare function useElementScroll(ref: RefObject<HTMLElement>): ScrollMotionValues;


/** 
based on framer-motion@4.1.16,
Copyright (c) 2018 Framer B.V.
*/
import {
    createScrollMotionValues,
    createScrollUpdater,
} from "./utils"
import { addDomEvent } from "../../events/use-dom-event"


const getElementScrollOffsets = (element) => () => {
    return {
        xOffset: element.scrollLeft,
        yOffset: element.scrollTop,
        xMaxOffset: element.scrollWidth - element.offsetWidth,
        yMaxOffset: element.scrollHeight - element.offsetHeight,
    }
}

export const useElementScroll = (ref) => {

    const values = {}

    const setScroll = async () => {
        if (typeof window === "undefined") return ()=>{}

        let times = 10
        while ( (!ref || !ref.current) && !values.ref ){
            if(times-- < 1){
                return ()=>{};
            };
            
            await new Promise(r=>setTimeout(()=>r(),200));
        }
        const element = (ref && ref.current) ? ref : values.ref;

        const updateScrollValues = createScrollUpdater(
            values,
            getElementScrollOffsets(element)
        )

        const scrollListener = addDomEvent(
            element,
            "scroll",
            updateScrollValues,
            { passive: true }
        )

        const resizeListener = addDomEvent(
            element,
            "resize",
            updateScrollValues
        )
        return ()=>{
            scrollListener && scrollListener()
            resizeListener && resizeListener()
        }
    }
    Object.assign(values,createScrollMotionValues(setScroll));

    return values;
}

//export { default as UseElementScroll } from './UseElementScroll.svelte';
