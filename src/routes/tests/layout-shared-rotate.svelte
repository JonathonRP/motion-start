<script lang="ts">
    import { motion } from '$lib/motion-start';

    let state = $state(false);
    const size = $derived(state ? 100 : 200);
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
{#key state ? 'a' : 'b'}
    <motion.div
        id="box"
        data-testid="box"
        layoutId="box"
        style={{
            rotate: 45,
            width: size,
            height: size,
            backgroundColor: 'red',
        }}
        onclick={() => state = !state}
        transition={{
            duration: 10,
            ease: state ? () => 0.5 : () => 0,
        }}
    />
{/key}
