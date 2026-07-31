<script lang="ts">
	import { Reorder, type PanInfo } from "motion-start";
	import { onMount, tick } from "svelte";
	import type { Attachment } from "svelte/attachments";

	/*
	 * A kanban board combines two jobs. Reorder owns the order inside each
	 * column, while `layoutId` carries a card's identity across columns so both
	 * lists agree they are handing off the same card rather than two lookalikes.
	 *
	 * Cards still drag freely in two dimensions. Reorder responds while the
	 * pointer stays in the source column; `layoutId` hands the active gesture
	 * to the target column as soon as the pointer crosses over.
	 */

	const COLUMNS = ["scheming", "in-motion", "conquered"] as const;
	type ColumnId = (typeof COLUMNS)[number];

	type Card = { id: string; title: string; column: ColumnId; order: number };

	const LABELS: Record<ColumnId, string> = {
		scheming: "Scheming",
		"in-motion": "In motion",
		conquered: "Conquered",
	};

	const ACCENTS: Record<ColumnId, string> = {
		scheming: "#7f8cf5",
		"in-motion": "oklch(70% 0.19 328)",
		conquered: "#cdd97f",
	};

	let cards = $state<Card[]>([
		{ id: "glowing-rock", title: "Acquire the last glowing rock", column: "scheming", order: 0 },
		{ id: "blot-out-sun", title: "Blot out the sun (Q3 stretch goal)", column: "scheming", order: 1 },
		{ id: "monologue", title: "Rehearse the monologue", column: "scheming", order: 2 },
		{ id: "rebrand", title: 'Rebrand "world domination" as "synergy"', column: "scheming", order: 3 },
		{ id: "doomsday-device", title: "Assemble the doomsday device", column: "in-motion", order: 0 },
		{ id: "bribe-parliament", title: "Bribe a small European parliament", column: "in-motion", order: 1 },
		{ id: "henchmen", title: "Interview henchmen (round four)", column: "in-motion", order: 2 },
		{ id: "volcano", title: "Buy a dormant volcano", column: "conquered", order: 0 },
		{ id: "betrayal", title: "Betray my business partner", column: "conquered", order: 1 },
	]);

	// The column the dragged card is being previewed over, or `null` while no
	// cross-column preview is active. This is distinct from a card's
	// *committed* `column`/`order` fields: hovering another column only
	// changes which group renders the card and where it visually sits, it
	// isn't written back to the card until the pointer is released.
	let previewColumn = $state<ColumnId | null>(null);
	// The card's desired position within `previewColumn`, expressed as a
	// half-index (e.g. `1.5`) so it always sorts strictly between two
	// existing committed `order` values without colliding with either.
	let previewOrder = $state(0);
	let draggingId = $state<string | null>(null);
	let announcement = $state("");
	let ready = $state(false);

	let columnRefs = $state<Record<ColumnId, HTMLElement | null>>({
		scheming: null,
		"in-motion": null,
		conquered: null,
	});

	onMount(() => {
		ready = true;
	});

	function captureColumn(column: ColumnId): Attachment<HTMLElement> {
		return (element) => {
			columnRefs[column] = element;
			return () => {
				if (columnRefs[column] === element) columnRefs[column] = null;
			};
		};
	}

	const byOrder = (a: Card, b: Card) => a.order - b.order;
	const inColumn = (column: ColumnId) => cards.filter((card) => card.column === column).sort(byOrder);

	function columnAt(x: number, y: number) {
		for (const column of COLUMNS) {
			const element = columnRefs[column];
			if (!element) continue;
			const box = element.getBoundingClientRect();
			if (x >= box.left && x <= box.right && y >= box.top && y <= box.bottom) return column;
		}
		return null;
	}

	/** Which slot in `column` the pointer sits in, ignoring the card in the air. */
	function slotIndexAt(column: ColumnId, cardId: string, y: number) {
		const boxes = inColumn(column)
			.filter((card) => card.id !== cardId)
			.map((card) => document.getElementById(`villain-card-${card.id}`))
			.filter((element): element is HTMLElement => element !== null)
			.map((element) => element.getBoundingClientRect())
			.sort((a, b) => a.top - b.top);

		for (let i = 0; i < boxes.length; i++) {
			if (y < boxes[i].top + boxes[i].height / 2) return i;
		}
		return boxes.length;
	}

	/*
	 * Cards are mutated in place rather than replaced. `layoutId` is keyed off
	 * the card's id, but the `{#each}` is keyed off the object, so swapping in
	 * fresh objects would tear every card down at once and there would be
	 * nothing left to animate.
	 */
	function reindex(ordered: Card[], column?: ColumnId) {
		const visible = column ? ordered.filter((card) => card.column === column) : ordered;
		visible.forEach((card, index) => {
			card.order = index;
		});
	}

	function move(cardId: string, to: ColumnId, index: number) {
		const dragged = cards.find((card) => card.id === cardId);
		if (!dragged) return;

		const from = dragged.column;
		const remaining = inColumn(from).filter((card) => card.id !== cardId);
		const target = from === to ? remaining : inColumn(to);

		target.splice(Math.min(Math.max(index, 0), target.length), 0, dragged);
		dragged.column = to;

		if (from !== to) reindex(remaining);
		reindex(target);
	}

	/**
	 * Which column should currently render `card`: its committed `column`
	 * while idle or being dragged within its own column, or `previewColumn`
	 * while it's the actively-dragged card and the pointer is hovering a
	 * *different* column. Every `Reorder.Group` shares the same full `cards`
	 * array and gates rendering with this, rather than each group filtering
	 * `values` down to its own slice.
	 */
	function renderColumn(card: Card): ColumnId {
		return draggingId === card.id && previewColumn ? previewColumn : card.column;
	}

	/**
	 * `values={cards}` is the same array reference for every column, so each
	 * column's visible slot order follows `cards`' own relative ordering of
	 * its members. Re-sort it (in place - individual Card objects are never
	 * replaced) after any change to committed order/column or to the live
	 * preview position, so what's rendered always matches the intended order.
	 */
	function resortCards() {
		cards.sort((a, b) => {
			const columnOf = (card: Card) => (draggingId === card.id && previewColumn ? previewColumn : card.column);
			const orderOf = (card: Card) => (draggingId === card.id && previewColumn ? previewOrder : card.order);
			const columnDelta = COLUMNS.indexOf(columnOf(a)) - COLUMNS.indexOf(columnOf(b));
			return columnDelta || orderOf(a) - orderOf(b);
		});
	}

	function handleDrag(card: Card, _event: PointerEvent, info: PanInfo) {
		// `onDragStart` runs in postRender, while the first threshold-breaking
		// `onDrag` can already be over another column.
		if (!draggingId) draggingId = card.id;

		const x = info.point.x - window.scrollX;
		const y = info.point.y - window.scrollY;
		const column = columnAt(x, y);

		if (!column || column === card.column) {
			if (previewColumn !== null) {
				previewColumn = null;
				resortCards();
			}
			return;
		}

		if (previewColumn !== column) {
			previewColumn = column;
			// Open the target insertion slot: sort just ahead of whichever
			// existing card in `column` the pointer currently sits above.
			previewOrder = slotIndexAt(column, card.id, y) - 0.5;
			resortCards();
		}
	}

	function handleDrop(card: Card, info: PanInfo) {
		const x = info.point.x - window.scrollX;
		const y = info.point.y - window.scrollY;
		const column = columnAt(x, y);

		// Reorder has already committed moves within the source column. Only
		// re-parent here; doing both would reorder the same drop twice.
		if (column && column !== card.column) {
			move(card.id, column, slotIndexAt(column, card.id, y));
		}

		previewColumn = null;
		draggingId = null;
		resortCards();
	}

	function handleColumnReorder(column: ColumnId, next: Card[]) {
		if (previewColumn !== null) {
			// Only the group rendering the preview may move its insertion slot.
			if (previewColumn !== column || !draggingId) return;

			const previewIndex = next.findIndex((card) => card.id === draggingId);
			if (previewIndex !== -1) {
				previewOrder = previewIndex - 0.5;
				resortCards();
			}
			return;
		}

		reindex(next, column);
		resortCards();
	}

	/*
	 * Drag is a mouse gesture, so the same moves are bound to the arrow keys.
	 * Layout animations are indifferent to what caused the change, which means
	 * the keyboard path animates identically for free.
	 */
	async function handleKeydown(event: KeyboardEvent, card: Card) {
		if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) return;
		event.preventDefault();

		const siblings = inColumn(card.column);
		const index = siblings.findIndex((item) => item.id === card.id);
		if (index === -1) return;

		if (event.key === "ArrowUp" || event.key === "ArrowDown") {
			const next = Math.min(Math.max(index + (event.key === "ArrowUp" ? -1 : 1), 0), siblings.length - 1);
			if (next === index) return;
			move(card.id, card.column, next);
			announcement = `${card.title}, position ${next + 1} of ${siblings.length} in ${LABELS[card.column]}`;
		} else {
			const target = COLUMNS[COLUMNS.indexOf(card.column) + (event.key === "ArrowLeft" ? -1 : 1)];
			if (!target) return;
			const next = Math.min(index, inColumn(target).length);
			move(card.id, target, next);
			announcement = `${card.title}, moved to ${LABELS[target]}, position ${next + 1}`;
		}

		resortCards();
		await tick();
		document.getElementById(`villain-card-${card.id}`)?.focus();
	}
