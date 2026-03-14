<script>
    import {
        Motion,
        AnimatePresence,
        layoutAnimation,
    } from "$lib/motion-start";

    let nextId = 5;
    let tasks = [
        { key: 1, text: "Learn React" },
        { key: 2, text: "Prototype with Framer" },
        { key: 3, text: "Get Superpowers" },
        { key: 4, text: "Conquer the universe" },
    ];
    let presenceAffectsLayout = true;

    function removeTask(key) {
        tasks = tasks.filter((t) => t.key !== key);
    }

    function addTask() {
        tasks = [...tasks, { key: nextId, text: `Task ${nextId++}` }];
    }

    /**
     * layout prop is needed for presenceAffectsLayout to work, but can be used without it to simply animate presence without affecting layout
     * you can choose to have tracking depend on signals etc.
     * it is not necessary to track every change that might affect layout, just the ones you care about.
     * currently this works without tracking, but that is because the tasklist is already tracked by AnimatePresence.
     * you can use the layoutAnimation.track() function to create a new function reference whenever something changes that might affect layout.
     * for layout prop or custom={signal} or layoutDependency={signal}, you could track the signal itself, but you could also track something else that changes at the same time as the signal, like a list of items that will be re-rendered when the signal changes.
     */
    // Re-creates the function reference each time tasks changes, signalling
    // motion elements to re-measure and FLIP to their new positions.
    // $: layout = layoutAnimation.track(() => tasks);
</script>

<div class="w-64 bg-gray-700/40 rounded-lg p-3 flex flex-col gap-2">
    <section class="flex items-center justify-center gap-3">
        <label class="text-xs text-white/60 hover:text-white cursor-pointer">
            <input
                type="checkbox"
                bind:checked={presenceAffectsLayout}
                class="mr-1"
            />
            presenceAffectsLayout
        </label>
    </section>
    <hr class="border-gray-600" />
    <ul class="flex flex-col gap-1">
        <AnimatePresence {presenceAffectsLayout} list={tasks} let:item>
            <Motion.li
                layout
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -60 }}
                transition={{ layout: { duration: 0.8 }, duration: 0.2 }}
                class="flex items-center justify-between bg-white/10 rounded px-3 py-2 text-white text-sm select-none"
            >
                <span>{item.text}</span>
                <button
                    onclick={() => removeTask(item.key)}
                    class="ml-2 text-white/40 hover:text-white leading-none"
                    >✕</button
                >
            </Motion.li>
        </AnimatePresence>
    </ul>
    <button
        onclick={addTask}
        class="text-xs text-white/60 hover:text-white py-1 px-2 rounded border border-white/20 hover:border-white/40 transition-colors"
        >+ Add task</button
    >
</div>
