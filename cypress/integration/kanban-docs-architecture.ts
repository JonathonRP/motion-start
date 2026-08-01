const demoPath = 'sites/docs/src/lib/components/demos/kanban-demo.svelte';

/**
 * These specs pin down the exact architecture the docs kanban demo must
 * follow, independent of `kanban-docs-demo.ts` which covers the Reorder +
 * shared-layout composition contract:
 *
 *  - every column's Reorder.Group receives the same full, stable `cards`
 *    array (not a per-column filtered slice), so the keyed `{#each}` inside
 *    Reorder.Group never tears an in-flight card down when it changes column;
 *  - which column actually renders a card is decided with a plain `{#if}`
 *    inside the group's snippet, gated on the card's committed/preview
 *    column, rather than by filtering `values`;
 *  - Reorder.Group/Reorder.Item keep their default semantic `<ul>`/`<li>`
 *    elements (no `as` overrides);
 *  - reordering inside the source column is ignored while another column is
 *    being previewed as the cross-column drop target.
 */
describe('Docs kanban demo architecture contract', () => {
	it('gives every column Reorder.Group the same full, stable cards array', () => {
		cy.readFile(demoPath).then((source: string) => {
			const groupOpenTags = source.match(/<Reorder\.Group\b[\s\S]*?>/g) ?? [];

			expect(groupOpenTags.length, 'expected at least one Reorder.Group').to.be.at.least(1);

			const valuesExpressions = groupOpenTags.map((tag) => tag.match(/\bvalues=\{([^}]*)\}/)?.[1]?.trim());

			const everyGroupGetsFullCardsArray = valuesExpressions.every((expression) => expression === 'cards');
			expect(
				everyGroupGetsFullCardsArray,
				`every Reorder.Group should receive values={cards} verbatim (the same full, stable array), found values expressions:\n${valuesExpressions.join('\n---\n')}`
			).to.equal(true);
		});
	});

	it('renders a card conditionally by its committed/preview column instead of filtering values', () => {
		cy.readFile(demoPath).then((source: string) => {
			const snippetBlocks = source.match(/\{#snippet children\(\{[\s\S]*?\{\/snippet\}/g) ?? [];

			expect(snippetBlocks.length, 'expected a children snippet per Reorder.Group').to.be.at.least(1);

			const everySnippetGatesRenderingByColumn = snippetBlocks.every((block) =>
				/\{#if\b[^}]*column\b[^}]*\}[\s\S]*<Reorder\.Item\b/.test(block)
			);
			expect(
				everySnippetGatesRenderingByColumn,
				`each Reorder.Item should be wrapped in an {#if} that checks the card's render column, found:\n${snippetBlocks.join('\n---\n')}`
			).to.equal(true);
		});
	});

	it('uses the default semantic ul/li elements for Reorder.Group and Reorder.Item', () => {
		cy.readFile(demoPath).then((source: string) => {
			const groupOverridesElement = /<Reorder\.Group\b[^>]*\bas=/.test(source);
			const itemOverridesElement = /<Reorder\.Item\b[^>]*\bas=/.test(source);

			expect(groupOverridesElement, 'Reorder.Group should not override its default <ul> with `as`').to.equal(false);
			expect(itemOverridesElement, 'Reorder.Item should not override its default <li> with `as`').to.equal(false);
		});
	});

	it('ignores source-column reorder while another column is being previewed', () => {
		cy.readFile(demoPath).then((source: string) => {
			const handleColumnReorder = source.match(/function handleColumnReorder\([^)]*\)\s*\{[\s\S]*?\n\t\}/)?.[0];

			expect(handleColumnReorder, 'expected a shared column reorder handler').to.be.a('string');
			expect(source, 'expected each column to delegate to the shared reorder handler').to.match(
				/onReorder=\{[^}]*handleColumnReorder\(column,\s*next\)[^}]*\}/
			);

			expect(handleColumnReorder, 'the shared handler should branch while a cross-column preview is active').to.match(
				/if\s*\([^)]*preview[^)]*\)/i
			);
			expect(
				handleColumnReorder,
				'the source column should return without reordering during a target-column preview'
			).to.match(/if\s*\(\s*previewColumn\s*!==\s*column\s*\|\|\s*!draggingId\s*\)\s*return/);
		});
	});
});
