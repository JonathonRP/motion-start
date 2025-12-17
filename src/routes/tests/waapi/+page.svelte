<svelte:options runes={true} />

<script lang="ts">
    import { onMount } from "svelte";
    import { animateMini } from "$lib/motion-start/animation/animators/waapi/animate-style";

    let box: HTMLDivElement | null = null;
    let log = $state<string[]>([]);

    onMount(() => {
        if (!box) return;
        log = [...log, "start"];
        const first = animateMini(
            box,
            { width: ["100px", "180px"], opacity: [1, 0.35] },
            { duration: 0.45, easing: "ease-out" },
        );

        const interrupt = setTimeout(() => {
            log = [...log, "interrupt"];
            first.stop();
            animateMini(
                box,
                { width: ["180px", "120px"], opacity: [0.35, 1] },
                { duration: 0.15, easing: "linear" },
            );
        }, 180);

        return () => {
            clearTimeout(interrupt);
            first.stop();
        };
    });
</script>

<main class="page">
    <section class="card">
        <header>
            <p class="eyebrow">Phase A</p>
            <h1>WAAPI interruptions</h1>
            <p class="note">
                Box animates then is interrupted to a new target.
            </p>
        </header>
        <div class="stage">
            <div
                id="waapi-box"
                bind:this={box}
                class="box"
                aria-label="waapi box"
            ></div>
        </div>
        <footer class="meta">
            <p>Events: {log.join(" → ")}</p>
            <p>Expect final width ~120px and opacity ~1.</p>
        </footer>
    </section>
</main>

<style>
    :global(body) {
        background: #0c0f14;
    }

    .page {
        min-height: 100vh;
        padding: 2rem;
        display: grid;
        place-items: center;
        color: #e8eaed;
        font-family:
            "Inter",
            system-ui,
            -apple-system,
            sans-serif;
    }

    .card {
        width: min(520px, 90vw);
        background: linear-gradient(135deg, #151923, #0b0e15);
        border: 1px solid #1d2230;
        border-radius: 16px;
        padding: 1.5rem;
        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4);
    }

    header h1 {
        margin: 0.1rem 0;
        font-size: 1.4rem;
    }

    header .eyebrow {
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: #ffb86c;
        font-size: 0.75rem;
        margin: 0;
    }

    header .note {
        color: #9aa0a6;
        margin: 0.4rem 0 0;
    }

    .stage {
        margin: 1.25rem 0;
        height: 200px;
        display: grid;
        place-items: center;
        background: #090c12;
        border: 1px dashed #202532;
        border-radius: 12px;
    }

    .box {
        height: 80px;
        width: 100px;
        background: linear-gradient(120deg, #ff7f57, #ffc857);
        border-radius: 10px;
        box-shadow: 0 10px 24px rgba(0, 0, 0, 0.35);
        opacity: 1;
    }

    footer.meta {
        color: #9aa0a6;
        font-size: 0.9rem;
        line-height: 1.4;
    }
</style>
