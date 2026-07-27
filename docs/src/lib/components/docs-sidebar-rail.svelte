<script lang="ts">
	import { page } from "$app/state";
	import { motion, useSpring, useReducedMotion } from "motion-start";
	import { onMount } from "svelte";

	/**
	 * A single active-route indicator for the docs sidebar.
	 *
	 * @svecodocs/kit renders its own sidebar and doesn't export the primitives,
	 * so we can't put a `layoutId` rail inside each nav item. Instead we render
	 * one rail and spring it to whichever item is currently active — which is
	 * what a shared-layout animation would do anyway.
	 *
	 * The rail is portalled into [data-sidebar="content"] so it scrolls with the
	 * nav and is positioned against the same box we measure against.
	 */

	const SELECTOR = '[data-sidebar="content"] [data-sidebar="menu-button"][data-active="true"]';

	const shouldReduceMotion = useReducedMotion();

	const y = useSpring(0, { stiffness: 700, damping: 46, mass: 0.7 });
	const height = useSpring(0, { stiffness: 700, damping: 46, mass: 0.7 });

	let container = $state<HTMLElement | null>(null);
	let visible = $state(false);
	let measured = false;

	function portal(node: HTMLElement) {
		const target = document.querySelector<HTMLElement>('[data-sidebar="content"]');
		if (!target) return;

		// The rail is absolutely positioned against this box.
		if (getComputedStyle(target).position === "static") {
			target.style.position = "relative";
		}
		target.appendChild(node);
		container = target;

		return {
			destroy() {
				node.remove();
			},
		};
	}

	function measure() {
		if (!container) return;

		const active = document.querySelector<HTMLElement>(SELECTOR);
		if (!active) {
			visible = false;
			return;
		}

		const activeBox = active.getBoundingClientRect();
		const containerBox = container.getBoundingClientRect();

		// Inset the rail slightly so it reads as a marker, not a full-height bar.
		const inset = activeBox.height * 0.2;
		const top = activeBox.top - containerBox.top + container.scrollTop + inset;
		const railHeight = activeBox.height - inset * 2;

		// Don't animate in from 0 on first paint — snap to the starting position.
		if (!measured || shouldReduceMotion()) {
			y.jump(top);
			height.jump(railHeight);
			measured = true;
		} else {
			y.set(top);
			height.set(railHeight);
		}

		visible = true;
	}

	onMount(() => {
		measure();

		const observer = new ResizeObserver(() => measure());
		if (container) observer.observe(container);

		window.addEventListener("resize", measure);

		return () => {
			observer.disconnect();
			window.removeEventListener("resize", measure);
		};
	});

	// Re-measure whenever the route changes. The nav re-renders its active item
	// first, so wait a frame before reading layout back.
	$effect(() => {
		page.url.pathname;
		if (!container) return;
		requestAnimationFrame(measure);
	});
</script>

<div use:portal class="contents">
	<motion.div
		aria-hidden="true"
		class="ms-sidebar-rail"
		style={{ y, height }}
		animate={{ opacity: visible ? 1 : 0 }}
		transition={{ duration: 0.15 }}
	/>
</div>

<style>
:global(.ms-sidebar-rail) {
	position: absolute;
	left: 0;
	top: 0;
	width: 2px;
	border-radius: 2px;
	background: var(--ms-rail);
	pointer-events: none;
}
</style>
