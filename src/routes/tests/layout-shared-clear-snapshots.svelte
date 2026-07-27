<script lang="ts">
import { page } from '$app/state';
import { motion, useCycle, type MotionStyle } from '$lib/motion-start';

const sibling = $derived(Boolean(page.url.searchParams.get('sibling')));
const [state, cycle] = useCycle(0, 1, 2);
const currentState = $derived(state());

const box: MotionStyle = {
	position: 'absolute',
	top: '100px',
	left: '0px',
	width: '100px',
	height: '100px',
	background: 'red',
};

const a: MotionStyle = { ...box };
const b: MotionStyle = { ...box, left: '200px' };
</script>

<button id="next" onclick={() => cycle()}>
    Next
</button>

{#if currentState !== 1}
    <motion.div
        id="box"
        layout
        layoutId="box"
        style={currentState === 0 ? a : b}
        transition={{
            duration: 0.15,
        }}
    />
{/if}

<!--
    Test this twice, once with a sibling and once without. With a sibling,
    didUpdate should fire as normal. Without a sibling, didUpdate won't fire as
    the removed element is the only projecting element in the tree (so no lifecycle
    methods can fire it) so the checkUpdateFailed will flag on the next frame
    and cancel the update
-->
{#if sibling && currentState !== 2}
    <motion.div layout style={{ ...box, backgroundColor: 'blue', top: '200px' }} />
{/if}
