<script lang="ts">
	/**
	 * The landing page is dark by design and has no theme toggle of its own.
	 *
	 * ModeWatcher lives inside the kit's DocsLayout, which only wraps the
	 * (docs) group — so this route otherwise renders with no `dark` class at
	 * all and every `.dark` rule in app.css is dead here. Pin the class while
	 * the landing is mounted and restore whatever was there on the way out, so
	 * we don't clobber a choice the user made in the docs.
	 */

	let { children } = $props();

	$effect(() => {
		const root = document.documentElement;
		const hadDark = root.classList.contains("dark");

		root.classList.add("dark");

		return () => {
			if (!hadDark) root.classList.remove("dark");
		};
	});
</script>

{@render children?.()}
