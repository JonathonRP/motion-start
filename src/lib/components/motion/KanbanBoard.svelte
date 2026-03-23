<svelte:options runes={true} />

<script lang="ts">
    import { Reorder, LayoutGroup } from "$lib/motion-start";
    import type { PanInfo } from "$lib/motion-start/gestures/pan/PanSession";
    import Box from "../Box.svelte";

    type Columns = Record<string, string[]>;

    // Constant objects — stable references prevent animateChanges() from
    // re-starting the spring every time layoutDependency bumps during drag.
    const DRAG_ANIM = { scale: 1.05, rotate: 3 };
    const IDLE_ANIM = { scale: 1, rotate: 0 };

    /** Sentinel inserted into TARGET column values so its cards slide apart.
     *  Rendered as an invisible spacer; visual is the position:fixed ghost. */
    const GHOST = "__ghost__";

    const COL_LABELS: Record<string, string> = {
        todo: "TODO",
        inprogress: "IN PROGRESS",
        done: "DONE",
    };

    const COL_ACCENT: Record<string, string> = {
        todo: "#4f8ef7",
        inprogress: "#f7a94f",
        done: "#4fca6e",
    };

    let columns = $state<Columns>({
        todo: [
            "Fix Bifrost CI pipeline",
            "Add Dr. Strange to on-call",
            "Order Pym Particles (bulk)",
            "Take over universe (backlog)",
        ],
        inprogress: [
            "Stop Thanos (deprioritised)",
            "Refactor Vibranium service",
        ],
        done: ["Recruit Loki (he quit)", "I am inevitable ✅"],
    });

    let preview = $state<{ col: string | null; index: number | null }>({
        col: null,
        index: null,
    });

    let draggingTask = $state<string | null>(null);
    /** Actual height of the card being dragged, measured at drag-start. */
    let draggingCardHeight = $state(62);

    let colRefs = $state<Record<string, HTMLElement | null>>({});

    /** Cross-column: insert GHOST into the target column so its cards slide
     *  apart to show the drop slot. Never inserted into the source column. */
    function getDisplayValues(colId: string, tasks: string[]): string[] {
        if (!draggingTask || preview.col !== colId || preview.index === null)
            return tasks;
        if (tasks.includes(draggingTask)) return tasks;
        const result = [...tasks];
        result.splice(preview.index, 0, GHOST);
        return result;
    }

    /** Unified position:fixed ghost — shown for both within-column and
     *  cross-column. Computed on every pointer event for real-time tracking. */
    type GhostRect = { top: number; left: number; width: number };
    let ghost = $state<GhostRect | null>(null);

    /** Compute ghost rect from slots sorted by DOM position and pointer Y. */
    function computeGhost(
        slots: { rect: DOMRect }[],
        py: number,
        colRect: DOMRect,
    ): GhostRect {
        if (slots.length === 0) {
            return {
                top: colRect.top + 55,
                left: colRect.left + 15,
                width: colRect.width - 30,
            };
        }
        let idx = slots.length;
        for (let i = 0; i < slots.length; i++) {
            if (py < slots[i].rect.top + slots[i].rect.height / 2) {
                idx = i;
                break;
            }
        }
        const ref = idx < slots.length ? slots[idx] : slots[slots.length - 1];
        return idx >= slots.length
            ? {
                  top: ref.rect.bottom + 10,
                  left: ref.rect.left,
                  width: ref.rect.width,
              }
            : {
                  top: ref.rect.top - draggingCardHeight - 10,
                  left: ref.rect.left,
                  width: ref.rect.width,
              };
    }

    function handleDrag(task: string, info: PanInfo, currentCol: string) {
        const px = info.point.x - window.scrollX;
        const py = info.point.y - window.scrollY;

        // Cross-column detection
        for (const [id, ref] of Object.entries(colRefs)) {
            if (!ref || id === currentCol) continue;
            const colRect = ref.getBoundingClientRect();
            if (
                px > colRect.left &&
                px < colRect.right &&
                py > colRect.top &&
                py < colRect.bottom
            ) {
                const slots = columns[id]
                    .map((t) => {
                        const el = document.getElementById(`kanban-task-${t}`);
                        return el
                            ? { task: t, rect: el.getBoundingClientRect() }
                            : null;
                    })
                    .filter(
                        (s): s is { task: string; rect: DOMRect } => s !== null,
                    )
                    .sort((a, b) => a.rect.top - b.rect.top);

                let sortedIdx = slots.length;
                for (let i = 0; i < slots.length; i++) {
                    if (py < slots[i].rect.top + slots[i].rect.height / 2) {
                        sortedIdx = i;
                        break;
                    }
                }
                const dropIndex =
                    sortedIdx < slots.length
                        ? columns[id].indexOf(slots[sortedIdx].task)
                        : columns[id].length;

                preview = {
                    col: id,
                    index: dropIndex < 0 ? columns[id].length : dropIndex,
                };
                ghost = computeGhost(slots, py, colRect);
                return;
            }
        }

        preview = { col: null, index: null };

        // Within-column ghost
        const colRef = colRefs[currentCol];
        const colRect = colRef?.getBoundingClientRect() ?? new DOMRect();
        const slots = columns[currentCol]
            .filter((t) => t !== task)
            .map((t) => {
                const el = document.getElementById(`kanban-task-${t}`);
                return el ? { rect: el.getBoundingClientRect() } : null;
            })
            .filter((s): s is { rect: DOMRect } => s !== null)
            .sort((a, b) => a.rect.top - b.rect.top);

        if (slots.length === 0) {
            ghost = null;
            return;
        }
        ghost = computeGhost(slots, py, colRect);
    }

    function handleDrop(task: string, currentCol: string) {
        if (
            preview.col !== null &&
            preview.index !== null &&
            preview.col !== currentCol
        ) {
            const { col: targetCol, index: targetIndex } = preview;
            columns[currentCol] = columns[currentCol].filter((t) => t !== task);
            const targetList = [...columns[targetCol]];
            targetList.splice(targetIndex, 0, task);
            columns[targetCol] = targetList;
        }
        preview = { col: null, index: null };
        draggingTask = null;
        ghost = null;
    }
