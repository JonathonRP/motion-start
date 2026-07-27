<script lang="ts">
import { page } from '$app/state';
import { motion, type MotionStyle } from 'motion-start';

let state = $state(true);
const nested = $derived(Boolean(page.url.searchParams.get('nested')));
const contentHeight = $derived(state ? '1000px' : 'auto');

const scrollable: MotionStyle = {
	position: 'fixed',
	top: '0px',
	left: '0px',
	right: '0px',
	height: '500px',
	overflow: 'scroll',
};

const containerStyle = $derived(
	`margin-top: 100px; display: flex; justify-content: center; align-items: flex-start; height: ${contentHeight};`
);

const box: MotionStyle = {
	width: '100px',
	height: '100px',
	borderRadius: '10px',
	backgroundColor: '#ffaa00',
};
</script>

{#if nested}
    <motion.div layoutScroll id="scrollable" style={scrollable}>
        <div style={containerStyle}>
            <motion.div
                layout
                id="box"
                style={box}
                onclick={() => (state = !state)}
                transition={{ ease: () => 0.1 }}
            />
        </div>
    </motion.div>
{:else}
    <div style={containerStyle}>
        <motion.div
            layout
            id="box"
            style={box}
            onclick={() => (state = !state)}
            transition={{ ease: () => 0.1 }}
        />
    </div>
{/if}
