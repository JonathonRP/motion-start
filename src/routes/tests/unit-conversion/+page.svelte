<svelte:options runes={true} />

<script lang="ts">
    import { onMount } from "svelte";
    import { animateMini } from "$lib/motion-start/animation/animators/waapi/animate-style";

    let box: HTMLDivElement | null = null;
    let result = $state("");

    onMount(() => {
        if (!box) return;

        // Animate with em units and let browser resolve to px
        animateMini(
            box,
            { width: ["5em", "10em"] },
            { duration: 0.2, easing: "ease-out" },
        );

        // Check final computed style after settle
        const check = setTimeout(() => {
            if (box) {
                const computed = window.getComputedStyle(box);
                const width = computed.width;
                // With default 16px base, 10em = 160px
                const isSuccess = width === "160px" || parseFloat(width) > 150;
                result = isSuccess ? "Success" : "Mismatch";
            }
        }, 300);

        return () => clearTimeout(check);
    });
</script>

<main class="page">
    <section class="card">
        <header>
            <p class="eyebrow">Phase A</p>
            <h1>Unit conversion</h1>
            <p class="note">Box animates with em units; resolved to px.</p>
        </header>
        <div class="stage">
            <div
                id="unit-box"
                bind:this={box}
                class="box"
                aria-label="unit box"
            ></div>
        </div>
        <footer class="meta">
            <p id="unit-result">{result}</p>
            <p>Expect width 160px (10em @ 16px base).</p>
        </footer>
    </section>
</main>

<style>
    :global(body) {
        background: #0d1019;
        font-size: 16px; /* Ensure base for em calc */
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
        background: linear-gradient(135deg, #131821, #0a0d14);
        border: 1px solid #1e2430;
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
        color: #a6d3ff;
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
        background: #0b0d13;
        border: 1px dashed #202532;
        border-radius: 12px;
    }

    .box {
        height: 80px;
        width: 5em;
        background: linear-gradient(120deg, #6a8cff, #b99eff);
        border-radius: 10px;
        box-shadow: 0 10px 24px rgba(0, 0, 0, 0.35);
    }

    footer.meta {
        color: #9aa0a6;
        font-size: 0.9rem;
        line-height: 1.4;
    }

    #unit-result {
        font-weight: 600;
        color: #8ab4f8;
    }
</style>
