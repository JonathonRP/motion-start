<script lang="ts">
    /**
     * This demonstrates children with layoutId animating
     * back to their origin components
     */
    import { motion, AnimatePresence, useIsPresent } from '$lib/motion-start';
    import { page } from '$app/state';

    const instant = $derived(page.url.searchParams.get('instant') === 'true');
    const partialEase = $derived(page.url.searchParams.get('partial-ease') === 'true');
    const type = $derived(page.url.searchParams.get('type') || 'crossfade');

    let openColor: string | false = $state(false);

    const numColors = 3;
    const makeColor = (hue: number) => `hsl(${hue}, 100%, 50%)`;
    const colors = Array.from(Array(numColors)).map((_, i) =>
        makeColor(Math.round((360 / numColors) * i))
    );

    const getTransition = (forOpenColor?: string) => {
        if (instant) return { type: false };
        if (partialEase) {
            if (forOpenColor === `hsl(0, 100%, 50%)`) {
                return { duration: 0.6, ease: () => 0.1 };
            }
            return { duration: 0.6, ease: (t: number) => (t === 1 ? 1 : 0.9) };
        }
        return { duration: 0.01 };
    };

    const background = {
        position: 'fixed',
        top: '0',
        left: '0',
        bottom: '0',
        right: '0',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#ccc',
    };

    const container = {
        backgroundColor: '#eeeeee',
        borderRadius: '25px',
        width: '600px',
        height: '600px',
        margin: '0',
        padding: '0 20px 20px 0',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'space-between',
        listStyle: 'none',
    };

    const item = {
        padding: '20px',
        cursor: 'pointer',
        margin: '20px 0 0 20px',
        flex: '1 1 90px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    };

    const overlay = {
        background: 'rgba(0,0,0,0.6)',
        position: 'fixed',
        top: '0',
        left: '0',
        bottom: '0',
        right: '0',
    };

    const singleImageContainer = {
        position: 'absolute',
        top: '0',
        left: '0',
        bottom: '0',
        right: '0',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        pointerEvents: 'none',
    };

    const singleImage = {
        width: '500px',
        height: '300px',
        padding: 50,
    };

    const child = {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'white',
        opacity: 0.5,
    };

    const transition = $derived(getTransition(openColor || undefined));
    const items = $derived(openColor !== false ? [{ key: openColor, color: openColor }] : []);
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div style={background}>
    <!-- Gallery -->
    <ul style={container}>
        {#each colors as color, i}
            <motion.li
                onclick={() => openColor = color}
                style={{ ...item, backgroundColor: color, borderRadius: 0 }}
                layoutId={color}
                transition={transition}
                id={i === 0 ? 'item-parent' : undefined}
            >
                <motion.div
                    style={child}
                    id={i === 0 ? 'item-child' : undefined}
                    layoutId={`child-${color}`}
                    transition={transition}
                />
            </motion.li>
        {/each}
    </ul>

    <!-- Single Image -->
    <AnimatePresence values={items}>
        {#snippet children({ item })}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={overlay}
                id="overlay"
                transition={transition}
                onclick={() => openColor = false}
            />
            <div style={singleImageContainer}>
                <motion.div
                    id="parent"
                    layoutId={item.color}
                    style={{
                        ...singleImage,
                        backgroundColor: '#fff',
                        borderRadius: 50,
                    }}
                    transition={transition}
                >
                    <motion.div
                        style={{ ...child, backgroundColor: 'black' }}
                        id="child"
                        layoutId={`child-${item.color}`}
                        transition={transition}
                    />
                </motion.div>
            </div>
        {/snippet}
    </AnimatePresence>
</div>
