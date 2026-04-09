<svelte:options runes={true} />

<script lang="ts">
    import { LayoutGroup, Reorder } from "$lib/motion-start";
    import type { PanInfo } from "$lib/motion-start/gestures/pan/PanSession";
    import Box from "../Box.svelte";

    const COLUMN_IDS = ["todo", "inprogress", "done"] as const;
    type ColumnId = (typeof COLUMN_IDS)[number];

    type Card = {
        id: string;
        title: string;
        column: ColumnId;
        order: number;
    };

    type PreviewState = {
        col: ColumnId | null;
        index: number | null;
    };

    const COL_LABELS: Record<ColumnId, string> = {
        todo: "TODO",
        inprogress: "IN PROGRESS",
        done: "DONE",
    };

    const COL_ACCENT: Record<ColumnId, string> = {
        todo: "#4f8ef7",
        inprogress: "#f7a94f",
        done: "#4fca6e",
    };

    let cards = $state<Card[]>([
        {
            id: "fix-bifrost-ci-pipeline",
            title: "Fix Bifrost CI pipeline",
            column: "todo",
            order: 0,
        },
        {
            id: "add-dr-strange-to-on-call",
            title: "Add Dr. Strange to on-call",
            column: "todo",
            order: 1,
        },
        {
            id: "order-pym-particles-bulk",
            title: "Order Pym Particles (bulk)",
            column: "todo",
            order: 2,
        },
        {
            id: "take-over-universe-backlog",
            title: "Take over universe (backlog)",
            column: "todo",
            order: 3,
        },
        {
            id: "stop-thanos-deprioritised",
            title: "Stop Thanos (deprioritised)",
            column: "inprogress",
            order: 0,
        },
        {
            id: "refactor-vibranium-service",
            title: "Refactor Vibranium service",
            column: "inprogress",
            order: 1,
        },
        {
            id: "recruit-loki-he-quit",
            title: "Recruit Loki (he quit)",
            column: "done",
            order: 0,
        },
        {
            id: "i-am-inevitable",
            title: "I am inevitable ✅",
            column: "done",
            order: 1,
        },
    ]);

    let preview = $state<PreviewState>({
        col: null,
        index: null,
    });

    let draggingCardId = $state<string | null>(null);
    let draggingFromCol = $state<ColumnId | null>(null);
    let draggingCardHeight = $state(62);
    let draggingCardWidth = $state(220);

    let colRefs = $state<Record<ColumnId, HTMLElement | null>>({
        todo: null,
        inprogress: null,
        done: null,
    });
    let boardRef = $state<HTMLElement | null>(null);
    let ghostVisible = $state(false);
    let ghostTop = $state(0);
    let ghostLeft = $state(0);

    function sortByOrder(a: Card, b: Card) {
        return a.order - b.order;
    }

    function getCard(cardId: string | null) {
        return cardId
            ? (cards.find((card) => card.id === cardId) ?? null)
            : null;
    }

    function hasCrossColumnPreview() {
        return Boolean(
            draggingCardId &&
                draggingFromCol &&
                preview.col &&
                preview.col !== draggingFromCol &&
                preview.index !== null,
        );
    }

    function getRenderColumn(card: Card) {
        if (hasCrossColumnPreview() && card.id === draggingCardId) {
            return preview.col!;
        }

        return card.column;
    }

    function getRenderOrder(card: Card) {
        if (!hasCrossColumnPreview()) {
            return card.order;
        }

        if (card.id === draggingCardId) {
            return preview.index!;
        }

        if (card.column === preview.col && card.order >= preview.index!) {
            return card.order + 1;
        }

        return card.order;
    }

    function rendersInColumn(card: Card, colId: ColumnId) {
        return getRenderColumn(card) === colId;
    }

    function getCommittedColumnCards(colId: ColumnId) {
        return cards.filter((card) => card.column === colId).sort(sortByOrder);
    }

    function toLocal(viewportTop: number, viewportLeft: number) {
        const wrapperRect = boardRef?.getBoundingClientRect();
        return {
            top: viewportTop - (wrapperRect?.top ?? 0),
            left: viewportLeft - (wrapperRect?.left ?? 0),
        };
    }

    function setPreview(next: PreviewState) {
        if (preview.col === next.col && preview.index === next.index) return;
        preview = next;
    }

    function getColumnSlots(colId: ColumnId) {
        return getCommittedColumnCards(colId)
            .filter((card) => card.id !== draggingCardId)
            .map((card) => {
                const element = document.getElementById(
                    `kanban-task-${card.id}`,
                );
                return element
                    ? { card, rect: element.getBoundingClientRect() }
                    : null;
            })
            .filter(
                (slot): slot is { card: Card; rect: DOMRect } => slot !== null,
            )
            .sort((a, b) => a.rect.top - b.rect.top);
    }

    function setColumnOrder(colId: ColumnId, nextCards: Card[]) {
        const nextOrder = new Map(
            nextCards.map((card, index) => [card.id, index]),
        );
        cards = cards.map((card) =>
            card.column === colId && nextOrder.has(card.id)
                ? { ...card, order: nextOrder.get(card.id)! }
                : card,
        );
    }

    function moveCardToColumn(
        cardId: string,
        currentCol: ColumnId,
        targetCol: ColumnId,
        targetIndex: number,
    ) {
        const dragged = getCard(cardId);
        if (!dragged) return;

        const sourceCards = getCommittedColumnCards(currentCol).filter(
            (card) => card.id !== cardId,
        );
        const targetCards = getCommittedColumnCards(targetCol).filter(
            (card) => card.id !== cardId,
        );
        const clampedIndex = Math.min(
            Math.max(targetIndex, 0),
            targetCards.length,
        );

        targetCards.splice(clampedIndex, 0, {
            ...dragged,
            column: targetCol,
            order: clampedIndex,
        });

        const sourceOrder = new Map(
            sourceCards.map((card, index) => [card.id, index]),
        );
        const targetOrder = new Map(
            targetCards.map((card, index) => [card.id, index]),
        );

        cards = cards.map((card) => {
            if (card.id === cardId) {
                return {
                    ...card,
                    column: targetCol,
                    order: targetOrder.get(card.id) ?? clampedIndex,
                };
            }

            if (card.column === currentCol && sourceOrder.has(card.id)) {
                return { ...card, order: sourceOrder.get(card.id)! };
            }

            if (card.column === targetCol && targetOrder.has(card.id)) {
                return { ...card, order: targetOrder.get(card.id)! };
            }

            return card;
        });
    }

    function updateGhostForColumn(colId: ColumnId, pointY: number) {
        const ref = colRefs[colId];
        if (!ref) {
            ghostVisible = false;
            return;
        }

        const colRect = ref.getBoundingClientRect();
        const slots = getColumnSlots(colId);
        let idx = slots.length;

        for (let i = 0; i < slots.length; i++) {
            if (pointY < slots[i].rect.top + slots[i].rect.height / 2) {
                idx = i;
                break;
            }
        }

        const left = slots[0]?.rect.left ?? colRect.left + 15;
        let top = colRect.top + 48;

        if (slots.length > 0) {
            if (idx < slots.length) {
                top = slots[idx].rect.top - draggingCardHeight - 10;
            } else {
                top = slots[slots.length - 1].rect.bottom + 10;
            }
        }

        ({ top: ghostTop, left: ghostLeft } = toLocal(top, left));
        ghostVisible = true;
    }

    function handleDrag(card: Card, info: PanInfo) {
        const sourceCol = draggingFromCol ?? card.column;
        const px = info.point.x - window.scrollX;
        const py = info.point.y - window.scrollY;

        for (const colId of COLUMN_IDS) {
            const ref = colRefs[colId];
            if (!ref || colId === sourceCol) continue;
            const colRect = ref.getBoundingClientRect();
            if (
                px <= colRect.left ||
                px >= colRect.right ||
                py <= colRect.top ||
                py >= colRect.bottom
            ) {
                continue;
            }

            const slots = getColumnSlots(colId);
            let idx = slots.length;
            for (let i = 0; i < slots.length; i++) {
                if (py < slots[i].rect.top + slots[i].rect.height / 2) {
                    idx = i;
                    break;
                }
            }

            setPreview({
                col: colId,
                index: idx,
            });
            updateGhostForColumn(colId, py);
            return;
        }

        setPreview({ col: null, index: null });
        updateGhostForColumn(sourceCol, py);
    }

    function handleDrop(cardId: string) {
        if (
            draggingFromCol &&
            preview.col !== null &&
            preview.index !== null &&
            preview.col !== draggingFromCol
        ) {
            moveCardToColumn(
                cardId,
                draggingFromCol,
                preview.col,
                preview.index,
            );
        }

        preview = { col: null, index: null };
        draggingCardId = null;
        draggingFromCol = null;
        ghostVisible = false;
    }
