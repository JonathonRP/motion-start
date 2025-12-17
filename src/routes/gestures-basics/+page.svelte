<script>
    let container;
    let draggable;
    let dragging = false;
    let startX = 0;
    let startY = 0;
    let posX = 50;
    let posY = 50;

    function onPointerDown(e) {
        dragging = true;
        draggable.setPointerCapture(e.pointerId);
        startX = e.clientX - posX;
        startY = e.clientY - posY;
    }

    function onPointerMove(e) {
        if (!dragging) return;
        const rect = container.getBoundingClientRect();
        const size = 80;
        let x = e.clientX - startX;
        let y = e.clientY - startY;
        // constrain within container
        x = Math.max(0, Math.min(x, rect.width - size));
        y = Math.max(0, Math.min(y, rect.height - size));
        posX = x;
        posY = y;
        draggable.style.transform = `translate(${posX}px, ${posY}px)`;
    }

    function onPointerUp(e) {
        dragging = false;
        draggable.releasePointerCapture?.(e.pointerId);
    }

    function toggleHover(el, hovering) {
        el.classList.toggle("hovered", hovering);
    }

    function toggleTap(el, active) {
        el.classList.toggle("tapped", active);
    }
</script>

<div id="gestures" style="display:grid; gap:16px;">
    <div id="drag-area" class="container" bind:this={container}>
        <div
            id="draggable"
            class="draggable"
            role="button"
            tabindex="0"
            bind:this={draggable}
            style={`transform: translate(${posX}px, ${posY}px)`}
            on:pointerdown={onPointerDown}
            on:pointermove={onPointerMove}
            on:pointerup={onPointerUp}
            on:pointercancel={onPointerUp}
        >
            Drag me
        </div>
    </div>

    <div
        id="hover-box"
        class="box"
        role="button"
        tabindex="0"
        on:mouseenter={(e) => toggleHover(e.currentTarget, true)}
        on:mouseleave={(e) => toggleHover(e.currentTarget, false)}
    >
        Hover me
    </div>

    <div
        id="tap-box"
        class="box"
        role="button"
        tabindex="0"
        on:mousedown={(e) => toggleTap(e.currentTarget, true)}
        on:mouseup={(e) => toggleTap(e.currentTarget, false)}
        on:mouseleave={(e) => toggleTap(e.currentTarget, false)}
    >
        Tap me
    </div>
</div>

<style>
    .container {
        width: 300px;
        height: 200px;
        border: 1px solid #ccc;
        position: relative;
    }
    .draggable {
        width: 80px;
        height: 80px;
        background: #0ea5e9;
        position: absolute;
        border-radius: 8px;
        touch-action: none;
    }
    .box {
        width: 120px;
        height: 60px;
        background: #e5e7eb;
        border-radius: 6px;
        display: grid;
        place-items: center;
        transition:
            transform 0.2s ease,
            background 0.2s ease;
    }
    #hover-box.hovered {
        background: #fde68a;
        transform: scale(1.05);
    }
    #tap-box.tapped {
        background: #fca5a5;
        transform: scale(0.95);
    }
</style>
