<svelte:options runes={true} />

<script lang="ts">
    import { Reorder, LayoutGroup } from "$lib/motion-start";
    import type { PanInfo } from "$lib/motion-start/gestures/pan/PanSession";
    import Box from "../Box.svelte";

    type Columns = Record<string, string[]>;

    const DRAG_ANIM = { scale: 1.05, rotate: 3 };
    const IDLE_ANIM = { scale: 1, rotate: 0 };

    /** Sentinel inserted into TARGET column values so its cards slide apart.
     *  Rendered as an invisible spacer with anchor-name; visual is the ghost. */
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
    let draggingCardHeight = $state(62);
    let draggingCardWidth = $state(220);

    let colRefs = $state<Record<string, HTMLElement | null>>({});

    function getDisplayValues(colId: string, tasks: string[]): string[] {
        if (!draggingTask || preview.col !== colId || preview.index === null)
            return tasks;
        if (tasks.includes(draggingTask)) return tasks;
        const result = [...tasks];
        result.splice(preview.index, 0, GHOST);
        return result;
    }

    // Ghost visibility + explicit pixel coordinates.
    // Both top and left are always explicit so CSS transitions always have a
    // concrete before/after value — anchor() can't transition when the anchor
    // *element* changes, only when it moves.
    let ghostVisible = $state(false);
    let ghostTop = $state(0);
    let ghostLeft = $state(0);
    /** Wrapper element — ghost coords are made relative to this for position:absolute. */
    let boardRef = $state<HTMLElement | null>(null);

    /** Convert a viewport-relative rect position to wrapper-relative for position:absolute. */
    function toLocal(viewportTop: number, viewportLeft: number) {
        const wr = boardRef?.getBoundingClientRect();
        return {
            top: viewportTop - (wr?.top ?? 0),
            left: viewportLeft - (wr?.left ?? 0),
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

                const vLeft = slots[0]?.rect.left ?? colRect.left + 15;
                const spacerEl = document.getElementById("kanban-ghost-spacer");
                const vTop = spacerEl
                    ? spacerEl.getBoundingClientRect().top
                    : sortedIdx < slots.length
                      ? slots[sortedIdx].rect.top
                      : (slots[slots.length - 1]?.rect.bottom ?? colRect.top) +
                        10;

                ({ top: ghostTop, left: ghostLeft } = toLocal(vTop, vLeft));
                ghostVisible = true;
                return;
            }
        }

        preview = { col: null, index: null };

        // Within-column: find reference card sorted by live DOM position
        const slots = columns[currentCol]
            .filter((t) => t !== task)
            .map((t) => {
                const el = document.getElementById(`kanban-task-${t}`);
                return el
                    ? { task: t, rect: el.getBoundingClientRect() }
                    : null;
            })
            .filter((s): s is { task: string; rect: DOMRect } => s !== null)
            .sort((a, b) => a.rect.top - b.rect.top);

        if (slots.length === 0) {
            ghostVisible = false;
            return;
        }

        let idx = slots.length;
        for (let i = 0; i < slots.length; i++) {
            if (py < slots[i].rect.top + slots[i].rect.height / 2) {
                idx = i;
                break;
            }
        }

        const refSlot =
            idx < slots.length ? slots[idx] : slots[slots.length - 1];
        const vTop =
            idx < slots.length
                ? refSlot.rect.top - draggingCardHeight - 10
                : refSlot.rect.bottom + 10;
        ({ top: ghostTop, left: ghostLeft } = toLocal(vTop, refSlot.rect.left));
        ghostVisible = true;
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
        ghostVisible = false;
    }
</script>

<div class="board-wrapper" bind:this={boardRef}>
    {#if ghostVisible}
        <div
            class="drop-ghost"
            style="top:{ghostTop}px; left:{ghostLeft}px; width:{draggingCardWidth}px; height:{draggingCardHeight}px;"
        ></div>
    {/if}

    <Box cls="gap-3 p-4 items-stretch justify-start overflow-x-auto">
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
                                <!-- Invisible spacer — makes target-column cards slide apart. -->
                                <div
                                    id="kanban-ghost-spacer"
                                    class="ghost-spacer"
                                    style="height:{draggingCardHeight}px;"
                                ></div>
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
                                        if (el) {
                                            const r =
                                                el.getBoundingClientRect();
                                            draggingCardHeight = r.height;
                                            draggingCardWidth = r.width;
                                        }
                                    }}
                                    onDrag={(_event, info) =>
                                        handleDrag(
                                            task,
                                            info as PanInfo,
                                            colId,
                                        )}
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
                                        ? {
                                              zIndex: 10,
                                              boxShadow:
                                                  "0 10px 20px rgba(0,0,0,0.3)",
                                          }
                                        : {}}
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
</div>

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

    /* Invisible spacer — pushes target-column cards apart during cross-column hover. */
    :global(.ghost-spacer) {
        flex-shrink: 0;
        margin-bottom: 10px;
        width: 25ch;
    }

    /*
     * Drop ghost: position:fixed with explicit top/left set by JS on every
     * pointermove. Both axes always transition so column switches (left change)
     * and within-column moves (top change) both get the spring animation.
     * Having both always defined means the browser always has a concrete
     * before/after value — no same-tick transition-definition race.
     */
    .board-wrapper {
        position: relative;
    }

    .drop-ghost {
        position: absolute;
        background: rgba(255, 255, 255, 0.04);
        border: 2px dashed #555;
        border-radius: 8px;
        pointer-events: none;
        z-index: 100;
        transition:
            top 0.25s cubic-bezier(0.34, 1.56, 0.64, 1),
            left 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
</style>
