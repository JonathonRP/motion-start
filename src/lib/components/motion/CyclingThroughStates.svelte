<script>
    import Box from "../Box.svelte";

    // Cycling through states
    import { motion, useCycle } from "$lib/motion-start";
    let stateText = "State 1";
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
    let [rotate, cycleRotate] = useCycle(0, 90);
    let [animate, cycle] = useCycle(
        { scale: 0.8, backgroundColor: "#9EF4FF" },
        { scale: 1.2, backgroundColor: "#0FBFFF" },
    );
    let x = useCycle(0, 140);
</script>

<Box>
    <motion.div
        animate={$animate}
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
