<script lang="ts">
	/**
	 * Motion Demo
	 *
	 * Comprehensive examples of all motion features using
	 * Svelte 5 runes, attachments, and the new type-safe context API
	 */

	import {
		// Attachments
		motion,
		layout,
		presence,
		draggable,
		// Hooks
		useAnimate,
		useInView,
		useReducedMotion,
		useMotionValue,
		useTransform,
		useSpring,
		useScroll,
		// Animation
		animate
	} from '../index.js';
	import AnimatePresence from '../components/AnimatePresence.svelte';
	import LayoutGroup from '../components/LayoutGroup.svelte';
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

	// Hooks demo
	let animateScope: HTMLElement;
	const animateFn = useAnimate(() => animateScope);

	let inViewElement: HTMLElement;
	const isInView = useInView(() => inViewElement, { once: true, amount: 0.5 });

	const prefersReduced = useReducedMotion();

	// Motion values with spring
	const x = useMotionValue(0);
	const springX = useSpring(x, { stiffness: 300, damping: 20 });
	const opacity = useTransform(x, [-100, 0, 100], [0, 1, 0]);

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

	// Imperative animation handler
	async function handleAnimateClick() {
		await animateFn('.animate-box', { x: 100, rotate: 180 });
		await animateFn('.animate-box', { x: 0, rotate: 0 });
	}
</script>

<MotionConfig
	transition={{ type: 'spring', stiffness: 300, damping: 20 }}
	reducedMotion={prefersReduced.current ? 'always' : 'user'}
>
	<div class="demo-container">
		<h1>Motion for Svelte 5 - Demo</h1>
		<p class="subtitle">
			Using Svelte 5 runes, attachments, and type-safe createContext API
		</p>

		<!-- Reduced Motion Indicator -->
		{#if prefersReduced.current}
			<div class="notice">
				Reduced motion is enabled. Animations will be instant.
			</div>
		{/if}

		<!-- Scroll Progress Bar -->
		<div
			class="progress-bar"
			style:transform="scaleX({scrollYProgress.current})"
		/>

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

		<!-- Exit Animations with AnimatePresence -->
		<section>
			<h2>Exit Animations</h2>
			<button onclick={() => (show = !show)}>Toggle</button>

			<AnimatePresence>
				{#if show}
					<div
						{@attach motion({
							initial: { opacity: 0, scale: 0.8 },
							animate: { opacity: 1, scale: 1 }
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

		<!-- Shared Element Transitions with layoutId -->
		<section>
			<h2>Shared Element Transitions (layoutId)</h2>
			<p class="description">
				Click a card to see it transition to a modal.
				Using <code>layoutId</code> on the layout attachment.
			</p>

			<LayoutGroup id="cards">
				<div class="grid">
					{#each items as item (item.id)}
						{#if selectedId !== item.id}
							<div
								{@attach layout({ layoutId: item.id })}
								{@attach motion({
									whileHover: { backgroundColor: '#3b82f6' }
								})}
								class="card"
								onclick={() => (selectedId = item.id)}
							>
								{item.label}
							</div>
						{/if}
					{/each}
				</div>

				{#if selectedId}
					<div class="modal-overlay" onclick={() => (selectedId = null)}>
						<div
							{@attach layout({ layoutId: selectedId })}
							class="modal"
							onclick={(e) => e.stopPropagation()}
						>
							<h3>{items.find((i) => i.id === selectedId)?.label}</h3>
							<p>This modal shares its layoutId with the card.</p>
							<button onclick={() => (selectedId = null)}>Close</button>
						</div>
					</div>
				{/if}
			</LayoutGroup>
		</section>

		<!-- LayoutGroup for Namespacing -->
		<section>
			<h2>LayoutGroup (Namespacing)</h2>
			<p class="description">
				Two tab bars with the same component but different LayoutGroup IDs.
			</p>

			<div class="tabs-demo">
				<LayoutGroup id="tabs-1">
					<TabBar label="Group 1" />
				</LayoutGroup>

				<LayoutGroup id="tabs-2">
					<TabBar label="Group 2" />
				</LayoutGroup>
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

		<!-- useInView Hook -->
		<section>
			<h2>useInView Hook</h2>
			<div
				bind:this={inViewElement}
				{@attach motion({
					initial: { opacity: 0, y: 50 },
					animate: isInView.current ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }
				})}
				class="box"
			>
				{isInView.current ? 'In view!' : 'Scroll to see me'}
			</div>
		</section>

		<!-- useAnimate Hook (Imperative) -->
		<section>
			<h2>useAnimate Hook (Imperative)</h2>
			<button onclick={handleAnimateClick}>Animate!</button>

			<div bind:this={animateScope} class="animate-scope">
				<div class="box animate-box">
					Controlled imperatively
				</div>
			</div>
		</section>

		<!-- Motion Values with Spring -->
		<section>
			<h2>Motion Values & Spring</h2>
			<input
				type="range"
				min="-100"
				max="100"
				value={x.current}
				oninput={(e) => (x.current = +e.currentTarget.value)}
			/>

			<div class="motion-values-demo">
				<div class="box" style:transform="translateX({x.current}px)">
					Direct: x={x.current.toFixed(0)}
				</div>
				<div class="box spring" style:transform="translateX({springX.current}px)">
					Spring: x={springX.current.toFixed(0)}
				</div>
				<div class="box" style:opacity={opacity.current}>
					Opacity (transformed)
				</div>
			</div>
		</section>

		<!-- Variants with Stagger -->
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

		<!-- Imperative animate() -->
		<section>
			<h2>Imperative animate()</h2>
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

<!-- TabBar Component for LayoutGroup demo -->
{#snippet TabBar({ label }: { label: string })}
	{@const tabs = ['Home', 'About', 'Contact']}
	{@const [activeTab, setActiveTab] = [tabs[0], (t: string) => {}]}
	<div class="tab-bar">
		<span class="tab-label">{label}</span>
		{#each tabs as tab}
			<button
				class="tab"
				class:active={tab === activeTab}
				onclick={() => setActiveTab(tab)}
			>
				{tab}
				{#if tab === activeTab}
					<div {@attach layout({ layoutId: 'indicator' })} class="tab-indicator" />
				{/if}
			</button>
		{/each}
	</div>
{/snippet}

<style>
	.demo-container {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem;
	}

	.subtitle {
		color: #6b7280;
		margin-bottom: 2rem;
	}

	.notice {
		background: #fef3c7;
		border: 1px solid #f59e0b;
		padding: 1rem;
		border-radius: 8px;
		margin-bottom: 2rem;
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

	.description {
		color: #6b7280;
		font-size: 0.9rem;
		margin-bottom: 1rem;
	}

	code {
		background: #f3f4f6;
		padding: 0.2rem 0.4rem;
		border-radius: 4px;
		font-size: 0.85rem;
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

	.box.spring {
		background: #10b981;
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
		padding: 2rem;
		border-radius: 12px;
		min-width: 300px;
		text-align: center;
	}

	.tabs-demo {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.tab-bar {
		display: flex;
		gap: 0.5rem;
		align-items: center;
		padding: 0.5rem;
		background: #f3f4f6;
		border-radius: 8px;
	}

	.tab-label {
		font-weight: 600;
		margin-right: 1rem;
	}

	.tab {
		position: relative;
		padding: 0.5rem 1rem;
		background: transparent;
		border: none;
		cursor: pointer;
	}

	.tab.active {
		color: #6366f1;
	}

	.tab-indicator {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 2px;
		background: #6366f1;
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

	.motion-values-demo {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.animate-scope {
		padding: 1rem;
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