</script>

<div class="w-full overflow-x-auto" data-kanban-board data-kanban-ready={ready}>
	<p class="sr-only" aria-live="polite">{announcement}</p>

		<div class="flex min-w-max items-start gap-3">
			{#each COLUMNS as column (column)}
				<div
					data-kanban-column={column}
					class="flex w-52 flex-col rounded-xl border p-2.5 transition-colors duration-150"
					style="border-color: {previewColumn === column && draggingId
						? ACCENTS[column]
						: 'var(--border)'}; background-color: var(--background-alt)"
					{@attach captureColumn(column)}
				>
					<h3
						class="mb-2.5 flex items-baseline justify-between border-t-2 pt-2 font-mono text-[0.7rem] tracking-widest uppercase"
						style="border-color: {ACCENTS[column]}; color: {ACCENTS[column]}"
					>
						{LABELS[column]}
						<span class="text-foreground-alt tabular-nums">{inColumn(column).length}</span>
					</h3>

					<Reorder.Group
						role="list"
						aria-label={LABELS[column]}
						values={cards}
						onReorder={(next: Card[]) => handleColumnReorder(column, next)}
						class="flex min-h-24 flex-col gap-2"
					>
						{#snippet children({ item: card }: { item: Card })}
							{#if renderColumn(card) === column}
								<Reorder.Item
									id={`villain-card-${card.id}`}
									value={card}
									layoutId={card.id}
									drag
									dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
									dragElastic={1}
									role="listitem"
									tabindex="0"
									aria-roledescription="draggable card"
									aria-label={`${card.title}, position ${card.order + 1} in ${LABELS[card.column]}`}
									aria-keyshortcuts="ArrowUp ArrowDown ArrowLeft ArrowRight"
									onkeydown={(event: KeyboardEvent) => handleKeydown(event, card)}
									onDragStart={() => {
										draggingId = card.id;
									}}
									onDrag={(event: PointerEvent, info: PanInfo) => handleDrag(card, event, info)}
									onDragEnd={(_event: PointerEvent, info: PanInfo) => handleDrop(card, info)}
									whileDrag={{ scale: 1.04, rotate: -1.5, zIndex: 10, cursor: "grabbing" }}
									transition={{ type: "spring", stiffness: 380, damping: 32 }}
									class="bg-background border-border cursor-grab rounded-lg border px-2.5 py-2 text-[0.8rem] leading-snug select-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:outline-none"
								>
									{card.title}
								</Reorder.Item>
							{/if}
						{/snippet}
					</Reorder.Group>
				</div>
			{/each}
		</div>
</div>
