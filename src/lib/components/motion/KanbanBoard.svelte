<script lang="ts">
	import { tick } from "svelte";
	import type { PanInfo } from "$lib/motion-start";
	import { LayoutGroup, Reorder, useDragControls } from "$lib/motion-start";

	type Column = "todo" | "inprogress" | "done";
	type Card = { id: number; title: string };

	let columns = $state<{ id: Column; label: string; cards: Card[] }[]>([
		{
			id: "todo",
			label: "Todo",
			cards: [
				{ id: 1, title: "Design mockups" },
				{ id: 2, title: "Write tests" },
			],
		},
		{
			id: "inprogress",
			label: "In Progress",
			cards: [
				{ id: 3, title: "Implement feature" },
				{ id: 4, title: "Code review" },
			],
		},
		{
			id: "done",
			label: "Done",
			cards: [{ id: 5, title: "Deploy to staging" }],
		},
	]);

	// One DragControls per card — survives reparenting and carries the live session.
	const cardIds = [1, 2, 3, 4, 5];
	const controls = new Map(cardIds.map((id) => [id, useDragControls()]));
	function ctrl(id: number) {
		if (!controls.has(id)) controls.set(id, useDragControls());
		return controls.get(id)!;
	}

	let draggingId = $state<number | null>(null);
	let isReparenting = false;

	const cardEls: Record<number, HTMLElement | null> = {};

	function getColumnFromPoint(x: number, y: number): Column | null {
		const els = document.elementsFromPoint(x, y);
		const el = els.find((e) => e.hasAttribute("data-column"));
		return (el?.getAttribute("data-column") as Column) ?? null;
	}

	function getInsertIndex(
		colId: Column,
		y: number,
		excludeId: number,
	): number {
		const col = columns.find((c) => c.id === colId)!;
		const cards = col.cards.filter((c) => c.id !== excludeId);
		for (let i = 0; i < cards.length; i++) {
			const el = cardEls[cards[i].id];
			if (!el) continue;
			const { top, height } = el.getBoundingClientRect();
			if (y < top + height / 2) return i;
		}
		return cards.length;
	}

	async function handleDrag(
		card: Card,
		srcColId: Column,
		event: MouseEvent | TouchEvent | PointerEvent,
		_info: PanInfo,
	) {
		if (isReparenting) return;

		// getColumnFromPoint / getInsertIndex use document.elementsFromPoint + getBoundingClientRect
		// which operate in viewport (client) coordinates.
		const clientX = (event as PointerEvent).clientX;
		const clientY = (event as PointerEvent).clientY;

		const targetCol = getColumnFromPoint(clientX, clientY);
		if (!targetCol || targetCol === srcColId) return;

		isReparenting = true;

		const src = columns.find((c) => c.id === srcColId)!;
		const dst = columns.find((c) => c.id === targetCol)!;
		const insertIdx = getInsertIndex(targetCol, clientY, card.id);
		src.cards = src.cards.filter((c) => c.id !== card.id);
		const newCards = [...dst.cards];
		newCards.splice(insertIdx, 0, card);
		dst.cards = newCards;

		// Wait for old Reorder.Item to unmount (snapshot saved automatically) and
		// new one to mount (gesture resumed automatically via pendingResume).
		await tick();

		isReparenting = false;
	}

	function handleDragStart(card: Card) {
		draggingId = card.id;
	}

	function handleDragEnd() {
		draggingId = null;
		isReparenting = false;
	}
</script>

<LayoutGroup>
	<div
		class="flex flex-row gap-3 p-4 bg-gray-800 rounded-xl w-full overflow-x-auto"
	>
		{#each columns as col (col.id)}
			<div
				data-column={col.id}
				class="rounded-lg p-3 flex flex-col gap-2 min-h-48 w-44 shrink-0 bg-gray-700"
			>
				<h3
					class="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1"
				>
					{col.label}
					<span class="ml-1 text-gray-500">({col.cards.length})</span>
				</h3>

				<Reorder.Group
					as="div"
					axis="y"
					values={col.cards}
					onReorder={(v) => {
						col.cards = v;
					}}
					class="flex flex-col gap-2 min-h-6"
				>
					{#snippet children({ item: card })}
						<Reorder.Item
							as="div"
							value={card}
							layoutId="card-{card.id}"
							layout={true}
							drag={true}
							dragControls={ctrl(card.id)}
							dragListener={false}
							whileDrag={{
								rotate: 3,
								zIndex: 50,
								cursor: "grabbing",
							}}
							onDragStart={() => handleDragStart(card)}
							onDrag={(e, info) =>
								handleDrag(card, col.id, e, info)}
							onDragEnd={() => handleDragEnd()}
							class="bg-gray-600 rounded-md p-2 select-none flex items-center gap-2 text-sm text-white"
							ref={(el) => {
								cardEls[card.id] = el as HTMLElement | null;
							}}
						>
							<div
								class="text-gray-400 hover:text-white shrink-0 touch-none"
								style="cursor: {draggingId === card.id
									? 'grabbing'
									: 'grab'}"
								role="button"
								tabindex="-1"
								onpointerdown={(e) => {
									e.preventDefault();
									draggingId = card.id;
									ctrl(card.id).start(e);
								}}
							>
								<svg
									width="10"
									height="14"
									viewBox="0 0 10 14"
									fill="currentColor"
									aria-hidden="true"
								>
									<circle cx="2.5" cy="2" r="1.5" />
									<circle cx="7.5" cy="2" r="1.5" />
									<circle cx="2.5" cy="6" r="1.5" />
									<circle cx="7.5" cy="6" r="1.5" />
									<circle cx="2.5" cy="10" r="1.5" />
									<circle cx="7.5" cy="10" r="1.5" />
								</svg>
							</div>
							<span class="truncate leading-snug"
								>{card.title}</span
							>
						</Reorder.Item>
					{/snippet}
				</Reorder.Group>
			</div>
		{/each}
	</div>
</LayoutGroup>
