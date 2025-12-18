<svelte:options runes={true} />

<script lang="ts">
import { onMount } from 'svelte';
import { animateMini } from '$lib/motion-start/animation/animators/waapi/animate-style';

let box: HTMLDivElement | null = null;

onMount(() => {
	if (!box) return;
	// Animate width on mount to mirror animate-style coverage
	animateMini(box, { width: ['100px', '200px'] }, { duration: 0.25, easing: 'ease-out' });
});
</script>

<main class="page">
    <section class="card">
        <header>
            <p class="eyebrow">Phase A</p>
            <h1>animate-style</h1>
            <p class="note">Width animates from 100px to 200px on mount.</p>
        </header>
        <div class="stage">
            <div
                id="animate-style-box"
                bind:this={box}
                class="box"
                aria-label="animate-style box"
            ></div>
        </div>
        <footer class="meta">Expect width to settle at 200px.</footer>
    </section>
</main>

<style>
    :global(body) {
        background: #0f1115;
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
        background: linear-gradient(135deg, #151821, #0c0f16);
        border: 1px solid #1f2430;
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
        color: #8ab4f8;
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
        background: #0b0d12;
        border: 1px dashed #202532;
        border-radius: 12px;
    }

    .box {
        height: 80px;
        width: 100px;
        background: linear-gradient(120deg, #7c5df7, #5ec4ff);
        border-radius: 10px;
        box-shadow: 0 10px 24px rgba(0, 0, 0, 0.35);
    }

    footer.meta {
        color: #9aa0a6;
        font-size: 0.9rem;
    }
</style>
