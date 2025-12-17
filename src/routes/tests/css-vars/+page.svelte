<svelte:options runes={true} />

<script lang="ts">
    import { onMount } from "svelte";

    let size = $state(120);
    let status = $state("Pending");

    onMount(() => {
        const timer = setTimeout(() => {
            size = 150;
            status = "Success";
        }, 120);
        return () => clearTimeout(timer);
    });
</script>

<main class="page" style={`--box-size: ${size}px`}>
    <section class="card">
        <header>
            <p class="eyebrow">Phase A</p>
            <h1>CSS variables</h1>
            <p class="note">Box uses CSS var that updates after mount.</p>
        </header>
        <div class="stage">
            <div id="css-vars-box" class="box" aria-label="css vars box">
                {status}
            </div>
        </div>
        <footer class="meta">Expect size 150px and status "Success".</footer>
    </section>
</main>

<style>
    :global(body) {
        background: #0d1017;
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
        background: linear-gradient(135deg, #131722, #0b0e16);
        border: 1px solid #1c2230;
        border-radius: 16px;
        padding: 1.5rem;
        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.45);
    }

    header h1 {
        margin: 0.1rem 0;
        font-size: 1.4rem;
    }

    header .eyebrow {
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: #7bd4ff;
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
        background: #0a0d12;
        border: 1px dashed #202532;
        border-radius: 12px;
    }

    .box {
        width: var(--box-size);
        height: var(--box-size);
        background: linear-gradient(120deg, #3ec6ff, #7c5df7);
        border-radius: 12px;
        display: grid;
        place-items: center;
        font-weight: 700;
        box-shadow: 0 10px 24px rgba(0, 0, 0, 0.35);
    }

    footer.meta {
        color: #9aa0a6;
        font-size: 0.9rem;
    }
</style>
