<script lang="ts">
import { AnimatePresence, motion, type MotionStyle } from 'motion-start';

let range = $state([0, 1, 2]);

const boxStyles: MotionStyle = {
	width: '100px',
	height: '100px',
	backgroundColor: 'red',
};

function removeItem() {
	range = range.slice(0, -1);
}

const items = $derived(range.map((id) => ({ key: id, id })));
</script>

<div style="position: relative; display: flex; flex-direction: column; padding: 100px;">
    <button id="remove" onclick={removeItem}>
        Remove
    </button>
    <AnimatePresence>
        {#each items as item (item.key)}
            <motion.div
                id="box-{item.id}"
                class="box"
                style={boxStyles}
                transition={{ duration: 0.5 }}
                exit={{ opacity: 0.5 }}
            />
        {/each}
    </AnimatePresence>
</div>
