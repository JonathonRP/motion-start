<script lang="ts">
    import { motion } from '$lib/motion-start';
    import { page } from '$app/state';
    import { onMount } from 'svelte';

    let count = $state(0);

    type DragAxis = true | 'x' | 'y';

    function getDragParam(name: string): DragAxis {
        const value = page.url.searchParams.get(name);
        return value === 'x' || value === 'y' ? value : true;
    }

    const parentLayout = $derived(page.url.searchParams.get('parentLayout') ? true : undefined);
    const childLayout = $derived(page.url.searchParams.get('childLayout') ? true : undefined);
    const constraints = $derived(Boolean(page.url.searchParams.get('constraints')));
    const animation = $derived(Boolean(page.url.searchParams.get('animation')));
    const bothAxes = $derived(Boolean(page.url.searchParams.get('bothAxes')));

    const parentDrag = $derived.by(() => {
        if (bothAxes) return 'y';
        return getDragParam('parentDrag');
    });

    const childDrag = $derived.by(() => {
        if (bothAxes) return 'x';
        return getDragParam('childDrag');
    });

    const b = {
        position: 'absolute',
        top: '100px',
        left: '100px',
        width: '300px',
        height: '300px',
        borderRadius: '10px',
        background: '#ff0055',
    } as const;

    const a = {
        position: 'relative',
        top: '50px',
        left: '50px',
        width: '600px',
        height: '200px',
        background: '#ffcc00',
        borderRadius: '10px',
    } as const;

    const c = {
        position: 'relative',
        top: '50px',
        left: '50px',
        width: '100px',
        height: '100px',
        background: '#ffaa00',
        borderRadius: '10px',
    } as const;

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
