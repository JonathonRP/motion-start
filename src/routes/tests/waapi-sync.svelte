<script lang="ts">
    import { animate, motion, useMotionValue } from '$lib/motion-start';
    import { onMount } from 'svelte';

    const opacity = useMotionValue(0);

    let waapiRef: HTMLDivElement | undefined = $state();
    let syncRef: HTMLDivElement | undefined = $state();

    const waapiStartTime = useMotionValue('--');
    const syncStartTime = useMotionValue('--');
    const waapiExplicitStartTime = useMotionValue('--');
    const syncExplicitStartTime = useMotionValue('--');

    onMount(() => {
        const settings = {
            duration: 2,
            ease: 'linear' as const,
        };

        if (!waapiRef || !syncRef) return;

        const waapiAnimation = animate(
            waapiRef,
            { opacity: [0, 1] },
            settings
        );
        const syncAnimation = animate(
            syncRef,
            { opacity: [0, 1] },
            settings
        );

        const startTime = 101;

        const waapiExplicitAnimation = animate(
            waapiRef,
            { filter: ['blur(0px)', 'blur(1px)'] },
            { ...settings, startTime }
        );
        const syncExplicitAnimation = animate(
            syncRef,
            { x: [0, 100] },
            { ...settings, startTime }
        );

        const timeout = setTimeout(() => {
            waapiStartTime.set(
                waapiAnimation.startTime?.toString() ||
                    'waapi start time not available'
            );
            syncStartTime.set(
                syncAnimation.startTime?.toString() ||
                    'sync start time not available'
            );
            waapiExplicitStartTime.set(
                waapiExplicitAnimation.startTime?.toString() ||
                    'waapi explicit start time not available'
            );
            syncExplicitStartTime.set(
                syncExplicitAnimation.startTime?.toString() ||
                    'sync explicit start time not available'
            );
        }, 1000);

        return () => {
            waapiAnimation.stop();
            syncAnimation.stop();
            waapiExplicitAnimation.stop();
            syncExplicitAnimation.stop();
            clearTimeout(timeout);
        };
    });
</script>

<section style="position: relative; display: flex; flex-direction: column; padding: 100px;">
    <motion.div
        bind:this={waapiRef}
        style={{
            width: '100px',
            height: '100px',
            backgroundColor: 'red',
            opacity: 0,
        }}
    />
    <motion.div
        bind:this={syncRef}
        style={{
            width: '100px',
            height: '100px',
            backgroundColor: 'red',
            opacity: opacity.get(),
            y: 0,
        }}
    />
    <pre id="waapi-start-time" class="auto-timer waapi-timer">
        {waapiStartTime.get()}
    </pre>
    <pre id="sync-start-time" class="auto-timer sync-timer">
        {syncStartTime.get()}
    </pre>
    <pre id="waapi-explicit-start-time" class="explicit-timer waapi-timer">
        {waapiExplicitStartTime.get()}
    </pre>
    <pre id="sync-explicit-start-time" class="explicit-timer sync-timer">
        {syncExplicitStartTime.get()}
    </pre>
</section>
