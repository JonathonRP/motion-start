<script lang="ts">
	import { LayoutGroup, motion } from "motion-start";

	type Mode = "sync" | "deferred" | "during";
	type Item = { id: string; label: string; column: number };

	const MODES: Mode[] = ["sync", "deferred", "during"];

	const items = $state<Record<Mode, Item[]>>({
		sync: [{ id: "sync", label: "commit on dragEnd", column: 0 }],
		deferred: [{ id: "deferred", label: "dragEnd + setTimeout", column: 0 }],
		during: [{ id: "during", label: "commit during drag", column: 0 }],
	});

	let columnEls = $state<Record<string, HTMLElement | null>>({});

	function columnAt(mode: Mode, x: number, y: number) {
		for (const col of [0, 1]) {
			const el = columnEls[`${mode}-${col}`];
			if (!el) continue;
			const box = el.getBoundingClientRect();
			if (x >= box.left && x <= box.right && y >= box.top && y <= box.bottom) return col;
		}
		return null;
	}

	function commit(mode: Mode, item: Item, x: number, y: number) {
		const target = columnAt(mode, x, y);
		if (target !== null && target !== item.column) item.column = target;
	}
</script>

<div class="wrap">
	<p>
		Drag a card into the other column. It should carry on from where the pointer
		left it rather than snapping back to its old slot first.
	</p>
	{#each MODES as mode (mode)}
		<h2>{mode}</h2>
		<LayoutGroup>
			<div class="board">
				{#each [0, 1] as col (col)}
					<div class="col" bind:this={columnEls[`${mode}-${col}`]} data-col={col}>
						{#each items[mode].filter((i) => i.column === col) as item (item.id)}
							<motion.div
								id={`card-${item.id}`}
								layoutId={item.id}
								drag
								dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
								dragElastic={1}
								transition={{ type: "spring", stiffness: 380, damping: 32 }}
								class="card"
								onDrag={(_e: PointerEvent, info: { point: { x: number; y: number } }) => {
									if (mode !== "during") return;
									commit(mode, item, info.point.x - window.scrollX, info.point.y - window.scrollY);
								}}
								onDragEnd={(event: PointerEvent) => {
									if (mode === "during") return;
									const x = event.clientX;
									const y = event.clientY;
									if (mode === "sync") commit(mode, item, x, y);
									else setTimeout(() => commit(mode, item, x, y), 0);
								}}
							>
								{item.label}
							</motion.div>
						{/each}
					</div>
				{/each}
			</div>
		</LayoutGroup>
	{/each}
</div>

<style>
	.wrap {
		padding: 2rem;
		font-family: system-ui, sans-serif;
	}
	h2 {
		font-size: 0.9rem;
		margin: 0 0 0.5rem;
	}
	.board {
		display: flex;
		gap: 1rem;
		margin-bottom: 2rem;
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
		text-align: left;
	}
</style>
