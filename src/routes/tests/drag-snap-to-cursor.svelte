<svelte:options runes={true} />

<script lang="ts">
import { motion, useDragControls } from '$lib/motion-start';

const dragControls = useDragControls();
</script>

	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
    style="position: absolute; top: 0; bottom: 0; left: 0; right: 0; background: black; padding-top: 1000px; height: 100vh; display: flex; box-sizing: content-box;"
>
    <div
        style="width: 200px; height: 200px; background: rgba(255,255,255,0.5); border-radius: 20px; margin: 20px;"
		onpointerdown={(event) => dragControls.start(event, { snapToCursor: true })}
		id="scroll-trigger"
		aria-label="Start drag"
	></div>
    <motion.div
        drag
        dragControls={dragControls}
        whileTap={{ scale: 0.95 }}
        style={{
            width: '50vw',
            height: '300px',
            background: 'white',
            borderRadius: '20px',
        }}
        id="scrollable"
    />
</div>
