import { createServer } from 'node:net';
import { describe, expect, test, vi } from 'vitest';
import {
	buildParallelCypressPlan,
	createParallelCypressRunner,
	healthCheckServer,
	parseParallelCypressOptions,
	startOwnedServer,
	stopOwnedServer,
} from './cypress-parallel.ts';

function deferred<T>() {
	let resolve!: (value: T) => void;
	let reject!: (reason?: unknown) => void;

	const promise = new Promise<T>((promiseResolve, promiseReject) => {
		resolve = promiseResolve;
		reject = promiseReject;
	});

	return { promise, resolve, reject };
}

function shardSpecs() {
	return [['cypress/integration/alpha.ts'], ['cypress/integration/bravo.ts'], ['cypress/integration/charlie.ts']];
}

function findAvailablePort(): Promise<number> {
	return new Promise((resolve, reject) => {
		const server = createServer();
		server.unref();
		server.once('error', reject);
		server.listen(0, '127.0.0.1', () => {
			const address = server.address();
			if (!address || typeof address === 'string') {
				server.close();
				reject(new Error('Failed to reserve a local test port'));
				return;
			}

			server.close((error) => {
				if (error) reject(error);
				else resolve(address.port);
			});
		});
	});
}

describe('cypress parallel runner', () => {
	// Verifies the default plan keeps the local Cypress config and default port.
	test('builds the default local Cypress plan', () => {
		const plan = buildParallelCypressPlan({
			shardSpecs: shardSpecs(),
		});

		expect(plan.baseUrl).toBe('http://127.0.0.1:5000');
		expect(plan.cypressConfig).toEqual({
			baseUrl: 'http://127.0.0.1:5000',
			video: true,
			videoCompression: false,
			retries: 2,
			screenshotOnRunFailure: false,
			trashAssetsBeforeRuns: false,
		});

		expect(plan.shards).toEqual(shardSpecs());
	});

	test('rejects Cypress CLI options that the parallel runner cannot preserve', () => {
		expect(() =>
			parseParallelCypressOptions(['bun', 'scripts/cypress-parallel.ts', '--spec', 'cypress/integration/drag.ts'])
		).toThrow('Unsupported parallel Cypress argument "--spec"');
		expect(
			parseParallelCypressOptions(['bun', 'scripts/cypress-parallel.ts', '--', '--port', '6123', '--shards', '2'])
		).toEqual({ port: 6123, shards: 2 });
	});

	// Verifies the runner order: owned server -> health check -> concurrent shards -> cleanup.
	test('starts the server, health-checks it, runs all shards concurrently, and stops the owned server', async () => {
		const events: string[] = [];
		const server = { pid: 1234 };
		const plannedShardSpecs = deferred<string[][]>();
		const started = deferred<{ server: typeof server; baseUrl: string }>();
		const healthy = deferred<void>();
		const shardRuns = [
			deferred<{ exitCode: number }>(),
			deferred<{ exitCode: number }>(),
			deferred<{ exitCode: number }>(),
		];
		const expectedConfig = {
			baseUrl: 'http://localhost:6123',
			video: true,
			videoCompression: false,
			retries: 2,
			screenshotOnRunFailure: false,
			trashAssetsBeforeRuns: false,
		};
		const prepareArtifacts = vi.fn(async () => {
			events.push('artifacts');
		});
		const startServer = vi.fn(({ port }: { port: number }) => {
			events.push(`start:${port}`);
			return started.promise;
		});
		const healthCheck = vi.fn((baseUrl: string) => {
			events.push(`health:${baseUrl}`);
			return healthy.promise;
		});
		const runShard = vi.fn(
			(request: { baseUrl: string; cypressConfig: typeof expectedConfig; shardIndex: number; specs: string[] }) => {
				events.push(`shard:${request.shardIndex}`);
				return shardRuns[request.shardIndex].promise;
			}
		);
		const stopServer = vi.fn(async (ownedServer: typeof server) => {
			events.push('stop');
			expect(ownedServer).toBe(server);
		});
		const getShardSpecs = vi.fn(async (shardCount: number) => {
			events.push(`plan:${shardCount}`);
			return plannedShardSpecs.promise;
		});

		const runner = createParallelCypressRunner({
			prepareArtifacts,
			startServer,
			healthCheck,
			runShard,
			stopServer,
			getShardSpecs,
		});

		const runPromise = runner.run({ port: 6123 });

		expect(getShardSpecs).toHaveBeenCalledWith(2);
		expect(startServer).not.toHaveBeenCalled();
		expect(healthCheck).not.toHaveBeenCalled();
		expect(runShard).not.toHaveBeenCalled();
		expect(stopServer).not.toHaveBeenCalled();

		plannedShardSpecs.resolve(shardSpecs());
		await Bun.sleep(0);
		expect(prepareArtifacts).toHaveBeenCalledTimes(1);
		expect(startServer).toHaveBeenCalledWith({ port: 6123 });
		expect(healthCheck).not.toHaveBeenCalled();
		expect(runShard).not.toHaveBeenCalled();
		expect(stopServer).not.toHaveBeenCalled();

		started.resolve({ server, baseUrl: 'http://localhost:6123' });
		await Bun.sleep(0);
		expect(healthCheck).toHaveBeenCalledWith('http://localhost:6123');
		expect(runShard).not.toHaveBeenCalled();
		expect(events).toEqual(['plan:2', 'artifacts', 'start:6123', 'health:http://localhost:6123']);

		healthy.resolve();
		await Bun.sleep(0);
		expect(runShard).toHaveBeenCalledTimes(3);
		expect(runShard.mock.calls.map(([request]) => request.shardIndex)).toEqual([0, 1, 2]);
		expect(runShard.mock.calls.map(([request]) => request.baseUrl)).toEqual([
			'http://localhost:6123',
			'http://localhost:6123',
			'http://localhost:6123',
		]);
		expect(runShard.mock.calls.map(([request]) => request.cypressConfig)).toEqual([
			expectedConfig,
			expectedConfig,
			expectedConfig,
		]);
		expect(stopServer).not.toHaveBeenCalled();

		shardRuns[0].resolve({ exitCode: 0 });
		shardRuns[1].resolve({ exitCode: 0 });
		shardRuns[2].resolve({ exitCode: 0 });

		await expect(runPromise).resolves.toBe(0);
		expect(getShardSpecs).toHaveBeenCalledWith(2);
		expect(stopServer).toHaveBeenCalledTimes(1);
		expect(events).toEqual([
			'plan:2',
			'artifacts',
			'start:6123',
			'health:http://localhost:6123',
			'shard:0',
			'shard:1',
			'shard:2',
			'stop',
		]);
	});

	// Verifies shard failures still clean up the owned server and return a non-zero exit code.
	test('stops the owned server and reports failure when any shard fails', async () => {
		const server = { pid: 2345 };
		const shardRuns = [
			deferred<{ exitCode: number }>(),
			deferred<{ exitCode: number }>(),
			deferred<{ exitCode: number }>(),
		];
		const startServer = vi.fn().mockResolvedValue({ server, baseUrl: 'http://localhost:5000' });
		const healthCheck = vi.fn().mockResolvedValue(undefined);
		const runShard = vi.fn((request: { shardIndex: number }) => shardRuns[request.shardIndex].promise);
		const stopServer = vi.fn().mockResolvedValue(undefined);
		const getShardSpecs = vi.fn().mockResolvedValue(shardSpecs());
		const reportError = vi.fn();
		const prepareArtifacts = vi.fn().mockResolvedValue(undefined);

		const runner = createParallelCypressRunner({
			prepareArtifacts,
			startServer,
			healthCheck,
			runShard,
			stopServer,
			getShardSpecs,
			reportError,
		});

		const runPromise = runner.run();

		shardRuns[0].resolve({ exitCode: 0 });
		shardRuns[1].resolve({ exitCode: 1 });
		shardRuns[2].resolve({ exitCode: 2 });

		await expect(runPromise).resolves.toBeGreaterThan(0);
		expect(stopServer).toHaveBeenCalledTimes(1);
		expect(stopServer).toHaveBeenCalledWith(server);
		expect(reportError.mock.calls.map(([error]) => error instanceof Error && error.message)).toEqual([
			'Cypress shard 2 exited with code 1',
			'Cypress shard 3 exited with code 2',
		]);
	});

	// Verifies startup failures short-circuit without launching shards or trying cleanup.
	test('returns a non-zero exit code when startup fails before ownership is established', async () => {
		const startServer = vi.fn().mockRejectedValue(new Error('vite failed to start'));
		const healthCheck = vi.fn();
		const runShard = vi.fn();
		const stopServer = vi.fn();
		const getShardSpecs = vi.fn().mockResolvedValue(shardSpecs());
		const reportError = vi.fn();
		const prepareArtifacts = vi.fn().mockResolvedValue(undefined);

		const runner = createParallelCypressRunner({
			prepareArtifacts,
			startServer,
			healthCheck,
			runShard,
			stopServer,
			getShardSpecs,
			reportError,
		});

		await expect(runner.run()).resolves.toBeGreaterThan(0);
		expect(getShardSpecs).toHaveBeenCalledWith(2);
		expect(healthCheck).not.toHaveBeenCalled();
		expect(runShard).not.toHaveBeenCalled();
		expect(stopServer).not.toHaveBeenCalled();
		expect(reportError).toHaveBeenCalledTimes(1);
	});

	// Verifies health-check failures stop the owned server and do not start shards.
	test('stops the owned server when the health check fails', async () => {
		const server = { pid: 3456 };
		const startServer = vi.fn().mockResolvedValue({ server, baseUrl: 'http://localhost:5000' });
		const healthCheck = vi.fn().mockRejectedValue(new Error('playground is not reachable'));
		const runShard = vi.fn();
		const stopServer = vi.fn().mockResolvedValue(undefined);
		const getShardSpecs = vi.fn().mockResolvedValue(shardSpecs());
		const reportError = vi.fn();
		const prepareArtifacts = vi.fn().mockResolvedValue(undefined);

		const runner = createParallelCypressRunner({
			prepareArtifacts,
			startServer,
			healthCheck,
			runShard,
			stopServer,
			getShardSpecs,
			reportError,
		});

		await expect(runner.run()).resolves.toBeGreaterThan(0);
		expect(runShard).not.toHaveBeenCalled();
		expect(stopServer).toHaveBeenCalledTimes(1);
		expect(stopServer).toHaveBeenCalledWith(server);
		expect(reportError).toHaveBeenCalledTimes(1);
	});

	// Verifies shard discovery errors do not claim the local port or start the server.
	test('does not start the server when shard discovery fails', async () => {
		const startServer = vi.fn();
		const reportError = vi.fn();
		const prepareArtifacts = vi.fn();
		const runner = createParallelCypressRunner({
			prepareArtifacts,
			getShardSpecs: vi.fn().mockRejectedValue(new Error('spec discovery failed')),
			startServer,
			reportError,
		});

		await expect(runner.run()).resolves.toBeGreaterThan(0);
		expect(startServer).not.toHaveBeenCalled();
		expect(prepareArtifacts).not.toHaveBeenCalled();
		expect(reportError).toHaveBeenCalledTimes(1);
	});

	test('stops the real playground server and releases its port', async () => {
		const port = await findAvailablePort();
		const { server, baseUrl } = await startOwnedServer({ port });
		const healthUrl = `${baseUrl}/@vite/client`;

		await healthCheckServer(healthUrl);
		await stopOwnedServer(server);

		await expect(fetch(healthUrl)).rejects.toThrow();
	}, 60_000);
});
