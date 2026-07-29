<script lang="ts">
	import { LayoutGroup, Reorder, type PanInfo } from "motion-start";
	import { tick } from "svelte";
	import type { Attachment } from "svelte/attachments";

	/*
	 * A kanban board is the honest test of a reorder list: a card has to keep its
	 * identity while moving between two independent groups. `layoutId` is what
	 * carries that identity across, so both groups agree they are holding the
	 * same card rather than two lookalikes.
	 *
	 * Reorder handles the within-column case on its own. Everything below exists
	 * only to answer "which column, and which slot" while a card is in the air.
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

	// Where the dragged card would land if it were dropped right now. Null while
	// the card is still over its own column, which is Reorder's business.
	let preview = $state<{ column: ColumnId | null; index: number | null }>({ column: null, index: null });
	let draggingId = $state<string | null>(null);
	let draggingFrom = $state<ColumnId | null>(null);
	let announcement = $state("");

	let columnRefs = $state<Record<ColumnId, HTMLElement | null>>({
		scheming: null,
		"in-motion": null,
		conquered: null,
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

	function hasCrossColumnPreview() {
		return Boolean(draggingId && draggingFrom && preview.column && preview.column !== draggingFrom && preview.index !== null);
	}

	/*
	 * While a card hovers over another column it renders *there* rather than in
	 * the column it still belongs to, and its neighbours shuffle down to open a
	 * slot. Nothing is committed until the drop, so an abandoned drag needs no
	 * undo — the preview simply stops being true.
	 */
	function rendersIn(card: Card, column: ColumnId) {
		if (hasCrossColumnPreview() && card.id === draggingId) return preview.column === column;
		return card.column === column;
	}

	function renderOrder(card: Card) {
		if (!hasCrossColumnPreview()) return card.order;
		if (card.id === draggingId) return preview.index as number;
		if (card.column === preview.column && card.order >= (preview.index as number)) return card.order + 1;
		return card.order;
	}

	/** The cards a dragged card could be dropped between, top to bottom. */
	function slotsIn(column: ColumnId) {
		return inColumn(column)
			.filter((card) => card.id !== draggingId)
			.map((card) => document.getElementById(`villain-card-${card.id}`))
			.filter((element): element is HTMLElement => element !== null)
			.map((element) => element.getBoundingClientRect())
			.sort((a, b) => a.top - b.top);
	}

	function slotIndexAt(column: ColumnId, y: number) {
		const slots = slotsIn(column);
		for (let i = 0; i < slots.length; i++) {
			if (y < slots[i].top + slots[i].height / 2) return i;
		}
		return slots.length;
	}

	/*
	 * `Reorder.Group` keys its list by the item itself, so these mutate cards in
	 * place rather than mapping to fresh objects. Replacing the objects would
	 * change every key at once, tearing down and rebuilding the whole list on a
	 * drag tick — which is also exactly the identity `layoutId` needs to keep.
	 * `$state` is deeply reactive, so assigning to a field is enough.
	 */
	function reindex(ordered: Card[]) {
		ordered.forEach((card, index) => {
			card.order = index;
		});
	}

	function move(cardId: string, from: ColumnId, to: ColumnId, index: number) {
		const dragged = cards.find((card) => card.id === cardId);
		if (!dragged || from === to) return;

		reindex(inColumn(from).filter((card) => card.id !== cardId));

		const target = inColumn(to);
		target.splice(Math.min(Math.max(index, 0), target.length), 0, dragged);
		dragged.column = to;
		reindex(target);
	}

	function handleDrag(card: Card, info: PanInfo) {
		const source = draggingFrom ?? card.column;
		const x = info.point.x - window.scrollX;
		const y = info.point.y - window.scrollY;

		for (const column of COLUMNS) {
			const element = columnRefs[column];
			if (!element || column === source) continue;
			const box = element.getBoundingClientRect();
			if (x < box.left || x > box.right || y < box.top || y > box.bottom) continue;

			const index = slotIndexAt(column, y);
			if (preview.column !== column || preview.index !== index) preview = { column, index };
			return;
		}

		if (preview.column !== null) preview = { column: null, index: null };
	}

	function handleDrop(cardId: string) {
		if (hasCrossColumnPreview()) {
			move(cardId, draggingFrom as ColumnId, preview.column as ColumnId, preview.index as number);
		}
		preview = { column: null, index: null };
		draggingId = null;
		draggingFrom = null;
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
			const reordered = [...siblings];
			reordered.splice(next, 0, ...reordered.splice(index, 1));
			reindex(reordered);
			announcement = `${card.title}, position ${next + 1} of ${siblings.length} in ${LABELS[card.column]}`;
		} else {
			const target = COLUMNS[COLUMNS.indexOf(card.column) + (event.key === "ArrowLeft" ? -1 : 1)];
			if (!target) return;
			const next = Math.min(index, inColumn(target).length);
			move(card.id, card.column, target, next);
			announcement = `${card.title}, moved to ${LABELS[target]}, position ${next + 1}`;
		}

		await tick();
		document.getElementById(`villain-card-${card.id}`)?.focus();
	}

	// Cross-column preview isn't a value Reorder tracks, so hand it to layout as
	// an explicit dependency — otherwise the neighbours opening a slot would jump.
	const layoutDependency = $derived(draggingId ? `${draggingId}:${preview.column}:${preview.index}` : "");
</script>

<div class="w-full overflow-x-auto">
	<p class="sr-only" aria-live="polite">{announcement}</p>

	<LayoutGroup>
		<div class="flex min-w-max items-start gap-3">
			{#each COLUMNS as column (column)}
				<div
					class="flex w-52 flex-col rounded-xl border border-border bg-background-alt p-2.5"
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
						as="div"
						role="list"
						aria-label={LABELS[column]}
						values={cards}
						onReorder={(next: Card[]) => {
							if (hasCrossColumnPreview()) return;
							reindex(next.filter((card) => card.column === column));
						}}
						class="flex min-h-24 flex-col gap-2"
					>
						{#snippet children({ item: card }: { item: Card })}
							{#if rendersIn(card, column)}
								<Reorder.Item
									as="div"
									id={`villain-card-${card.id}`}
									value={card}
									layoutId={card.id}
									{layoutDependency}
									drag
									style={{ order: renderOrder(card) }}
									role="listitem"
									tabindex="0"
									aria-roledescription="draggable card"
									aria-label={`${card.title}, position ${card.order + 1} in ${LABELS[card.column]}`}
									aria-keyshortcuts="ArrowUp ArrowDown ArrowLeft ArrowRight"
									onkeydown={(event: KeyboardEvent) => handleKeydown(event, card)}
									onDragStart={() => {
										draggingId = card.id;
										draggingFrom = card.column;
									}}
									onDrag={(_event: PointerEvent, info: PanInfo) => handleDrag(card, info)}
									onDragEnd={() => handleDrop(card.id)}
									whileDrag={{ scale: 1.04, rotate: -1.5, zIndex: 10, cursor: "grabbing" }}
									transition={{ type: "spring", stiffness: 380, damping: 32 }}
									class="cursor-grab rounded-lg border border-border bg-background px-2.5 py-2 text-[0.8rem] leading-snug select-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:outline-none"
								>
									{card.title}
								</Reorder.Item>
							{/if}
						{/snippet}
					</Reorder.Group>
				</div>
			{/each}
		</div>
	</LayoutGroup>
</div>
