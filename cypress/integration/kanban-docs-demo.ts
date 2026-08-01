const demoPath = 'sites/docs/src/lib/components/demos/kanban-demo.svelte';

describe('Docs kanban demo composition', () => {
	it('combines per-column Reorder lists with shared-layout free dragging', () => {
		cy.readFile(demoPath).then((source: string) => {
			const contract = {
				importsReorder: /import\s*\{[^}]*\bReorder\b[^}]*\}\s*from\s*["']motion-start["']/.test(source),
				hasReorderGroup: /<Reorder\.Group\b[\s\S]*?\bvalues=\{[\s\S]*?\bonReorder=/.test(source),
				hasReorderItem: /<Reorder\.Item\b[\s\S]*?\bvalue=\{card\}/.test(source),
				keepsCardIdentity: /card\.order\s*=\s*index/.test(source) && !/cards\s*=\s*cards\.map/.test(source),
				preservesSharedFreeDrag:
					/<Reorder\.Item\b[\s\S]*?\blayoutId=\{card\.id\}[\s\S]*?\sdrag(?:\s|=)[\s\S]*?\bonDrag=\{[\s\S]*?\bonDragEnd=\{/.test(
						source
					),
			};

			expect(contract).to.deep.equal({
				importsReorder: true,
				hasReorderGroup: true,
				hasReorderItem: true,
				keepsCardIdentity: true,
				preservesSharedFreeDrag: true,
			});
		});
	});
});
