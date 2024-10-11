<script>
    import { Button } from "$lib/components/ui/button";
</script>

<div class="grid gap-1 max-w-full prose container items-center justify-center">
    <h1 class="dark:text-white">Motion-Start Functional tests</h1>
    <h2 class="dark:text-white">Getting started</h2>
    <!-- Stepper -->
    <ul class="relative grid gap-1">
        <!-- Item -->
        <li class="flex items-center gap-x-2 shrink basis-0 flex-1 group">
            <div
                class="min-w-7 min-h-7 inline-flex justify-center items-center text-xs align-middle"
            >
                <span
                    class="size-7 flex justify-center items-center shrink-0 bg-gray-100 font-medium text-gray-800 rounded-full dark:bg-neutral-700 dark:text-white"
                >
                    1
                </span>
                <div class="grid gap-1">
                    <span
                        class="ms-2 block text-lg font-medium text-gray-800 dark:text-white"
                    >
                        Git clone the motion start port/typescript branch
                    </span>
                </div>
            </div>
        </li>
        <!-- End Item -->
        <div class="grid">
            <pre class="text-gray-800 dark:text-white/70 mx-9 max-w-md">https://github.com/JonathonRP/motion-start.git</pre>
        </div>

        <!-- Item -->
        <li class="flex items-center gap-x-2 shrink basis-0 flex-1 group">
            <div
                class="min-w-7 min-h-7 inline-flex justify-center items-center text-xs align-middle"
            >
                <span
                    class="size-7 flex justify-center items-center shrink-0 bg-gray-100 font-medium text-gray-800 rounded-full dark:bg-neutral-700 dark:text-white"
                >
                    2
                </span>
                <span
                    class="ms-2 block text-lg font-medium text-gray-800 dark:text-white"
                >
                    Run <code class="dark:text-white/70">npm | bun | pnpm</code>
                    install for the test repository
                </span>
            </div>
        </li>
        <!-- End Item -->

        <!-- Item -->

        <!-- End Item -->
        <div class="grid">
            <pre
                class="text-gray-800 dark:text-white/70 mx-9 max-w-md">npm link motion-start</pre>
            <pre
                class="text-gray-800 dark:text-white/70 mx-9 max-w-md">bun link motion-start</pre>
            <pre
                class="text-gray-800 dark:text-white/70 mx-9 max-w-md">pnpm link motion-start</pre>
        </div>
        <p class="dark:text-white text-lg mx-9">
            On the test repository directory
        </p>
        <!-- Item -->
        <li class="flex items-center gap-x-2 shrink basis-0 flex-1 group">
            <div
                class=" min-h-7 inline-flex justify-center items-center text-xs align-middle"
            >
                <span
                    class="size-7 flex justify-center items-center shrink-0 bg-gray-100 font-medium text-gray-800 rounded-full dark:bg-neutral-700 dark:text-white"
                >
                    3
                </span>
                <span
                    class="ms-2 block text-lg font-medium text-gray-800 dark:text-white max-w-lg"
                >
                    Run <code class="dark:text-white/70"
                        >npm run dev| bun dev| pnpm run dev
                    </code> on the test repostitory to run the tests
                </span>
            </div>
        </li>
        <!-- End Item -->
    </ul>
    <!-- End Stepper -->
</div>
