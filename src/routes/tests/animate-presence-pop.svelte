<script lang="ts">
    import { motion, AnimatePresence } from '$lib/motion-start';
    import { page } from '$app/state';
    import { onMount } from 'svelte';

    let showGreen = $state(true);

    // Read URL params (mirrors upstream pattern)
    const position = $derived((page.url.searchParams.get('position') || 'static') as 'static' | 'relative' | 'absolute' | 'fixed');
    const anchorX = $derived((page.url.searchParams.get('anchor-x') || 'left') as 'left' | 'right');

    const boxStyles = {
        width: '100px',
        height: '100px',
        backgroundColor: 'red',
    };

    function getItemStyle(pos: string): Record<string, string> {
        if (pos === 'relative') {
            return { position: 'relative', top: '100px', left: '100px' };
        }
        return {};
    }

    function handleClick() {
        showGreen = !showGreen;
    }

    // Build values list for AnimatePresence
    // Always include 'a' and 'c', conditionally include 'b'
    const items = $derived(
        showGreen
            ? [
                { key: 'a', color: 'red' },
                { key: 'b', color: 'green' },
                { key: 'c', color: 'blue' }
              ]
            : [
                { key: 'a', color: 'red' },
                { key: 'c', color: 'blue' }
              ]
    );

    // Purple box animation (mirrors upstream useEffect)
    let purpleRef: HTMLDivElement | undefined = $state();
    onMount(() => {
        if (purpleRef) {
            // Animate opacity 0 -> 1 then 1 -> 0.5
            purpleRef.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 1000 });
            purpleRef.animate([{ opacity: 1 }, { opacity: 0.5 }], { duration: 1000 });
        }
    });
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
    style="position: relative; display: flex; flex-direction: column; padding: 100px;"
    onclick={handleClick}
>
    <AnimatePresence anchorX={anchorX} mode="popLayout" values={items}>
        {#snippet children({ item })}
            {#if item.key === 'b'}
                <motion.div
                    id="b"
                    animate={{
                        opacity: 1,
                        transition: { duration: 0.001 },
                    }}
                    exit={{ opacity: 0, transition: { duration: 10 } }}
                    layout
                    style={{
                        ...boxStyles,
                        ...getItemStyle(position),
                        backgroundColor: 'green',
                    }}
                />
            {:else}
                <motion.div
                    id={item.key}
                    layout
                    transition={{ ease: () => 1 }}
                    style={{
                        ...boxStyles,
                        ...getItemStyle(position),
                        backgroundColor: item.color,
                    }}
                />
            {/if}
        {/snippet}
    </AnimatePresence>
    <div
        bind:this={purpleRef}
        style="width: 100px; height: 100px; background-color: purple; {position === 'relative' ? 'position: relative; top: 100px; left: 100px;' : ''}"
    />
</div>
