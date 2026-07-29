<script lang="ts">
	import { AnimatePresence, LayoutGroup, motion } from "motion-start";

	/*
	 * The same handover as `/shared-drag`, but with an `AnimatePresence`
	 * ancestor - which is what a page-transition wrapper looks like from a
	 * card's point of view.
	 */

	type Item = { id: string; label: string; column: number };

	const items = $state<Item[]>([{ id: "card", label: "drag me across", column: 0 }]);

	let columnEls = $state<Record<number, HTMLElement | null>>({});

	function columnAt(x: number, y: number) {
		for (const col of [0, 1]) {
			const el = columnEls[col];
			if (!el) continue;
			const box = el.getBoundingClientRect();
			if (x >= box.left && x <= box.right && y >= box.top && y <= box.bottom) return col;
		}
		return null;
	}
</script>

<div class="wrap">
	<AnimatePresence>
		{#key "board"}
			<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
				<LayoutGroup>
					<div class="board">
						{#each [0, 1] as col (col)}
							<div class="col" bind:this={columnEls[col]} data-col={col}>
								{#each items.filter((i) => i.column === col) as item (item.id)}
									<motion.div
										id={`card-${item.id}`}
										layout
										layoutId={item.id}
										drag
										dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
										dragElastic={1}
										whileDrag={{ scale: 1.04, rotate: -1.5, zIndex: 10 }}
										transition={{ type: "spring", stiffness: 380, damping: 32 }}
										class="card"
										onDragEnd={(event: PointerEvent) => {
											const target = columnAt(event.clientX, event.clientY);
											if (target !== null && target !== item.column) item.column = target;
										}}
									>
										{item.label}
									</motion.div>
								{/each}
							</div>
						{/each}
					</div>
				</LayoutGroup>
			</motion.div>
		{/key}
	</AnimatePresence>
</div>

<style>
	.wrap {
		padding: 2rem;
		font-family: system-ui, sans-serif;
	}
	.board {
		display: flex;
		gap: 1rem;
	}
	.col {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		width: 12rem;
		min-height: 5rem;
		padding: 0.5rem;
		border: 1px solid #ccc;
		border-radius: 0.5rem;
	}
	.board :global(.card) {
		padding: 0.5rem 0.75rem;
		border: 1px solid #888;
		border-radius: 0.375rem;
		background: #fff;
		cursor: grab;
		user-select: none;
	}
</style>
