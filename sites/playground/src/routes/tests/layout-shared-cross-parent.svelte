<svelte:options runes={true} />

<script lang="ts">
import { page } from '$app/state';
import { LayoutGroup, motion, Reorder, useMotionValue } from 'motion-start';

const variant = $derived(page.url.searchParams.get('variant') ?? 'plain');

let column = $state(0);
const values = [{ id: 'card' }];

const x = useMotionValue(0);
const y = useMotionValue(0);

const transition = { duration: 0.5, ease: 'linear' } as const;
</script>

<button id="move" onclick={() => (column = column === 0 ? 1 : 0)}>move</button>

<div class="board">
	<LayoutGroup>
		{#each [0, 1] as col (col)}
			<div class="column" id={`column-${col}`}>
				{#if variant === 'reorder'}
					<Reorder.Group as="div" axis="y" {values} onReorder={() => {}}>
						{#snippet children({ item })}
							{#if column === col}
								<Reorder.Item
									as="div"
									id="box"
									value={item}
									layoutId="box"
									{transition}
									style={{ background: 'red', width: '100px', height: '100px' }}
								>
									box
								</Reorder.Item>
							{/if}
						{/snippet}
					</Reorder.Group>
				{:else if column === col}
					<motion.div
						id="box"
						layout
						layoutId="box"
						{transition}
						style={{
							background: 'red',
							width: '100px',
							height: '100px',
							...(variant === 'xy' ? { x, y } : {}),
						}}
					/>
				{/if}
			</div>
		{/each}
	</LayoutGroup>
</div>

<style>
	.board {
		display: flex;
		gap: 200px;
		padding: 20px;
	}

	.column {
		width: 200px;
		min-height: 300px;
		background: #eee;
	}
</style>
