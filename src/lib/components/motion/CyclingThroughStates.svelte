<script>
// Cycling through states
import { Motion, useCycle } from '$lib/motion-start';
import Box from '../Box.svelte';

let stateText = 'State 1';
// In React
// const [animate, cycle] = useCycle(
//   {
//     scale: 1,
//     rotate: 0,
//   },
//   {
//     scale: 1.25,
//     rotate: 90,
//   }
// );
// In Svelte 5 with runes
const rotate = useCycle(0, 90);
const scale = useCycle(0.8, 1.2);
const x = useCycle(0, 140);
const backgroundColor = useCycle('#9EF4FF', '#0FBFFF');
</script>

<Box cls="bg-slate-800 text-black">
    <Motion.div
        animate={{
            scale: scale.current,
            backgroundColor: backgroundColor.current,
        }}
        transition={{
            duration: 0.3,
        }}
        onTap={() => {
            scale.cycle();
            backgroundColor.cycle();
            if (stateText === "State 1") {
                stateText = "State 2";
            } else {
                stateText = "State 1";
            }
        }}
        class="box"
    >
        {stateText}
    </Motion.div>
</Box>
