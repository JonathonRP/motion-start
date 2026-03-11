<script>
	import { AnimatePresence } from 'motion-start';
	import Card from './Card.svelte';

	let index = 0;
	let exitX = 0;

	const allCards = [
		{ id: 1, color: '#FF6B6B', emoji: '❤️', label: 'Card 1' },
		{ id: 2, color: '#4ECDC4', emoji: '💙', label: 'Card 2' },
		{ id: 3, color: '#45B7D1', emoji: '💚', label: 'Card 3' },
		{ id: 4, color: '#96CEB4', emoji: '💛', label: 'Card 4' },
		{ id: 5, color: '#FFEAA7', emoji: '🧡', label: 'Card 5' },
		{ id: 6, color: '#DFE6E9', emoji: '💜', label: 'Card 6' }
	];

	// Both the front and back card are managed by AnimatePresence.
	// The key is the index, so when index increments:
	//   - key=index exits (front card slides away)
	//   - key=index+1 stays but transitions from back→front animate target
	//   - key=index+2 enters as the new back card
	$: visibleList = [
		{ key: index, isFront: true, ...allCards[index % allCards.length] },
		{ key: index + 1, isFront: false, ...allCards[(index + 1) % allCards.length] }
	];

	function handleDragEnd(_, info) {
		const swipedLeft = info.offset.x < -80 || info.velocity.x < -500;
		const swipedRight = info.offset.x > 80 || info.velocity.x > 500;
		if (swipedLeft) {
			exitX = -300;
			index = index + 1;
		} else if (swipedRight) {
			exitX = 300;
			index = index + 1;
		}
	}

	function reset() {
		index = 0;
		exitX = 0;
	}
</script>

<div class="app">
	<h1>Card Stack Demo</h1>
	<p class="subtitle">Drag the card left or right to dismiss</p>

	<div class="stage">
		<AnimatePresence initial={false} list={visibleList} let:item>
			<Card
				card={item}
				{exitX}
				onDragEnd={item.isFront ? handleDragEnd : undefined}
			/>
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
		touch-action: none;
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

		.card-label {
			font-size: 1.5rem;
		}
	}
</style>
