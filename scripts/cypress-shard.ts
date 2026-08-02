import { readdir } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = fileURLToPath(new URL('..', import.meta.url));
const specDirectory = join(repositoryRoot, 'cypress', 'integration');

// Cypress-reported durations from Actions job 91408118429. The partitioner
// adds a small per-spec allowance and uses 10 seconds for newly added specs.
export const observedSeconds: Record<string, number> = {
	'cypress/integration/animate-layout-timing.ts': 6,
	'cypress/integration/animate-presence-mode-demo.ts': 13,
	'cypress/integration/animate-presence-mode-list.ts': 10,
	'cypress/integration/animate-presence-outro.ts': 15,
	'cypress/integration/animate-presence-pop.ts': 5,
	'cypress/integration/animate-presence-remove.ts': 3,
	'cypress/integration/animate-presence-stack.ts': 3,
	'cypress/integration/animate-presence-switch-waapi.ts': 5,
	'cypress/integration/animate-reverse.ts': 4,
	'cypress/integration/animate-style.ts': 16,
	'cypress/integration/animate-unit-types.ts': 6,
	'cypress/integration/appear-ssr.ts': 2,
	'cypress/integration/css-vars.ts': 4,
	'cypress/integration/drag-framer-page.ts': 3,
	'cypress/integration/drag-nested.ts': 60,
	'cypress/integration/drag-svg.ts': 22,
	'cypress/integration/drag-tabs.ts': 15,
	'cypress/integration/drag-to-reorder.ts': 17,
	'cypress/integration/drag.ts': 46,
	'cypress/integration/kanban-cross-column-reorder.ts': 5,
	'cypress/integration/kanban-docs-architecture.ts': 0,
	'cypress/integration/kanban-docs-demo.ts': 0,
	'cypress/integration/kanban-docs-live.ts': 8,
	'cypress/integration/kanban-multi-list.ts': 3,
	'cypress/integration/layout-cancelled-finishes.ts': 3,
	'cypress/integration/layout-exit.ts': 3,
	'cypress/integration/layout-instant-undo.ts': 2,
	'cypress/integration/layout-relative-delay.ts': 2,
	'cypress/integration/layout-relative-drag.ts': 3,
	'cypress/integration/layout-resize.ts': 3,
	'cypress/integration/layout-shared-cross-parent.ts': 8,
	'cypress/integration/layout-shared-lightbox-crossfade-repeated.ts': 0,
	'cypress/integration/layout-shared-lightbox-crossfade.ts': 6,
	'cypress/integration/layout-shared.ts': 65,
	'cypress/integration/layout-viewport-jump.ts': 4,
	'cypress/integration/layout.ts': 17,
	'cypress/integration/presence-affects-layout.ts': 21,
	'cypress/integration/scroll.ts': 21,
	'cypress/integration/svg.ts': 6,
	'cypress/integration/unit-conversion.ts': 10,
	'cypress/integration/waapi.ts': 16,
	'cypress/integration/while-in-view.ts': 10,
};

export interface Shard {
	index: number;
	estimatedSeconds: number;
	specs: string[];
}

export async function findCypressSpecs(directory: string = specDirectory): Promise<string[]> {
	const entries = await readdir(directory, { withFileTypes: true });
	const specs = await Promise.all(
		entries.map(async (entry) => {
			const path = join(directory, entry.name);

			if (entry.isDirectory()) {
				return findCypressSpecs(path);
			}

			return entry.isFile() && entry.name.endsWith('.ts') ? [path] : [];
		})
	);

	return specs
		.flat()
		.map((path) => relative(repositoryRoot, path).split(sep).join('/'))
		.sort();
}

export function estimatedDuration(spec: string, durations: Readonly<Record<string, number>> = observedSeconds): number {
	return (durations[spec] ?? 10) + 2;
}

export function partitionCypressSpecs(
	specs: readonly string[],
	shardCount: number,
	durations: Readonly<Record<string, number>> = observedSeconds
): Shard[] {
	if (!Number.isInteger(shardCount) || shardCount < 1) {
		throw new Error('shardCount must be a positive integer');
	}

	const shards = Array.from({ length: shardCount }, (_, index) => ({
		index,
		estimatedSeconds: 0,
		specs: [] as string[],
	}));

	const longestFirst = [...specs].sort(
		(a, b) => estimatedDuration(b, durations) - estimatedDuration(a, durations) || a.localeCompare(b)
	);

	for (const spec of longestFirst) {
		const target = shards.reduce((best, candidate) =>
			candidate.estimatedSeconds < best.estimatedSeconds ||
			(candidate.estimatedSeconds === best.estimatedSeconds && candidate.index < best.index)
				? candidate
				: best
		);

		target.specs.push(spec);
		target.estimatedSeconds += estimatedDuration(spec, durations);
	}

	for (const shard of shards) {
		shard.specs.sort();
	}

	return shards;
}

function integerArgument(argv: readonly string[], name: string): number | undefined {
	const index = argv.indexOf(name);
	if (index === -1) return undefined;

	const value = Number(argv[index + 1]);
	if (!Number.isInteger(value) || value < 1) {
		throw new Error(`${name} must be a positive integer`);
	}

	return value;
}

export function assertExactCoverage(
	specs: readonly string[],
	shards: readonly Shard[],
	durations?: Readonly<Record<string, number>>
): void {
	const assigned = shards.flatMap((shard) => shard.specs);
	const unique = new Set(assigned);

	if (assigned.length !== specs.length || unique.size !== specs.length || specs.some((spec) => !unique.has(spec))) {
		throw new Error('Cypress shard partition is incomplete or contains duplicates');
	}

	if (!durations) {
		return;
	}

	const staleDurations = Object.keys(durations).filter((spec) => !unique.has(spec));
	if (staleDurations.length > 0) {
		throw new Error(`Remove stale Cypress duration entries: ${staleDurations.join(', ')}`);
	}
}

export async function runCypressShardCli(argv: readonly string[] = Bun.argv): Promise<void> {
	const specs = await findCypressSpecs(specDirectory);
	const shardCount = integerArgument(argv, '--shards') ?? 3;
	const shards = partitionCypressSpecs(specs, shardCount);
	assertExactCoverage(specs, shards, observedSeconds);

	if (argv.includes('--verify')) {
		for (const shard of shards) {
			console.log(`Shard ${shard.index + 1}: ${shard.specs.length} specs, ~${shard.estimatedSeconds}s`);
			for (const spec of shard.specs) console.log(`  ${spec}`);
		}
		console.log(`Verified ${specs.length} specs are assigned exactly once.`);
		return;
	}

	const shardNumber = integerArgument(argv, '--shard');
	if (!shardNumber || shardNumber > shardCount) {
		throw new Error(`--shard must be between 1 and ${shardCount}`);
	}

	const selectedSpecs = shards[shardNumber - 1].specs;
	if (selectedSpecs.length === 0) {
		throw new Error(`Shard ${shardNumber} of ${shardCount} has no specs; reduce --shards`);
	}

	process.stdout.write(selectedSpecs.join(','));
}

if (import.meta.main) {
	await runCypressShardCli();
}
