<script>
	import { Motion, useMotionValue, useTransform } from 'motion-start';

	export let card; // { color, emoji, label, isFront }
	export let exitX = 0;
	export let onDragEnd = undefined;

	// Each Card instance owns its own x / rotate so that the exiting card and
	// the entering card don't share the same MotionValue.
	const x = useMotionValue(0);
	const rotate = useTransform(x, [-150, 0, 150], [-30, 0, 30]);
</script>

<Motion.div
	drag={card.isFront ? 'x' : false}
	dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
	dragElastic={1}
	style={card.isFront ? { x, rotate } : undefined}
	initial={{ scale: card.isFront ? 1 : 0.9, y: card.isFront ? 0 : 40, opacity: 0 }}
	animate={{
		scale: card.isFront ? 1 : 0.9,
		y: card.isFront ? 0 : 20,
		opacity: card.isFront ? 1 : 0.5,
		backgroundColor: card.color
	}}
	exit={card.isFront ? { x: exitX, opacity: 0, scale: 0.5 } : { opacity: 0, scale: 0.85 }}
	transition={{ type: 'spring', stiffness: 300, damping: 20 }}
	{onDragEnd}
	class="card {card.isFront ? 'front-card' : 'back-card'}"
>
	<div class="card-content">
		<div class="emoji">{card.emoji}</div>
		<div class="card-label">{card.label}</div>
	</div>
</Motion.div>

<style>
	.card-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		color: white;
		pointer-events: none;
	}

	.emoji {
		font-size: 5rem;
		line-height: 1;
	}

	.card-label {
		font-size: 2rem;
		font-weight: 700;
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
	}
</style>
