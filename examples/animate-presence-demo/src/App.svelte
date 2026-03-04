<script>
  import { Motion, AnimatePresence } from 'motion-start';

  let isVisible = true;
  let presenceAffectsLayout = true;
  let exitCount = 0;

  function toggle() {
    isVisible = !isVisible;
  }
</script>

<style>
  :global(*) { box-sizing: border-box; margin: 0; }
  :global(body) { background: #f8fafc; }

  .demo {
    font-family: sans-serif;
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 32px;
    max-width: 480px;
    margin: 0 auto;
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

  .box:global(.present) {
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
    <button on:click={toggle}>
      {isVisible ? 'Hide' : 'Show'}
    </button>
    <label>
      <input type="checkbox" bind:checked={presenceAffectsLayout} />
      presenceAffectsLayout
    </label>
  </div>

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
