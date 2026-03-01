<script lang="ts">
    import { motion } from '$lib/motion-start';

    let state = $state(false);
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<section
    style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        padding: '100px',
    }}
>
    <motion.div
        id="box"
        transition={{ duration: 0 }}
        initial={{ transform: 'scale(1)', opacity: 1 }}
        animate={{
            transform: `scale(${state ? 1 : 2})`,
            opacity: state ? 1 : 0,
        }}
        onclick={() => state = !state}
        style={{
            width: '100px',
            height: '100px',
            position: 'relative',
            top: '100px',
            left: '100px',
            backgroundColor: 'red',
            opacity: 1,
        }}
    >
        Content
    </motion.div>
</section>
