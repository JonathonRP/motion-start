<script lang="ts">
import { AnimatePresence, motion } from '$lib/motion-start';

type Task = { key: number; text: string };

let nextId = $state(5);
let tasks = $state<Task[]>([
	{ key: 1, text: 'Learn Svelte' },
	{ key: 2, text: 'Prototype with Framer' },
	{ key: 3, text: 'Get Superpowers' },
	{ key: 4, text: 'Conquer the universe' },
]);
let presenceAffectsLayout = $state(true);

function removeTask(key: number) {
	tasks = tasks.filter((task) => task.key !== key);
}

function addTask() {
	tasks = [...tasks, { key: nextId, text: `Task ${nextId}` }];
	nextId++;
}
</script>

<!--
	`layout` on the children is what lets `presenceAffectsLayout` do anything: when
	an item exits, the surviving siblings re-measure and FLIP to their new
	positions. With `presenceAffectsLayout={false}` the exit still animates, but
	siblings hold their old positions until the exit finishes.
-->
<div class="w-64 bg-gray-700/40 rounded-lg p-3 flex flex-col gap-2">
	<section class="flex items-center justify-center gap-3">
		<label class="text-xs text-white/60 hover:text-white cursor-pointer">
			<input type="checkbox" bind:checked={presenceAffectsLayout} class="mr-1" />
			presenceAffectsLayout
		</label>
	</section>
	<hr class="border-gray-600" />
	<ul class="flex flex-col gap-1">
		<AnimatePresence {presenceAffectsLayout}>
			{#each tasks as task (task.key)}
				<motion.li
					layout
					initial={{ opacity: 0, y: -8 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, x: -60 }}
					transition={{ layout: { duration: 0.8 }, duration: 0.2 }}
					class="flex items-center justify-between bg-white/10 rounded px-3 py-2 text-white text-sm select-none"
				>
					<span>{task.text}</span>
					<button
						onclick={() => removeTask(task.key)}
						aria-label="Remove {task.text}"
						class="ml-2 text-white/40 hover:text-white leading-none">✕</button
					>
				</motion.li>
			{/each}
		</AnimatePresence>
	</ul>
	<button
		onclick={addTask}
		class="text-xs text-white/60 hover:text-white py-1 px-2 rounded border border-white/20 hover:border-white/40 transition-colors"
		>+ Add task</button
	>
</div>
