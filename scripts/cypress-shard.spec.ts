import { describe, expect, test } from 'vitest';
import { assertExactCoverage, partitionCypressSpecs, type Shard } from './cypress-shard.ts';

const specs = [
	'cypress/integration/alpha.ts',
	'cypress/integration/bravo.ts',
	'cypress/integration/charlie.ts',
	'cypress/integration/delta.ts',
	'cypress/integration/echo.ts',
	'cypress/integration/foxtrot.ts',
];

const durations = {
	'cypress/integration/alpha.ts': 60,
	'cypress/integration/bravo.ts': 18,
	'cypress/integration/charlie.ts': 18,
	'cypress/integration/delta.ts': 5,
	'cypress/integration/echo.ts': 4,
	'cypress/integration/foxtrot.ts': 3,
};

describe('cypress shard helpers', () => {
	// Verifies every spec is partitioned exactly once across the requested shards.
	test('assigns every spec exactly once', () => {
		const shards = partitionCypressSpecs(specs, 3, durations);
		const assigned = shards.flatMap((shard) => shard.specs);

		expect(new Set(assigned).size).toBe(specs.length);
		expect(assigned.slice().sort()).toEqual(specs.slice().sort());
		expect(() => assertExactCoverage(specs, shards)).not.toThrow();
	});

	// Verifies deterministic input always produces the same shard layout.
	test('keeps the same shard layout for the same input', () => {
		const first = partitionCypressSpecs(specs, 3, durations);
		const second = partitionCypressSpecs(specs, 3, durations);

		expect(second).toEqual(first);
		expect(
			first.some((shard) => shard.specs.length === 1 && shard.specs.includes('cypress/integration/alpha.ts'))
		).toBe(true);
	});

	// Verifies the coverage check rejects duplicate or missing specs.
	test('rejects incomplete or duplicate assignments', () => {
		const invalidShards: Shard[] = [
			{ index: 0, estimatedSeconds: 1, specs: ['cypress/integration/alpha.ts', 'cypress/integration/alpha.ts'] },
			{ index: 1, estimatedSeconds: 1, specs: ['cypress/integration/bravo.ts'] },
			{ index: 2, estimatedSeconds: 1, specs: ['cypress/integration/charlie.ts'] },
		];

		expect(() => assertExactCoverage(specs, invalidShards)).toThrow(
			'Cypress shard partition is incomplete or contains duplicates'
		);
	});
});
