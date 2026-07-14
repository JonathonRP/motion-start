<script lang="ts">
import { motion, type MotionStyle } from '$lib/motion-start';

let state = $state(false);
const size = $derived(state ? 100 : 200);
const style = $derived<MotionStyle>({
	rotate: 45,
	width: `${size}px`,
	height: `${size}px`,
	backgroundColor: 'red',
});
</script>

{#key state ? 'a' : 'b'}
    <motion.div
        id="box"
        data-testid="box"
        layoutId="box"
        {style}
        onclick={() => (state = !state)}
        transition={{
            duration: 10,
            ease: state ? () => 0.5 : () => 0,
        }}
    />
{/key}
