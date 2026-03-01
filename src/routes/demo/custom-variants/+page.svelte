<script lang="ts">
    import { motion, AnimatePresence, type Variants } from "$lib/motion-start";
    import { onMount } from "svelte";

    // Test case 0: Simple exit without variants (baseline - proves AnimatePresence works)
    let showSimple = $state(true);

    // Test case 1: Static custom value with variant function
    let showStaticCustom = $state(true);
    const staticCustomValue = 200;

    const staticVariants: Variants = {
        initial: { x: 0, opacity: 1 },
        animate: { x: 0, opacity: 1 },
        exit: (custom: number) => ({
            x: custom,
            opacity: 0,
            transition: { duration: 0.3 },
        }),
    };

    // Test case 2: Dynamic custom value (like Card.svelte swipe pattern)
    let showDynamicCustom = $state(true);
    let exitDirection = $state(0);

    const dynamicVariants: Variants = {
        initial: { x: 0, opacity: 1 },
        animate: { x: 0, opacity: 1 },
        exit: (custom: number) => ({
            x: custom,
            opacity: 0,
            transition: { duration: 0.3 },
        }),
    };

    // Test case 3: Custom object with multiple properties
    let showObjectCustom = $state(true);
    const objectCustomValue = { exitX: 150, exitScale: 0.5 };

    const objectVariants: Variants = {
        initial: { x: 0, scale: 1, opacity: 1 },
        animate: { x: 0, scale: 1, opacity: 1 },
        exit: (custom: { exitX: number; exitScale: number }) => ({
            x: custom?.exitX ?? 0,
            scale: custom?.exitScale ?? 1,
            opacity: 0,
            transition: { duration: 0.3 },
        }),
    };

    // Test case 4: Negative custom value (exit left)
    let showNegativeCustom = $state(true);
    const negativeCustomValue = -200;

    const negativeVariants: Variants = {
        initial: { x: 0, opacity: 1 },
        animate: { x: 0, opacity: 1 },
        exit: (custom: number) => ({
            x: custom,
            opacity: 0,
            transition: { duration: 0.3 },
        }),
    };

    // Test case 5: Variant-only (static exit in variants, no custom prop at all)
    let showVariantOnly = $state(true);

    const variantOnlyVariants: Variants = {
        initial: { x: 0, opacity: 1 },
        animate: { x: 0, opacity: 1 },
        exit: { x: 200, opacity: 0, transition: { duration: 0.3 } },
    };

    // Test case 6: Variant function without using custom (function returns static value)
    let showVariantFunctionNoCustom = $state(true);

    const variantFunctionNoCustomVariants: Variants = {
        initial: { x: 0, opacity: 1 },
        animate: { x: 0, opacity: 1 },
        exit: () => ({ x: 200, opacity: 0, transition: { duration: 0.3 } }),
    };

    onMount(() => {
        (window as any).__customVariantsReady = true;
    });

    function exitLeft() {
        exitDirection = -250;
        setTimeout(() => {
            showDynamicCustom = false;
        }, 10);
    }

    function exitRight() {
        exitDirection = 250;
        setTimeout(() => {
            showDynamicCustom = false;
        }, 10);
    }
</script>

