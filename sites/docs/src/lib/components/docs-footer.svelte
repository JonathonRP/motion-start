<script lang="ts">
	import { motion } from "motion-start";

	/**
	 * The docs footer.
	 *
	 * @svecodocs/kit hardcodes its own <footer> inside DocsLayout and takes no
	 * props for it, so it can't be configured — it credits Svecosystem and
	 * carries a theme dropdown and social buttons the design doesn't have. We
	 * hide it in app.css and portal this one into the same place instead.
	 */

	const year = new Date().getFullYear();

	const links = [
		{ label: "GitHub", href: "https://github.com/JonathonRP/motion-start" },
		{ label: "npm", href: "https://www.npmjs.com/package/motion-start" },
		{ label: "Framer Motion", href: "https://motion.dev" },
	];

	function portal(node: HTMLElement) {
		// Sidebar.Inset is the <main> wrapping the content row; the kit's footer
		// is its last child, so ours goes in the same slot.
		const target = document.querySelector<HTMLElement>("main:has(> #content)");
		if (!target) return;

		target.appendChild(node);

		return {
			destroy() {
				node.remove();
			},
		};
	}
</script>

<div use:portal class="contents">
	<footer class="ms-footer">
		<span class="ms-footer-mark">motion start</span>
		<span class="ms-footer-meta">&copy; {year} &middot; MIT</span>

		<nav class="ms-footer-links">
			{#each links as link (link.href)}
				<motion.a
					href={link.href}
					target="_blank"
					rel="noopener noreferrer"
					class="ms-footer-link"
					whileHover={{ y: -2 }}
					transition={{ type: "spring", stiffness: 500, damping: 30 }}
				>
					{link.label}
				</motion.a>
			{/each}
		</nav>
	</footer>
</div>

<style>
	:global(.ms-footer) {
		display: flex;
		align-items: baseline;
		gap: var(--ms-space-sm);
		margin: var(--ms-space-xl) var(--ms-space-md) 0;
		padding: var(--ms-space-sm) 0 var(--ms-space-lg);
		border-top: 1px solid color-mix(in oklab, var(--color-border) 70%, transparent);
		font-family: var(--font-mono);
		font-size: var(--ms-text-nudge);
		letter-spacing: -0.01em;
	}

	:global(.ms-footer-mark) {
		color: var(--color-foreground);
		font-weight: 500;
	}

	:global(.ms-footer-meta) {
		color: color-mix(in oklab, var(--color-foreground-alt) 80%, transparent);
	}

	:global(.ms-footer-links) {
		display: flex;
		gap: var(--ms-space-md);
		margin-left: auto;
	}

	:global(.ms-footer-link) {
		display: inline-block;
		color: var(--color-foreground-alt);
		text-decoration: none;
		transition: color 160ms ease;
	}

	:global(.ms-footer-link:hover) {
		color: var(--ms-section);
	}
</style>
