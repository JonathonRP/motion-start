<script lang="ts">
    import { motion } from '$lib/motion-start';

    let state = $state(false);
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<svg
    width="250"
    height="250"
    viewBox="0 0 250 250"
    xmlns="http://www.w3.org/2000/svg"
    onclick={() => state = !state}
    style="--color: #f00;"
>
    <motion.circle
        initial={false}
        cx={125}
        cy={125}
        r="100"
        animate={{ fill: state ? 'var(--color)' : '#00f' }}
        transition={{ duration: 3, ease: () => 0.5 }}
    />
</svg>
