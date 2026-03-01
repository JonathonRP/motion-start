<script lang="ts">
    /**
     * This demo copies the rough setup of a nested Scroll/Page
     * combo in Framer.
     */
    import { motion, useMotionValue } from '$lib/motion-start';

    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const dummyX = useMotionValue(0);
    const dummyY = useMotionValue(0);

    const scrollContainer = {
        position: 'absolute',
        top: 100,
        left: 100,
        width: 200,
        height: 500,
        overflow: 'hidden',
    };

    const pageContainer = {
        display: 'flex',
        flexDirection: 'row',
        width: 180,
        height: 180,
        position: 'relative',
        top: 300,
        left: 10,
    };

    const b = {
        background: '#ff0055',
        top: 100,
        left: 100,
        width: '100%',
        height: 500,
        borderRadius: 10,
    };

    const pageStyle = {
        width: 180,
        height: 180,
        background: '#ffcc00',
        borderRadius: 10,
        flex: '0 0 180px',
    };

    const c = {
        position: 'relative',
        top: 50,
        left: 50,
        width: 100,
        height: 100,
        background: '#ffaa00',
        borderRadius: 10,
    };
</script>

<motion.div style={scrollContainer} layout>
    <motion.div
        id="parent"
        style={b}
        drag="y"
        _dragX={dummyX}
        _dragY={dummyY}
    >
        <motion.div style={{ ...pageContainer, x: x.get(), y: y.get() }} layout id="Page">
            <motion.div
                layout
                _dragX={x}
                _dragY={y}
                id="a"
                drag="x"
                style={pageStyle}
            >
                <motion.div layout style={c} />
            </motion.div>
            <motion.div
                layout
                _dragX={x}
                _dragY={y}
                id="b"
                drag="x"
                style={pageStyle}
            >
                <motion.div layout style={c} />
            </motion.div>
            <motion.div
                layout
                _dragX={x}
                _dragY={y}
                drag="x"
                style={pageStyle}
            >
                <motion.div layout style={c} />
            </motion.div>
            <motion.div
                layout
                _dragX={x}
                _dragY={y}
                drag="x"
                style={pageStyle}
            >
                <motion.div layout style={c} />
            </motion.div>
        </motion.div>
    </motion.div>
</motion.div>
