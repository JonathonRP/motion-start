<script>
	import { Motion, AnimatePresence } from 'motion-start';

	let items = [
		{ id: 1, color: '#FF6B6B', text: 'Item 1' },
		{ id: 2, color: '#4ECDC4', text: 'Item 2' },
		{ id: 3, color: '#45B7D1', text: 'Item 3' },
		{ id: 4, color: '#96CEB4', text: 'Item 4' }
	];

	let presenceAffectsLayout = true;
	let nextId = 5;

	function removeItem(id) {
		items = items.filter((item) => item.id !== id);
	}

	function addItem() {
		const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DFE6E9'];
		items = [
			...items,
			{
				id: nextId,
				color: colors[nextId % colors.length],
				text: `Item ${nextId}`
			}
		];
		nextId++;
	}

	function reset() {
		items = [
			{ id: 1, color: '#FF6B6B', text: 'Item 1' },
			{ id: 2, color: '#4ECDC4', text: 'Item 2' },
			{ id: 3, color: '#45B7D1', text: 'Item 3' },
			{ id: 4, color: '#96CEB4', text: 'Item 4' }
		];
		nextId = 5;
	}
</script>

<div class="app">
	<h1>AnimatePresence — presenceAffectsLayout Demo</h1>

	<div class="controls">
		<label class="checkbox-label">
			<input type="checkbox" bind:checked={presenceAffectsLayout} />
			<span>presenceAffectsLayout</span>
		</label>
		<span class="hint-text">
			{presenceAffectsLayout
				? 'Layout updates during exit animations'
				: 'Layout updates after exit animations complete'}
		</span>
	</div>

	<div class="button-group">
		<button class="btn btn-primary" onclick={addItem}> Add Item </button>
		<button class="btn btn-secondary" onclick={reset}> Reset </button>
	</div>

	<div class="items-container">
		<AnimatePresence {presenceAffectsLayout} list={items.map((item) => ({ key: item.id }))}>
			{#snippet children({ item })}
				{@const data = items.find((i) => i.id === item.key)}
				{#if data}
					<Motion.div
						layout
						initial={{ opacity: 0, x: -100 }}
						animate={{ opacity: 1, x: 0, backgroundColor: data.color }}
						exit={{ opacity: 0, x: 100 }}
						transition={{
							duration: 0.5,
							layout: { duration: 0.3 }
						}}
						class="item-card"
					>
						<div class="item-text">{data.text}</div>
						<button class="remove-btn" onclick={() => removeItem(data.id)}> Remove </button>
					</Motion.div>
				{/if}
			{/snippet}
		</AnimatePresence>
	</div>

	<div class="info">
		<h3>How it works:</h3>
		<ul>
			<li>
				<strong>presenceAffectsLayout=true</strong> (default): Items shift up immediately as an item
				starts exiting. The layout animation happens simultaneously with the exit animation.
			</li>
			<li>
				<strong>presenceAffectsLayout=false</strong>: Items wait to shift up until the exiting
				item's animation completes. The layout is preserved during the exit animation.
			</li>
		</ul>
		<p class="tip">
			💡 <strong>Try this:</strong> Toggle the checkbox and remove items to see the difference in behavior!
		</p>
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
		padding: 2rem;
	}

	.app {
		max-width: 600px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	h1 {
		color: white;
		font-size: 1.75rem;
		font-weight: 700;
		text-align: center;
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
	}

	.controls {
		display: flex;
		align-items: center;
		gap: 1rem;
		background: rgba(255, 255, 255, 0.1);
		backdrop-filter: blur(10px);
		padding: 1rem;
		border-radius: 0.75rem;
		border: 1px solid rgba(255, 255, 255, 0.2);
		flex-wrap: wrap;
	}

	.checkbox-label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		color: white;
		font-weight: 600;
		cursor: pointer;
		user-select: none;
	}

	.checkbox-label input[type='checkbox'] {
		width: 1.25rem;
		height: 1.25rem;
		cursor: pointer;
	}

	.hint-text {
		color: rgba(255, 255, 255, 0.8);
		font-size: 0.875rem;
	}

	.button-group {
		display: flex;
		gap: 0.75rem;
	}

	.btn {
		padding: 0.75rem 1.5rem;
		border: none;
		border-radius: 0.5rem;
		font-weight: 600;
		font-size: 0.9375rem;
		cursor: pointer;
		transition: all 0.2s;
		flex: 1;
	}

	.btn-primary {
		background: #3b82f6;
		color: white;
	}

	.btn-primary:hover {
		background: #2563eb;
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
	}

	.btn-secondary {
		background: rgba(255, 255, 255, 0.2);
		color: white;
		border: 1px solid rgba(255, 255, 255, 0.3);
	}

	.btn-secondary:hover {
		background: rgba(255, 255, 255, 0.3);
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(255, 255, 255, 0.2);
	}

	.items-container {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		min-height: 300px;
	}

	:global(.item-card) {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1rem 1.25rem;
		border-radius: 0.75rem;
		color: white;
		font-weight: 600;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}

	.item-text {
		flex: 1;
		font-size: 1.125rem;
	}

	.remove-btn {
		padding: 0.5rem 1rem;
		background: rgba(255, 255, 255, 0.2);
		color: white;
		border: none;
		border-radius: 0.375rem;
		font-size: 0.875rem;
		cursor: pointer;
		transition: background 0.2s;
		font-weight: 600;
	}

	.remove-btn:hover {
		background: rgba(255, 255, 255, 0.3);
	}

	.info {
		background: white;
		padding: 1.5rem;
		border-radius: 0.75rem;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}

	.info h3 {
		color: #1e293b;
		font-size: 1.125rem;
		margin-bottom: 1rem;
	}

	.info ul {
		list-style: none;
		padding: 0;
		margin-bottom: 1rem;
	}

	.info li {
		color: #475569;
		font-size: 0.9375rem;
		line-height: 1.6;
		margin-bottom: 0.75rem;
		padding-left: 1.5rem;
		position: relative;
	}

	.info li::before {
		content: '•';
		position: absolute;
		left: 0.5rem;
		color: #667eea;
		font-weight: bold;
	}

	.tip {
		background: #f0f9ff;
		border-left: 4px solid #3b82f6;
		padding: 1rem;
		border-radius: 0.5rem;
		color: #1e40af;
		font-size: 0.9375rem;
		line-height: 1.6;
	}

	@media (max-width: 640px) {
		:global(body) {
			padding: 1rem;
		}

		h1 {
			font-size: 1.5rem;
		}

		.controls {
			flex-direction: column;
			align-items: flex-start;
		}

		.info li {
			font-size: 0.875rem;
		}
	}
</style>
