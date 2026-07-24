<script lang="ts">
import { LayoutGroup, motion, type MotionStyle } from '$lib/motion-start';

const style: MotionStyle = {
	width: '100px',
	height: '100px',
	background: 'red',
	opacity: 1,
	borderRadius: '20px',
	margin: '20px',
};

const stackStyle: MotionStyle = {
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'start',
};

let variant = $state('a');
const isVisible = $derived(variant === 'a');
</script>

<LayoutGroup id="group-1">
    <motion.div style={{ display: 'contents' }}>
        <motion.div style={stackStyle}>
            <LayoutGroup id="group-2">
                <motion.div style={{ display: 'contents' }}>
                    {#if isVisible}
                        <motion.div
                            id="a"
                            layoutId="a"
                            style={style}
                            onclick={() => (variant = variant === 'a' ? 'b' : 'a')}
                        />
                    {/if}
                </motion.div>
            </LayoutGroup>
        </motion.div>
        <motion.div
            layoutId="b"
            style={{ ...style, backgroundColor: 'blue' }}
            id="b"
            transition={{ duration: 0.2, ease: () => 0.5 }}
        />
    </motion.div>
</LayoutGroup>
