<script lang="ts">
    import { motion } from '$lib/motion-start';
    import { page } from '$app/state';
    import { onMount } from 'svelte';

    let count = $state(0);

    const parentDragParam = page.url.searchParams.get('parentDrag');
    const childDragParam = page.url.searchParams.get('childDrag');
    const parentLayout = $derived(page.url.searchParams.get('parentLayout') ? true : undefined);
    const childLayout = $derived(page.url.searchParams.get('childLayout') ? true : undefined);
    const constraints = $derived(Boolean(page.url.searchParams.get('constraints')));
    const animation = $derived(Boolean(page.url.searchParams.get('animation')));
    const bothAxes = $derived(Boolean(page.url.searchParams.get('bothAxes')));

    const parentDrag = $derived.by(() => {
        if (bothAxes) return 'y';
        return parentDragParam || true;
    });

    const childDrag = $derived.by(() => {
        if (bothAxes) return 'x';
        return childDragParam || true;
    });

    const b = {
        position: 'absolute',
        top: 100,
        left: 100,
        width: 300,
        height: 300,
        borderRadius: 10,
        background: '#ff0055',
    };

    const a = {
        position: 'relative',
        top: 50,
        left: 50,
        width: 600,
        height: 200,
        background: '#ffcc00',
        borderRadius: 10,
    };

    const c = {
        position: 'relative',
        top: 50,
        left: 50,
        width: 100,
        height: 100,
        background: '#ffaa00',
        borderRadius: 10,
    };

    // Trigger layout projection in the child
    onMount(() => {
        count = count + 1;
    });
</script>

<div>
    <motion.div
        id="parent"
        drag={parentDrag}
        dragMomentum={animation}
        dragElastic={constraints && animation ? 0.5 : false}
        dragConstraints={constraints ? { top: -10, right: 100 } : undefined}
        layout={parentLayout}
        style={b}
    >
        <motion.div
            id="child"
            drag={childDrag}
            dragMomentum={animation}
            dragElastic={constraints && animation ? 0.5 : false}
            dragConstraints={constraints ? { top: 0, left: -100, right: 100 } : undefined}
            layout={childLayout}
            style={a}
        >
            <motion.div id="control" layoutId="test" style={c} />
        </motion.div>
    </motion.div>
</div>
