<!-- https://codesandbox.io/p/sandbox/95hxf3?file=%2Fsrc%2FExample.jsx -->
<script lang="ts">
    import Box from "../Box.svelte";

    // Cycling through states
    import { motion, useCycle } from "$lib/motion-start";
    let stateText = $state("State 1");
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
    // In Svelte
    // let [rotate, cycleRotate] = useCycle(0, 90);
    let [animate, cycle] = useCycle(
        { scale: 0.8, backgroundColor: "#9EF4FF" },
        { scale: 1.2, backgroundColor: "#0FBFFF" },
    );
    // let x = useCycle(0, 140);

    // TODO: fix this test case - updated motion value to createSubscriber - only works client now
</script>

<Box>
    <motion.div
        id="usecycle"
        animate={animate()}
        transition={{
            duration: 0.3,
        }}
        onTap={() => {
            cycle();
            if (stateText === "State 1") {
                stateText = "State 2";
            } else {
                stateText = "State 1";
            }
        }}
        class="box"
    >
        {stateText}
    </motion.div>
</Box>
