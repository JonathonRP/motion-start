<!-- AnimatePresence bug-fix playground demo
     Paste this into svelte.dev/playground to test the fixes from this PR.

     HOW TO GET THE IMPORT URL:
       1. Find the latest commit SHA on this PR (first 7+ chars shown in GitHub)
       2. Replace {sha} in the import below with that SHA
       (served via jsDelivr from GitHub — no CI wait needed)

     Demonstrates three fixes on branch: claude/fix-animate-presence-bug-rpmhw

     Bug 1 — presenceAffectsLayout was a no-op (Effect 2 always tracked isPresent directly).
             Fixed with untrack() so only the right effect owns context updates.
             → Toggle the checkbox: with it ON siblings A & B shift during exit;
               with it OFF they stay put.

     Bug 2 — Race condition: element.isPresent was set in a deferred $: block,
             letting the framesync batcher read a stale value.
             Fixed with a synchronous presenceContext.subscribe() call.
             → Rapid-click Hide/Show: exit animation always fires correctly.

     Bug 3 — Double safeToRemove: layout-animation path and exit-animation path
             could both call onExitComplete for the same element.
             Fixed with an early-return guard in memoContext.onExitComplete.
             → "onExitComplete called" counter increments by exactly 1 per hide.
-->
<script>
  // Replace {sha} with the latest commit SHA on this PR (from GitHub)
  import { Motion, AnimatePresence } from 'https://cdn.jsdelivr.net/gh/JonathonRP/motion-start@{sha}/dist/cdn/index.js';

  let isVisible = true;
  let presenceAffectsLayout = true;
  let exitCount = 0;

  function toggle() {
    isVisible = !isVisible;
  }
</script>

<style>
  :global(*) { box-sizing: border-box; margin: 0; }

  .demo {
    font-family: sans-serif;
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 32px;
    max-width: 480px;
  }

  h2 { font-size: 1.1rem; font-weight: 600; color: #1e293b; }

  .controls {
    display: flex;
    gap: 12px;
    align-items: center;
    flex-wrap: wrap;
  }

  button {
    padding: 7px 18px;
    background: #6366f1;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
  }

  button:hover { background: #4f46e5; }

  label {
    display: flex;
    gap: 6px;
    align-items: center;
    font-size: 14px;
    cursor: pointer;
    color: #475569;
    user-select: none;
  }

  .stage {
    display: flex;
    gap: 12px;
    align-items: center;
    height: 80px;
  }

  .box {
    width: 64px;
    height: 64px;
    background: #e2e8f0;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 1rem;
    color: #334155;
    flex-shrink: 0;
  }

  .box.present {
    background: #6366f1;
    color: white;
    font-size: 1.4rem;
  }

  .hints {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .hint {
    font-size: 13px;
    color: #64748b;
    line-height: 1.4;
  }

  .hint strong { color: #1e293b; }
</style>

<div class="demo">
  <h2>AnimatePresence — bug-fix demo</h2>

  <div class="controls">
    <button onclick={toggle}>
      {isVisible ? 'Hide' : 'Show'}
    </button>
    <label>
      <input type="checkbox" bind:checked={presenceAffectsLayout} />
      presenceAffectsLayout
    </label>
  </div>

  <!-- Stage: sibling boxes A and B flank the animated element.
       With presenceAffectsLayout=true they should shift during exit (Bug 1).
       With presenceAffectsLayout=false they should stay put. -->
  <div class="stage">
    <div class="box">A</div>

    <AnimatePresence
      {presenceAffectsLayout}
      list={isVisible ? [{ key: 'item' }] : []}
      let:item
      onExitComplete={() => exitCount++}
    >
      <Motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.5 }}
        transition={{ duration: 0.35 }}
        class="box present"
      >
        ✓
      </Motion.div>
    </AnimatePresence>

    <div class="box">B</div>
  </div>

  <div class="hints">
    <p class="hint">
      <strong>Bug 1 — presenceAffectsLayout:</strong>
      checkbox ON → A & B slide together when hiding.
      checkbox OFF → A & B stay put.
    </p>
    <p class="hint">
      <strong>Bug 2 — race condition:</strong>
      rapid-click Hide/Show — exit animation should always fire.
    </p>
    <p class="hint">
      <strong>Bug 3 — double safeToRemove:</strong>
      onExitComplete called <strong>{exitCount}</strong> time{exitCount !== 1 ? 's' : ''}.
      Should equal the number of times you clicked Hide (never double).
    </p>
  </div>
</div>
