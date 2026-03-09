<script>
	import { Motion, useMotionValue, useTransform } from 'motion-start';

	export let card; // { color, emoji }
	export let exitX;
	export let variantsFrontCard;
	export let ondragend;

	// Each Card instance owns its own x / rotate so that the exiting card and
	// the entering card don't share the same MotionValue.
	const x = useMotionValue(0);
	const rotate = useTransform(x, [-150, 0, 150], [-30, 0, 30]);
</script>

<Motion.div
	drag="x"
	dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
	dragElastic={1}
	style={{ x, rotate }}
	variants={variantsFrontCard}
	initial="initial"
	animate={{ ...variantsFrontCard.animate, backgroundColor: card.color }}
	exit="exit"
	custom={exitX}
	transition={{ type: 'spring', stiffness: 300, damping: 20 }}
	{ondragend}
	class="card front-card"
>
	<div class="card-content">
		<div class="emoji">{card.emoji}</div>
		<div class="card-label">{card.label}</div>
	</div>
</Motion.div>
