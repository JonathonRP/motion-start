<script lang="ts">
    import { motion, AnimatePresence } from "$lib/motion-start";

    let showItem = $state(false);
    let waitMode = $state(true);
    let conditionalShow = $state(false);
    const waitItems = $derived(waitMode ? [{ key: "wait1" }] : [{ key: "wait2" }]);
    const conditionalItems = $derived(conditionalShow ? [{ key: "conditional" }] : []);
    import { onMount } from "svelte";
    onMount(() => {
        // ultra-early readiness flag for Cypress gating
        (window as any).__apReady = true;
        console.log("[ap] mounted, __apReady=true");
    });
    
    $effect(() => {
        console.log('[ap] showItem changed to:', showItem);
    });
    
    $effect(() => {
        console.log('[ap] waitMode changed to:', waitMode);
    });
    
    $effect(() => {
        console.log('[ap] conditionalShow changed to:', conditionalShow);
    });
</script>

<div class="container">
    <h1>Phase E: AnimatePresence Tests</h1>
    <p class="success" data-testid="ap-ready">
        ✅ AnimatePresence infinite loop bug (motion-start-3xu) fixed!
    </p>
    <div data-testid="ap-ready-root">ready</div>

    <!-- Exit animation test -->
    <section>
        <h2>Exit Animation</h2>
        <button
            id="toggle-btn"
            type="button"
            onclick={() => (showItem = !showItem)}
        >
            Toggle Item
        </button>

        <AnimatePresence show={showItem}>
            <motion.div
                id="animated-item"
                class="animated-box"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                I should fade out!
            </motion.div>
        </AnimatePresence>
    </section>

    <!-- Mode wait test -->
    <section>
        <h2>Mode Wait (Exit Before Enter)</h2>
        <button
            id="mode-wait-toggle"
            type="button"
            onclick={() => (waitMode = !waitMode)}
        >
            Toggle Wait Mode
        </button>

        <AnimatePresence mode="wait" values={waitItems} let:item>
            {#if item.key === "wait1"}
                <motion.div
                    id="wait-item-1"
                    class="animated-box"
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 100, opacity: 0 }}
                >
                    Wait Item 1
                </motion.div>
            {:else}
                <motion.div
                    id="wait-item-2"
                    class="animated-box"
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 100, opacity: 0 }}
                >
                    Wait Item 2
                </motion.div>
            {/if}
        </AnimatePresence>
    </section>

    <!-- Conditional rendering -->
    <section>
        <h2>Conditional Show/Hide</h2>
        <button
            id="conditional-toggle"
            type="button"
            onclick={() => (conditionalShow = !conditionalShow)}
        >
            Toggle Conditional
        </button>

        <AnimatePresence values={conditionalItems} let:item>
            <motion.div
                id="conditional-item"
                class="animated-box"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
            >
                Conditional Item
            </motion.div>
        </AnimatePresence>
    </section>
</div>

<style>
    .container {
        padding: 20px;
        max-width: 800px;
        margin: 0 auto;
    }

    h1 {
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 20px;
    }

    .warning {
        color: #dc2626;
        background: #fef2f2;
        padding: 12px;
        border-radius: 6px;
        margin-bottom: 20px;
        font-weight: 500;
    }

    .success {
        color: #065f46;
        background: #d1fae5;
        padding: 12px;
        border-radius: 6px;
        margin-bottom: 20px;
        font-weight: 500;
    }

    h2 {
        font-size: 18px;
        font-weight: 600;
        margin: 20px 0 10px;
    }

    section {
        margin-bottom: 40px;
        padding: 20px;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
    }

    button {
        background: #3b82f6;
        color: white;
        padding: 8px 16px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        margin-bottom: 15px;
    }

    button:hover {
        background: #2563eb;
    }

    .animated-box {
        width: 200px;
        height: 100px;
        background: #10b981;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        margin-top: 10px;
        font-weight: 500;
    }
</style>