</script>

{#if ghost}
    <div
        class="drop-ghost"
        style="top:{ghost.top}px; left:{ghost.left}px; width:{ghost.width}px; height:{draggingCardHeight}px;"
    />
{/if}

<Box cls="gap-3 p-4 items-stretch overflow-x-auto">
    <LayoutGroup>
        {#each Object.entries(columns) as [colId, tasks] (colId)}
            <div
                class="column"
                style="border-top: 3px solid {COL_ACCENT[colId]}"
                bind:this={colRefs[colId]}
            >
                <h3 class="col-title" style="color: {COL_ACCENT[colId]}">
                    {COL_LABELS[colId] ?? colId.toUpperCase()}
                </h3>
                <Reorder.Group
                    as="div"
                    values={getDisplayValues(colId, tasks)}
                    onReorder={(next) => {
                        if (preview.col !== null && preview.col !== colId)
                            return;
                        columns[colId] = next.filter((t) => t !== GHOST);
                    }}
                    class="task-list"
                >
                    {#snippet children({ item: task })}
                        {#if task === GHOST}
                            <!-- Invisible spacer — makes target-column cards slide apart.
                                 The visual indicator is the position:fixed drop-ghost above. -->
                            <div
                                class="ghost-spacer"
                                style="height:{draggingCardHeight}px;"
                            />
                        {:else}
                            <Reorder.Item
                                as="div"
                                id={`kanban-task-${task}`}
                                value={task}
                                layoutId={task}
                                drag={true}
                                onDragStart={() => {
                                    draggingTask = task;
                                    const el = document.getElementById(
                                        `kanban-task-${task}`,
                                    );
                                    if (el)
                                        draggingCardHeight =
                                            el.getBoundingClientRect().height;
                                }}
                                onDrag={(_event, info) =>
                                    handleDrag(task, info as PanInfo, colId)}
                                onDragEnd={() => handleDrop(task, colId)}
                                animate={draggingTask === task
                                    ? DRAG_ANIM
                                    : IDLE_ANIM}
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
                                style={draggingTask === task
                                    ? "z-index: 10; box-shadow: 0 10px 20px rgba(0,0,0,0.3)"
                                    : ""}
                                class="card"
                            >
                                {task}
                            </Reorder.Item>
                        {/if}
                    {/snippet}
                </Reorder.Group>
            </div>
        {/each}
    </LayoutGroup>
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
    }

    :global(.card:active) {
        cursor: grabbing;
    }

    /* Invisible spacer that pushes target-column cards apart during cross-column hover. */
    :global(.ghost-spacer) {
        flex-shrink: 0;
        margin-bottom: 10px;
    }

    /* Unified visible ghost for both within-column and cross-column.
     * cubic-bezier(0.34, 1.56, 0.64, 1) is a spring curve (slight overshoot)
     * so single jumps feel the same as the continuous card-tracking case. */
    .drop-ghost {
        position: fixed;
        background: rgba(255, 255, 255, 0.04);
        border: 2px dashed #555;
        border-radius: 8px;
        pointer-events: none;
        z-index: 1;
        transition:
            top 0.25s cubic-bezier(0.34, 1.56, 0.64, 1),
            left 0.25s cubic-bezier(0.34, 1.56, 0.64, 1),
            bottom 0.25s cubic-bezier(0.34, 1.56, 0.64, 1),
            right 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
</style>
