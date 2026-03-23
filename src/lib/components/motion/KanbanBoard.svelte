<svelte:options runes={true} />

<script lang="ts">
    import { motion, Reorder, LayoutGroup } from "$lib/motion-start";
    import type { PanInfo } from "$lib/motion-start/gestures/pan/PanSession";

    type Columns = Record<string, string[]>;

    // Constant objects — stable references prevent animateChanges() from
    // re-starting the spring every time layoutDependency bumps during drag.
    const DRAG_ANIM = { scale: 1.05, rotate: 3 };
    const IDLE_ANIM = { scale: 1, rotate: 0 };

    const GHOST = "__ghost__";
    const GHOST_HEIGHT = 62;

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

    let colRefs = $state<Record<string, HTMLElement | null>>({});

    /** Cross-column: insert GHOST into the target column so cards slide apart
     *  to show the drop position. GHOST stays out of the source column to avoid
     *  scaled-layout measurement interference (framer-motion bug #1764). */
    function getDisplayValues(colId: string, tasks: string[]): string[] {
        if (!draggingTask || preview.col !== colId || preview.index === null)
            return tasks;
        if (tasks.includes(draggingTask)) return tasks;
        const result = [...tasks];
        result.splice(preview.index, 0, GHOST);
        return result;
    }

    function handleDrag(task: string, info: PanInfo, currentCol: string) {
        const px = info.point.x - window.scrollX;
        const py = info.point.y - window.scrollY;

        // Cross-column detection
        for (const [id, ref] of Object.entries(colRefs)) {
            if (!ref || id === currentCol) continue;
            const rect = ref.getBoundingClientRect();
            if (
                px > rect.left &&
                px < rect.right &&
                py > rect.top &&
                py < rect.bottom
            ) {
                const colTasks = columns[id];
                let targetIndex = colTasks.length;
                for (let i = 0; i < colTasks.length; i++) {
                    const el = document.getElementById(
                        `kanban-task-${colTasks[i]}`,
                    );
                    if (el) {
                        const r = el.getBoundingClientRect();
                        if (py < r.top + r.height / 2) {
                            targetIndex = i;
                            break;
                        }
                    }
                }
                preview = { col: id, index: targetIndex };
                withinGhost = null;
                return;
            }
        }

        preview = { col: null, index: null };

        // Within-column ghost: sort other cards by current DOM position so order
        // is correct even mid-FLIP, then find which slot the pointer is in.
        const slots = columns[currentCol]
            .filter((t) => t !== task)
            .map((t) => {
                const el = document.getElementById(`kanban-task-${t}`);
                return el ? { rect: el.getBoundingClientRect() } : null;
            })
            .filter((s): s is { rect: DOMRect } => s !== null)
            .sort((a, b) => a.rect.top - b.rect.top);

        if (slots.length === 0) {
            withinGhost = null;
            return;
        }

        let targetIdx = slots.length;
        for (let i = 0; i < slots.length; i++) {
            if (py < slots[i].rect.top + slots[i].rect.height / 2) {
                targetIdx = i;
                break;
            }
        }

        const ref =
            targetIdx < slots.length
                ? slots[targetIdx]
                : slots[slots.length - 1];
        const placeBelow = targetIdx >= slots.length;
        withinGhost = placeBelow
            ? {
                  top: ref.rect.bottom + 10,
                  left: ref.rect.left,
                  width: ref.rect.width,
              }
            : {
                  top: ref.rect.top - GHOST_HEIGHT - 10,
                  left: ref.rect.left,
                  width: ref.rect.width,
              };
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
        withinGhost = null;
    }

    /** Within-column ghost: position:fixed div that never enters Reorder.Group
     *  values. Computed in handleDrag on every pointer event for real-time tracking. */
    type GhostRect = { top: number; left: number; width: number };
    let withinGhost = $state<GhostRect | null>(null);
</script>

{#if withinGhost}
    <div
        class="ghost-card within-ghost"
        style="top:{withinGhost.top}px; left:{withinGhost.left}px; width:{withinGhost.width}px;"
    />
{/if}

<div
    class="flex flex-row gap-3 p-4 bg-gray-800 rounded-xl w-full overflow-x-auto"
>
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
                            <motion.div layout class="ghost-card" />
                        {:else}
                            <Reorder.Item
                                as="div"
                                id={`kanban-task-${task}`}
                                value={task}
                                layoutId={task}
                                drag={true}
                                onDragStart={() => (draggingTask = task)}
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
</div>

<style>
    .board {
        display: flex;
        gap: 20px;
        padding: 50px;
        background: #111;
        min-height: 100vh;
    }

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

    :global(.ghost-card) {
        height: 62px;
        background: rgba(255, 255, 255, 0.04);
        border: 2px dashed #555;
        border-radius: 8px;
        margin-bottom: 10px;
        position: relative;
        z-index: 0;
    }

    .within-ghost {
        position: fixed;
        margin-bottom: 0;
        pointer-events: none;
        z-index: 1;
        transition:
            top 0.12s ease-out,
            left 0.12s ease-out;
    }
</style>
