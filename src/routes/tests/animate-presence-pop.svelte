<script lang="ts">
    import { AnimatePresence, motion } from '$lib/motion-start';
    import { page } from '$app/state';
    import { onMount } from 'svelte';

    let showGreen = $state(true);

    const position = $derived(page.url.searchParams.get('position') || 'static');

    const itemStyle = $derived(
        position === 'relative'
            ? { width: '100px', height: '100px', position: 'relative', top: '100px', left: '100px' }
            : { width: '100px', height: '100px' }
    );

    const items = $derived<{ key: string; color: string }[]>([
        { key: 'a', color: 'red' },
        ...(showGreen ? [{ key: 'b', color: 'green' }] : []),
        { key: 'c', color: 'blue' },
    ]);

    let purpleRef: HTMLDivElement | undefined = $state();
    onMount(() => {
        if (purpleRef) {
            purpleRef.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 1000 });
            purpleRef.animate([{ opacity: 1 }, { opacity: 0.5 }], { duration: 1000 });
        }
    });
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<section
    style="position: relative; display: flex; flex-direction: column; padding: 100px;"
    onclick={() => (showGreen = !showGreen)}
>
    <AnimatePresence mode="popLayout" values={items}>
        {#snippet children({ item })}
            {#if item.key === 'b'}
                <motion.div
                    id="b"
                    animate={{ opacity: 1, transition: { duration: 0.001 } }}
                    exit={{ opacity: 0, transition: { duration: 10 } }}
                    layout
                    style={{ ...itemStyle, backgroundColor: 'green' }}
                ></motion.div>
            {:else}
                <motion.div
                    id={item.key}
                    layout
                    transition={{ ease: () => 1 }}
                    style={{ ...itemStyle, backgroundColor: item.color }}
                ></motion.div>
            {/if}
        {/snippet}
    </AnimatePresence>
    <div
        bind:this={purpleRef}
        style="width: 100px; height: 100px; background-color: purple;{position === 'relative' ? ' position: relative; top: 100px; left: 100px;' : ''}"
    ></div>
</section>
