<script lang="ts">
import { motion, type LayoutProps, type MotionStyle, useInstantLayoutTransition } from 'motion-start';

const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
const paramType = params.get('type');
const type: LayoutProps['layout'] =
	paramType === 'position' || paramType === 'size' || paramType === 'preserve-aspect' ? paramType : true;

let bgColor = $state('#f00');
let isFirstLayout = $state(true);

const startTransition = useInstantLayoutTransition();

const box = {
	position: 'absolute',
	top: '0',
	left: '0',
} satisfies MotionStyle;

const a = {
	...box,
	width: '100px',
	height: '200px',
} satisfies MotionStyle;

const b = {
	...box,
	top: '100px',
	left: '200px',
	width: '300px',
	height: '300px',
} satisfies MotionStyle;

function handleClick() {
	startTransition(() => {
		bgColor = '#00f';
	});
	isFirstLayout = !isFirstLayout;
}
</script>

{#key isFirstLayout}
	<motion.div
		id={isFirstLayout ? 'a' : 'b'}
		data-testid="box"
		layoutId="box"
		layout={type}
		style={{
			...(isFirstLayout ? a : b),
			backgroundColor: bgColor,
			borderRadius: isFirstLayout ? '0' : '20px',
		}}
		onclick={handleClick}
	/>
{/key}
