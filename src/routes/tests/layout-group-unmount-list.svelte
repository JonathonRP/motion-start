<script lang="ts">
import { LayoutGroup, motion, type MotionStyle } from '$lib/motion-start';

const style: MotionStyle = {
	width: '100px',
	height: '100px',
	opacity: 1,
	borderRadius: '20px',
	margin: '20px',
};

const containerStyle: MotionStyle = {
	display: 'block',
	width: 'min-content',
	height: 'min-content',
};

const stackStyle: MotionStyle = {
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'flex-start',
	alignItems: 'center',
	padding: '20px',
	width: 'auto',
	height: 'auto',
	backgroundColor: 'blue',
};

interface ItemState {
	id: string;
	visible: boolean;
	backgroundColor: string;
}

let items = $state<ItemState[]>([
	{ id: 'a', visible: true, backgroundColor: 'red' },
	{ id: 'b', visible: true, backgroundColor: 'yellow' },
]);

function hideItem(id: string) {
	items = items.map((item) => (item.id === id ? { ...item, visible: false } : item));
}
</script>

<LayoutGroup id="group-1">
    <motion.div style={{ position: 'absolute', left: '100px', bottom: '100px' }}>
        <LayoutGroup id="list">
            <motion.div style={{ display: 'contents' }}>
                <motion.div
                    id="stack"
                    layoutId="stack"
                    style={containerStyle}
                    transition={{ duration: 0.2, ease: () => 0.5 }}
                >
                    <motion.div style={stackStyle}>
                        <motion.div style={{ display: 'contents' }}>
                            {#each items as item (item.id)}
                                <LayoutGroup id="group-2">
                                    <motion.div style={{ display: 'contents' }}>
                                        {#if item.visible}
                                            <motion.div
                                                id={item.id}
                                                layoutId={item.id}
                                                style={{
                                                    ...style,
                                                    backgroundColor: item.backgroundColor,
                                                }}
                                                onclick={() => hideItem(item.id)}
                                                transition={{ duration: 10, ease: () => 0.5 }}
                                            />
                                        {/if}
                                    </motion.div>
                                </LayoutGroup>
                            {/each}
                        </motion.div>
                    </motion.div>
                </motion.div>
            </motion.div>
        </LayoutGroup>
    </motion.div>
</LayoutGroup>