</script>

<Box>
    <div
        class="board-wrapper flex gap-3 p-4 items-stretch justify-start overflow-x-auto"
        bind:this={boardRef}
    >
        {#if ghostVisible}
            <div
                class="drop-ghost"
                style="top:{ghostTop}px; left:{ghostLeft}px; width:{draggingCardWidth}px; height:{draggingCardHeight}px;"
            ></div>
        {/if}

        <LayoutGroup>
            {#each COLUMN_IDS as colId (colId)}
                <div
                    class="column"
                    style="border-top: 3px solid {COL_ACCENT[colId]}"
                    bind:this={colRefs[colId]}
                >
                    <h3 class="col-title" style="color: {COL_ACCENT[colId]}">
                        {COL_LABELS[colId]}
                    </h3>
                    <Reorder.Group
                        as="div"
                        values={cards}
                        onReorder={(next) => {
                            if (hasCrossColumnPreview()) {
                                return;
                            }
                            setColumnOrder(colId, next);
                        }}
                        class="task-list"
                    >
                        {#snippet children({ item: card })}
                            {#if rendersInColumn(card, colId)}
                                <Reorder.Item
                                    as="div"
                                    id={`kanban-task-${card.id}`}
                                    value={card}
                                    layoutId={card.id}
                                    drag={true}
                                    style={{ order: getRenderOrder(card) }}
                                    onDragStart={() => {
                                        draggingCardId = card.id;
                                        draggingFromCol = card.column;
                                        const element = document.getElementById(
                                            `kanban-task-${card.id}`,
                                        );
                                        if (element) {
                                            const rect =
                                                element.getBoundingClientRect();
                                            draggingCardHeight = rect.height;
                                            draggingCardWidth = rect.width;
                                        }
                                    }}
                                    onDrag={(_event, info) =>
                                        handleDrag(card, info as PanInfo)}
                                    onDragEnd={() => handleDrop(card.id)}
                                    whileDrag={{
                                        scale: 1.05,
                                        rotate: 3,
                                        zIndex: 10,
                                        boxShadow:
                                            "0 10px 20px rgba(0,0,0,0.3)",
                                    }}
                                    transition={{
                                        rotate: {
                                            type: "spring",
                                            damping: 12,
                                            stiffness: 200,
                                        },
                                        scale: {
                                            type: "spring",
                                            damping: 15,
                                            stiffness: 200,
                                        },
                                    }}
                                    class="card"
                                >
                                    {card.title}
                                </Reorder.Item>
                            {/if}
                        {/snippet}
                    </Reorder.Group>
                </div>
            {/each}
        </LayoutGroup>
    </div>
</Box>

<style>
    .column {
        background: #222;
        width: 250px;
        padding: 15px;
        border-radius: 12px;
        min-height: 400px;
        display: flex;
        flex-direction: column;
    }

    .col-title {
        margin: 0 0 15px 0;
        font-size: 14px;
        font-weight: 600;
        letter-spacing: 0.05em;
    }

    :global(.task-list) {
        display: flex;
        flex-direction: column;
    }

    :global(.card) {
        background: #333;
        color: #fff;
        padding: 20px;
        border-radius: 8px;
        margin-bottom: 10px;
        cursor: grab;
        border: 1px solid #444;
        user-select: none;
        width: 25ch;
    }

    :global(.card:active) {
        cursor: grabbing;
    }

    .board-wrapper {
        position: relative;
    }

    .drop-ghost {
        position: absolute;
        background: rgba(255, 255, 255, 0.04);
        border: 2px dashed #555;
        border-radius: 8px;
        pointer-events: none;
        z-index: 0;
        transition:
            top 0.25s cubic-bezier(0.34, 1.56, 0.64, 1),
            left 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
</style>
