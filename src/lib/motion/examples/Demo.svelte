<script lang="ts">
	/**
	 * Motion Demo
	 *
	 * Comprehensive examples of all motion features
	 */

	import {
		motion,
		layout,
		presence,
		draggable,
		sharedLayout,
		motionValue,
		motionTransform,
		useScroll,
		animate
	} from '../index.js';
	import AnimatePresence from '../components/AnimatePresence.svelte';
	import SharedLayoutProvider from '../components/SharedLayoutProvider.svelte';
	import MotionConfig from '../components/MotionConfig.svelte';

	// Basic animation state
	let show = $state(true);
	let expanded = $state(false);
	let selectedId = $state<string | null>(null);

	// Items for list demo
	let items = $state([
		{ id: '1', label: 'Item 1' },
		{ id: '2', label: 'Item 2' },
		{ id: '3', label: 'Item 3' }
	]);

	// Motion values for advanced control
	const x = motionValue(0);
	const opacity = motionTransform(x, [-100, 0, 100], [0, 1, 0]);

	// Scroll tracking
	const { scrollYProgress } = useScroll();

	// Variants for complex animations
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				delayChildren: 0.3,
				staggerChildren: 0.1
			}
		}
	};

	const itemVariants = {
		hidden: { y: 20, opacity: 0 },
		visible: { y: 0, opacity: 1 }
	};
</script>

<MotionConfig transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
	<div class="demo-container">
		<h1>Motion for Svelte 5 - Demo</h1>

		<!-- Basic Animation -->
		<section>
			<h2>Basic Animation</h2>
			<div
				{@attach motion({
					initial: { opacity: 0, y: 20 },
					animate: { opacity: 1, y: 0 },
					transition: { duration: 0.5 }
				})}
				class="box"
			>
				Fade In
			</div>
		</section>

		<!-- Gesture Animations -->
		<section>
			<h2>Gesture Animations</h2>
			<div
				{@attach motion({
					whileHover: { scale: 1.1 },
					whileTap: { scale: 0.95 },
					transition: { type: 'spring', stiffness: 400 }
				})}
				class="box interactive"
			>
				Hover & Tap Me
			</div>
		</section>

		<!-- Exit Animations -->
		<section>
			<h2>Exit Animations</h2>
			<button onclick={() => (show = !show)}>Toggle</button>

			<AnimatePresence>
				{#if show}
					<div
						{@attach motion({
							initial: { opacity: 0, scale: 0.8 },
							animate: { opacity: 1, scale: 1 },
							exit: { opacity: 0, scale: 0.8, y: 20 }
						})}
						{@attach presence({
							exit: { opacity: 0, scale: 0.8, y: 20 },
							transition: { duration: 0.2 }
						})}
						class="box"
					>
						I animate out!
					</div>
				{/if}
			</AnimatePresence>
		</section>

		<!-- Layout Animations -->
		<section>
			<h2>Layout Animations</h2>
			<button onclick={() => (expanded = !expanded)}>
				{expanded ? 'Collapse' : 'Expand'}
			</button>

			<div {@attach layout()} class="box" class:expanded>
				Layout changes animate automatically
			</div>
		</section>

		<!-- Draggable -->
		<section>
			<h2>Draggable</h2>
			<div
				{@attach motion({
					whileDrag: { scale: 1.1 }
				})}
				{@attach draggable({
					drag: true,
					dragConstraints: { top: -50, bottom: 50, left: -100, right: 100 },
					dragElastic: 0.2
				})}
				class="box draggable"
			>
				Drag Me
			</div>
		</section>

		<!-- Shared Layout -->
		<section>
			<h2>Shared Layout Transitions</h2>
			<SharedLayoutProvider>
				<div class="grid">
					{#each items as item (item.id)}
						<div
							{@attach sharedLayout({ layoutId: item.id })}
							{@attach motion({
								whileHover: { backgroundColor: '#3b82f6' }
							})}
							class="card"
							onclick={() => (selectedId = item.id)}
						>
							{item.label}
						</div>
					{/each}
				</div>

				{#if selectedId}
					<div class="modal-overlay" onclick={() => (selectedId = null)}>
						<div
							{@attach sharedLayout({ layoutId: selectedId })}
							class="modal"
							onclick={(e) => e.stopPropagation()}
						>
							{items.find((i) => i.id === selectedId)?.label}
							<button onclick={() => (selectedId = null)}>Close</button>
						</div>
					</div>
				{/if}
			</SharedLayoutProvider>
		</section>

		<!-- Variants -->
		<section>
			<h2>Variants & Stagger</h2>
			<div
				{@attach motion({
					initial: 'hidden',
					animate: 'visible',
					variants: containerVariants
				})}
				class="stagger-container"
			>
				{#each [1, 2, 3, 4] as i}
					<div
						{@attach motion({
							variants: itemVariants
						})}
						class="stagger-item"
					>
						Item {i}
					</div>
				{/each}
			</div>
		</section>

		<!-- Scroll Progress -->
		<section>
			<h2>Scroll Progress</h2>
			<div class="progress-bar" style:transform="scaleX({scrollYProgress.current})" />
		</section>

		<!-- Motion Values -->
		<section>
			<h2>Motion Values</h2>
			<input type="range" min="-100" max="100" value={x.current} oninput={(e) => x.set(+e.currentTarget.value)} />
			<div class="box" style:opacity={opacity.current} style:transform="translateX({x.current}px)">
				Controlled by MotionValue
			</div>
		</section>

		<!-- Imperative Animation -->
		<section>
			<h2>Imperative Animation</h2>
			<button
				onclick={() => {
					animate(0, 360, {
						duration: 1,
						onUpdate: (v) => {
							const el = document.querySelector('.spin-box') as HTMLElement;
							if (el) el.style.transform = `rotate(${v}deg)`;
						}
					});
				}}
			>
				Spin!
			</button>
			<div class="box spin-box">Spin Me</div>
		</section>
	</div>
</MotionConfig>

<style>
	.demo-container {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem;
	}

	section {
		margin: 3rem 0;
		padding: 1.5rem;
		border: 1px solid #e5e7eb;
		border-radius: 8px;
	}

	h2 {
		margin-top: 0;
		color: #374151;
	}

	.box {
		width: 150px;
		height: 100px;
		background: #6366f1;
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 8px;
		font-weight: 500;
		text-align: center;
		padding: 1rem;
	}

	.box.interactive {
		cursor: pointer;
		user-select: none;
	}

	.box.draggable {
		cursor: grab;
	}

	.box.draggable:active {
		cursor: grabbing;
	}

	.box.expanded {
		width: 300px;
		height: 200px;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1rem;
	}

	.card {
		padding: 2rem;
		background: #e5e7eb;
		border-radius: 8px;
		cursor: pointer;
		text-align: center;
	}

	.modal-overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 100;
	}

	.modal {
		background: white;
		padding: 3rem;
		border-radius: 12px;
		min-width: 300px;
		text-align: center;
	}

	.stagger-container {
		display: flex;
		gap: 1rem;
	}

	.stagger-item {
		width: 80px;
		height: 80px;
		background: #10b981;
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 8px;
	}

	.progress-bar {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		height: 4px;
		background: #6366f1;
		transform-origin: left;
		z-index: 1000;
	}

	button {
		padding: 0.5rem 1rem;
		background: #3b82f6;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		margin-bottom: 1rem;
	}

	button:hover {
		background: #2563eb;
	}

	input[type='range'] {
		width: 100%;
		margin-bottom: 1rem;
	}
</style>
