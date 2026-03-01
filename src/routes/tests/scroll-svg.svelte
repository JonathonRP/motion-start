<script lang="ts">
    import { motion, useScroll } from '$lib/motion-start';

    let rectRef: SVGRectElement | undefined = $state();
    let svgRef: SVGSVGElement | undefined = $state();

    const rectValues = useScroll({
        get target() { return rectRef; },
        offset: ['start end', 'end start'],
    });

    const svgValues = useScroll({
        get target() { return svgRef; },
        offset: ['start end', 'end start'],
    });

    const fixed = {
        position: 'fixed',
        top: 10,
        left: 10,
    };
</script>

<div
    style={{
        paddingTop: 400,
        paddingBottom: 400,
    }}
>
    <svg bind:this={svgRef} viewBox="0 0 200 200" width="200" height="200">
        <rect
            bind:this={rectRef}
            width="100"
            height="100"
            x="50"
            y="50"
            fill="red"
        />
    </svg>
</div>
<motion.div style={{ ...fixed, color: 'white' }} id="rect-progress">
    {rectValues.scrollYProgress.get()}
</motion.div>
<motion.div
    style={{ ...fixed, top: 50, color: 'white' }}
    id="svg-progress"
>
    {svgValues.scrollYProgress.get()}
</motion.div>
