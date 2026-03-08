<script lang="ts">
    import { Button } from "./ui/button";
    let isRefreshing = false;
    let isPressing = false;
    export let id = null;
    export let onclick = () => {};
</script>

<Button
    {id}
    onpointerdown={async () => {
        isPressing = true;
        isRefreshing = true;
        // simulate waiting for spinner to finish
        await new Promise((resolve) => setTimeout(resolve, 1200));
        isRefreshing = false;
    }}
    onpointerup={async () => {
        // simulate motion duration effect with whilePress
        await new Promise((resolve) => setTimeout(resolve, 200));
        isPressing = false;
    }}
    {onclick}
    variant="outline"
    class="bg-gray-700/30 border-white/30 text-white {isPressing
        ? 'scale-93'
        : ''} transition-all duration-380"
    size="sm"
>
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.6"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="lucide lucide-rotate-ccw {isRefreshing
            ? 'animate-spin direction-reverse delay-250'
            : ''}"
        ><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path
            d="M3 3v5h5"
        /></svg
    >
</Button>
