<script>
	import { Motion, AnimatePresence, useMotionValue, useTransform } from 'motion-start';

	let index = 0;

	const cards = [
		{ id: 1, color: '#FF6B6B', emoji: '❤️' },
		{ id: 2, color: '#4ECDC4', emoji: '💙' },
		{ id: 3, color: '#45B7D1', emoji: '💚' },
		{ id: 4, color: '#96CEB4', emoji: '💛' },
		{ id: 5, color: '#FFEAA7', emoji: '🧡' },
		{ id: 6, color: '#DFE6E9', emoji: '💜' }
	];

	// Card component state
	let exitX = 0;
	const x = useMotionValue(0);
	const rotate = useTransform(x, [-150, 0, 150], [-30, 0, 30]);

	const variantsFrontCard = {
		animate: { scale: 1, y: 0, opacity: 1 },
		exit: (custom) => ({ x: custom, opacity: 0, scale: 0.5 })
	};

	const variantsBackCard = {
		initial: { scale: 0.9, y: 40, opacity: 0 },
		animate: { scale: 0.9, y: 20, opacity: 0.5 }
	};

	function handleDragEnd(_, info) {
		if (info.offset.x < -100) {
			exitX = -250;
			index = index + 1;
		}
		if (info.offset.x > 100) {
			exitX = 250;
			index = index + 1;
		}
	}

	function reset() {
		index = 0;
		exitX = 0;
	}

	$: currentCard = cards[index % cards.length];
	$: nextCard = cards[(index + 1) % cards.length];
</script>

<div class="app">
	<h1>Card Stack Demo</h1>
	<p class="subtitle">Drag the card left or right to dismiss</p>

	<div class="stage">
		<!-- Back card (outside AnimatePresence) -->
		<Motion.div
			variants={variantsBackCard}
			initial="initial"
			animate={{ ...variantsBackCard.animate, backgroundColor: nextCard.color }}
			transition={{ scale: { duration: 0.2 }, opacity: { duration: 0.4 } }}
			class="card back-card"
		>
			<div class="card-content">
				<div class="emoji">{nextCard.emoji}</div>
				<div class="card-number">{(index + 1) % cards.length + 1}</div>
			</div>
		</Motion.div>

		<!-- Front card (inside AnimatePresence) -->
		<AnimatePresence initial={false} list={[{ key: index }]} let:item>
			{#key item.key}
				<Motion.div
					drag="x"
					dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
					style={{ x, rotate }}
					variants={variantsFrontCard}
					animate={{ ...variantsFrontCard.animate, backgroundColor: currentCard.color }}
					exit="exit"
					custom={exitX}
					transition={{ type: 'spring', stiffness: 300, damping: 20 }}
					ondragend={handleDragEnd}
					class="card front-card"
				>
					<div class="card-content">
						<div class="emoji">{currentCard.emoji}</div>
						<div class="card-number">{(index % cards.length) + 1}</div>
					</div>
				</Motion.div>
			{/key}
		</AnimatePresence>
	</div>

	<button class="reset-btn" onclick={reset}>Reset Stack</button>

	<div class="info">
		<h3>How it works:</h3>
		<ul>
			<li><strong>Drag left or right</strong> to dismiss the card</li>
			<li>Cards exit in the direction you swipe</li>
			<li>Next card animates up from behind</li>
			<li>Uses <code>AnimatePresence</code> to orchestrate the animations</li>
		</ul>
	</div>
</div>

<style>
	:global(*) {
		box-sizing: border-box;
		margin: 0;
		padding: 0;
	}

	:global(body) {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
			sans-serif;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem;
	}

	.app {
		max-width: 500px;
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2rem;
	}

	h1 {
		color: white;
		font-size: 2rem;
		font-weight: 700;
		text-align: center;
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
		margin: 0;
	}

	.subtitle {
		color: rgba(255, 255, 255, 0.9);
		font-size: 1rem;
		text-align: center;
		margin-top: -1rem;
	}

	.stage {
		width: 280px;
		height: 350px;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	:global(.card) {
		width: 260px;
		height: 340px;
		position: absolute;
		border-radius: 20px;
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
		display: flex;
		align-items: center;
		justify-content: center;
		user-select: none;
		cursor: grab;
	}

	:global(.card:active) {
		cursor: grabbing;
	}

	:global(.back-card) {
		pointer-events: none;
		z-index: 1;
	}

	:global(.front-card) {
		z-index: 10;
	}

	.card-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		color: white;
	}

	.emoji {
		font-size: 5rem;
		line-height: 1;
	}

	.card-number {
		font-size: 3rem;
		font-weight: 700;
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
	}

	.reset-btn {
		padding: 0.75rem 2rem;
		background: white;
		color: #667eea;
		border: none;
		border-radius: 50px;
		font-weight: 600;
		font-size: 1rem;
		cursor: pointer;
		transition: all 0.2s;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
	}

	.reset-btn:hover {
		transform: translateY(-2px);
		box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
	}

	.reset-btn:active {
		transform: translateY(0);
	}

	.info {
		background: white;
		padding: 1.5rem;
		border-radius: 1rem;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		width: 100%;
	}

	.info h3 {
		color: #1e293b;
		font-size: 1.125rem;
		margin-bottom: 1rem;
	}

	.info ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.info li {
		color: #475569;
		font-size: 0.9375rem;
		line-height: 1.6;
		margin-bottom: 0.5rem;
		padding-left: 1.5rem;
		position: relative;
	}

	.info li::before {
		content: '→';
		position: absolute;
		left: 0.25rem;
		color: #667eea;
		font-weight: bold;
	}

	.info code {
		background: #f1f5f9;
		padding: 0.125rem 0.375rem;
		border-radius: 0.25rem;
		font-size: 0.875rem;
		color: #667eea;
		font-family: 'Courier New', monospace;
	}

	@media (max-width: 640px) {
		h1 {
			font-size: 1.5rem;
		}

		.stage {
			width: 240px;
			height: 320px;
		}

		:global(.card) {
			width: 220px;
			height: 300px;
		}

		.emoji {
			font-size: 4rem;
		}

		.card-number {
			font-size: 2.5rem;
		}
	}
</style>
