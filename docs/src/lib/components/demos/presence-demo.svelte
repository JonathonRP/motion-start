<script lang="ts">
	import { motion, AnimatePresence } from "motion-start";
	import { Button } from "@svecodocs/kit";

	let visible = $state(true);
</script>

<div class="flex flex-col items-start gap-4">
	<Button variant="brand" size="sm" onclick={() => (visible = !visible)}>
		{visible ? "Remove" : "Add"}
	</Button>

	<div class="h-24">
		<AnimatePresence>
			{#if visible}
				<motion.div
					class="grid size-24 place-items-center rounded-2xl bg-linear-to-br from-brand to-brand/40 text-xs font-medium text-white"
					initial={{ opacity: 0, scale: 0.6 }}
					animate={{ opacity: 1, scale: 1 }}
					exit={{ opacity: 0, scale: 0.6 }}
					transition={{ type: "spring", stiffness: 300, damping: 24 }}
				>
					hello
				</motion.div>
			{/if}
		</AnimatePresence>
	</div>
</div>
