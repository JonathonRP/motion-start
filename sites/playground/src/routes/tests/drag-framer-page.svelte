<script lang="ts">
import { motion, type MotionStyle, useMotionValue } from 'motion-start';

const x = useMotionValue(0);
const y = useMotionValue(0);
const dummyX = useMotionValue(0);
const dummyY = useMotionValue(0);

const scrollContainer = {
	position: 'absolute',
	top: '100px',
	left: '100px',
	width: '200px',
	height: '500px',
	overflow: 'hidden',
} satisfies MotionStyle;

const pageContainer = {
	display: 'flex',
	flexDirection: 'row',
	width: '180px',
	height: '180px',
	position: 'relative',
	top: '300px',
	left: '10px',
	x,
	y,
} satisfies MotionStyle;

const b = {
	background: '#ff0055',
	top: '100px',
	left: '100px',
	width: '100%',
	height: '500px',
	borderRadius: '10px',
} satisfies MotionStyle;

const pageStyle = {
	width: '180px',
	height: '180px',
	background: '#ffcc00',
	borderRadius: '10px',
	flex: '0 0 180px',
} satisfies MotionStyle;

const c = {
	position: 'relative',
	top: '50px',
	left: '50px',
	width: '100px',
	height: '100px',
	background: '#ffaa00',
	borderRadius: '10px',
} satisfies MotionStyle;
</script>

<motion.div style={scrollContainer} layout>
	<motion.div id="parent" style={b} drag="y" _dragX={dummyX} _dragY={dummyY}>
		<motion.div style={pageContainer} layout id="Page">
			<motion.div layout _dragX={x} _dragY={y} id="a" drag="x" style={pageStyle}>
				<motion.div layout style={c} />
			</motion.div>
			<motion.div layout _dragX={x} _dragY={y} id="b" drag="x" style={pageStyle}>
				<motion.div layout style={c} />
			</motion.div>
			<motion.div layout _dragX={x} _dragY={y} drag="x" style={pageStyle}>
				<motion.div layout style={c} />
			</motion.div>
			<motion.div layout _dragX={x} _dragY={y} drag="x" style={pageStyle}>
				<motion.div layout style={c} />
			</motion.div>
		</motion.div>
	</motion.div>
</motion.div>