<div class="p-4">
    <h1 class="text-2xl font-bold mb-4">
        Custom + Variants Exit Animation Tests
    </h1>
    <p class="text-green-600 mb-4" data-testid="custom-variants-ready">
        Ready for testing custom prop with variant functions
    </p>

    <!-- Test 0: Simple exit without variants (baseline) -->
    <section class="mb-8 border p-4">
        <h2 class="text-lg font-semibold mb-2">
            Test 0: Simple Exit (baseline - no variants)
        </h2>
        <button
            id="toggle-simple"
            type="button"
            class="px-3 py-1 border rounded"
            onclick={() => (showSimple = !showSimple)}
        >
            Toggle Simple
        </button>
        <div class="h-24 mt-4 relative">
            <AnimatePresence show={showSimple}>
                <motion.div
                    id="simple-box"
                    initial={{ x: 0, opacity: 1 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 200, opacity: 0, transition: { duration: 0.3 } }}
                    class="w-24 h-16 bg-green-500 absolute flex items-center justify-center text-white"
                >
                    Simple
                </motion.div>
            </AnimatePresence>
        </div>
    </section>

    <!-- Test 1: Static custom value -->
    <section class="mb-8 border p-4">
        <h2 class="text-lg font-semibold mb-2">
            Test 1: Static Custom Value (exit right 200px)
        </h2>
        <button
            id="toggle-static-custom"
            type="button"
            class="px-3 py-1 border rounded"
            onclick={() => (showStaticCustom = !showStaticCustom)}
        >
            Toggle Static Custom
        </button>
        <div class="h-24 mt-4 relative">
            <AnimatePresence show={showStaticCustom}>
                <motion.div
                    id="static-custom-box"
                    variants={staticVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    custom={staticCustomValue}
                    class="w-24 h-16 bg-blue-500 absolute flex items-center justify-center text-white"
                >
                    Static
                </motion.div>
            </AnimatePresence>
        </div>
    </section>

    <!-- Test 2: Dynamic custom value -->
    <section class="mb-8 border p-4">
        <h2 class="text-lg font-semibold mb-2">
            Test 2: Dynamic Custom Value (swipe pattern)
        </h2>
        <div class="space-x-2">
            <button
                id="exit-left"
                type="button"
                class="px-3 py-1 border rounded"
                onclick={exitLeft}
            >
                Exit Left (-250)
            </button>
            <button
                id="exit-right"
                type="button"
                class="px-3 py-1 border rounded"
                onclick={exitRight}
            >
                Exit Right (+250)
            </button>
            <button
                id="reset-dynamic"
                type="button"
                class="px-3 py-1 border rounded"
                onclick={() => {
                    showDynamicCustom = true;
                    exitDirection = 0;
                }}
            >
                Reset
            </button>
        </div>
        <div class="h-24 mt-4 relative">
            <AnimatePresence show={showDynamicCustom}>
                <motion.div
                    id="dynamic-custom-box"
                    variants={dynamicVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    custom={exitDirection}
                    class="w-24 h-16 bg-green-500 absolute flex items-center justify-center text-white"
                >
                    Dynamic
                </motion.div>
            </AnimatePresence>
        </div>
        <p class="text-sm text-gray-500 mt-2">exitDirection: {exitDirection}</p>
    </section>

    <!-- Test 3: Object custom value -->
    <section class="mb-8 border p-4">
        <h2 class="text-lg font-semibold mb-2">Test 3: Object Custom Value</h2>
        <button
            id="toggle-object-custom"
            type="button"
            class="px-3 py-1 border rounded"
            onclick={() => (showObjectCustom = !showObjectCustom)}
        >
            Toggle Object Custom
        </button>
        <div class="h-24 mt-4 relative">
            <AnimatePresence show={showObjectCustom}>
                <motion.div
                    id="object-custom-box"
                    variants={objectVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    custom={objectCustomValue}
                    class="w-24 h-16 bg-purple-500 absolute flex items-center justify-center text-white"
                >
                    Object
                </motion.div>
            </AnimatePresence>
        </div>
    </section>

    <!-- Test 4: Negative custom value -->
    <section class="mb-8 border p-4">
        <h2 class="text-lg font-semibold mb-2">
            Test 4: Negative Custom Value (exit left -200px)
        </h2>
        <button
            id="toggle-negative-custom"
            type="button"
            class="px-3 py-1 border rounded"
            onclick={() => (showNegativeCustom = !showNegativeCustom)}
        >
            Toggle Negative Custom
        </button>
        <div class="h-24 mt-4 relative">
            <AnimatePresence show={showNegativeCustom}>
                <motion.div
                    id="negative-custom-box"
                    variants={negativeVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    custom={negativeCustomValue}
                    class="w-24 h-16 bg-red-500 absolute flex items-center justify-center text-white"
                >
                    Negative
                </motion.div>
            </AnimatePresence>
        </div>
    </section>

    <!-- Test 5: Variant-only (static exit, no custom prop) -->
    <section class="mb-8 border p-4">
        <h2 class="text-lg font-semibold mb-2">
            Test 5: Variant Only (static exit in variants, no custom)
        </h2>
        <button
            id="toggle-variant-only"
            type="button"
            class="px-3 py-1 border rounded"
            onclick={() => (showVariantOnly = !showVariantOnly)}
        >
            Toggle Variant Only
        </button>
        <div class="h-24 mt-4 relative">
            <AnimatePresence show={showVariantOnly}>
                <motion.div
                    id="variant-only-box"
                    variants={variantOnlyVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    class="w-24 h-16 bg-orange-500 absolute flex items-center justify-center text-white"
                >
                    Variant
                </motion.div>
            </AnimatePresence>
        </div>
    </section>

    <!-- Test 6: Variant function without custom -->
    <section class="mb-8 border p-4">
        <h2 class="text-lg font-semibold mb-2">
            Test 6: Variant Function (no custom parameter used)
        </h2>
        <button
            id="toggle-variant-function-no-custom"
            type="button"
            class="px-3 py-1 border rounded"
            onclick={() =>
                (showVariantFunctionNoCustom = !showVariantFunctionNoCustom)}
        >
            Toggle Variant Function
        </button>
        <div class="h-24 mt-4 relative">
            <AnimatePresence show={showVariantFunctionNoCustom}>
                <motion.div
                    id="variant-function-no-custom-box"
                    variants={variantFunctionNoCustomVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    class="w-24 h-16 bg-pink-500 absolute flex items-center justify-center text-white"
                >
                    Fn No Custom
                </motion.div>
            </AnimatePresence>
        </div>
    </section>
</div>
