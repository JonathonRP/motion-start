import { rm } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { assertExactCoverage, findCypressSpecs, observedSeconds, partitionCypressSpecs } from './cypress-shard.ts';

const repositoryRoot = fileURLToPath(new URL('..', import.meta.url));
const playgroundRoot = join(repositoryRoot, 'sites', 'playground');
const viteCli = join(playgroundRoot, 'node_modules', 'vite', 'bin', 'vite.js');
const defaultPort = 5000;
const defaultShardCount = 2;
const defaultHealthCheckTimeoutMs = 120_000;
const defaultHealthCheckIntervalMs = 500;
const defaultStartupFailureWindowMs = 1_000;
const maxCapturedServerOutputLength = 8_000;
const failureExitCode = 1;

type CypressConfig = {
	baseUrl: string;
	video: true;
	videoCompression: false;
	retries: 2;
	screenshotOnRunFailure: false;
	trashAssetsBeforeRuns: false;
};

export type ParallelCypressPlan = {
	baseUrl: string;
	cypressConfig: CypressConfig;
	shards: string[][];
};

type ParallelCypressRunOptions = {
	port?: number;
	shards?: number;
};

type ParallelCypressShardRequest = {
	baseUrl: string;
	cypressConfig: CypressConfig;
	shardIndex: number;
	specs: string[];
};

type ParallelCypressShardResult = {
	exitCode: number;
};

type OwnedServerStartRequest = {
	port: number;
};

type OwnedServerStartResult<TServer> = {
	server: TServer;
	baseUrl: string;
};

type ParallelCypressRunnerDependencies<TServer> = {
	getShardSpecs?: (shardCount: number) => Promise<string[][]>;
	prepareArtifacts?: () => Promise<void>;
	startServer?: (request: OwnedServerStartRequest) => Promise<OwnedServerStartResult<TServer>>;
	healthCheck?: (baseUrl: string) => Promise<void>;
	runShard?: (request: ParallelCypressShardRequest) => Promise<ParallelCypressShardResult>;
	stopServer?: (server: TServer) => Promise<void>;
	reportError?: (error: unknown) => void;
};

type OwnedServerProcess = ReturnType<typeof Bun.spawn>;
type OwnedServerOutput = {
	stdout: Promise<string>;
	stderr: Promise<string>;
};

const ownedServerOutput = new WeakMap<OwnedServerProcess, OwnedServerOutput>();

export function buildParallelCypressPlan({
	shardSpecs,
	port = defaultPort,
	baseUrl = createBaseUrl(port),
}: {
	shardSpecs: string[][];
	port?: number;
	baseUrl?: string;
}): ParallelCypressPlan {
	return {
		baseUrl,
		cypressConfig: {
			baseUrl,
			video: true,
			videoCompression: false,
			retries: 2,
			screenshotOnRunFailure: false,
			trashAssetsBeforeRuns: false,
		},
		shards: shardSpecs.map((specs) => [...specs]),
	};
}

export function createParallelCypressRunner<TServer = OwnedServerProcess>(
	dependencies: ParallelCypressRunnerDependencies<TServer> = {}
) {
	const getShardSpecs = dependencies.getShardSpecs ?? getDeterministicShardSpecs;
	const prepareArtifacts = dependencies.prepareArtifacts ?? prepareCypressArtifacts;
	const startServer =
		dependencies.startServer ?? (startOwnedServer as ParallelCypressRunnerDependencies<TServer>['startServer']);
	const healthCheck = dependencies.healthCheck ?? healthCheckServer;
	const runShard = dependencies.runShard ?? runCypressShard;
	const stopServer =
		dependencies.stopServer ?? (stopOwnedServer as ParallelCypressRunnerDependencies<TServer>['stopServer']);
	const reportError = dependencies.reportError ?? (() => undefined);

	return {
		async run(options: ParallelCypressRunOptions = {}): Promise<number> {
			const shardCount = options.shards ?? defaultShardCount;
			const port = options.port ?? defaultPort;
			let ownedServer: TServer | undefined;
			let exitCode = 0;

			try {
				const shardSpecs = await getShardSpecs(shardCount);
				await prepareArtifacts();
				const { server, baseUrl } = await startServer({ port });
				ownedServer = server;

				await healthCheck(baseUrl);
				const plan = buildParallelCypressPlan({
					shardSpecs,
					port,
					baseUrl,
				});

				const results = await Promise.allSettled(
					plan.shards.map((specs, shardIndex) =>
						runShard({
							baseUrl: plan.baseUrl,
							cypressConfig: plan.cypressConfig,
							shardIndex,
							specs,
						})
					)
				);

				for (const [shardIndex, result] of results.entries()) {
					if (result.status === 'rejected') {
						reportError(new Error(`Cypress shard ${shardIndex + 1} failed: ${formatRunnerError(result.reason)}`));
						exitCode = failureExitCode;
						continue;
					}

					if (result.value.exitCode !== 0) {
						reportError(new Error(`Cypress shard ${shardIndex + 1} exited with code ${result.value.exitCode}`));
						exitCode = failureExitCode;
					}
				}
			} catch (error) {
				reportError(error);
				exitCode = failureExitCode;
			} finally {
				if (ownedServer) {
					try {
						await stopServer(ownedServer);
					} catch (error) {
						reportError(new Error(`Failed to stop playground server: ${formatRunnerError(error)}`));
						exitCode = failureExitCode;
					}
				}
			}

			return exitCode;
		},
	};
}

export async function getDeterministicShardSpecs(shardCount: number): Promise<string[][]> {
	const specs = await findCypressSpecs();
	const shards = partitionCypressSpecs(specs, shardCount);
	assertExactCoverage(specs, shards, observedSeconds);

	const emptyShard = shards.find((shard) => shard.specs.length === 0);
	if (emptyShard) {
		throw new Error(`Shard ${emptyShard.index + 1} of ${shardCount} has no specs; reduce --shards`);
	}

	return shards.map((shard) => [...shard.specs]);
}

async function prepareCypressArtifacts(): Promise<void> {
	await Promise.all(
		['downloads', 'screenshots', 'videos'].map((directory) =>
			rm(join(repositoryRoot, 'cypress', directory), { force: true, recursive: true })
		)
	);
}

function createBaseUrl(port: number): string {
	return `http://127.0.0.1:${port}`;
}

export function parseParallelCypressOptions(argv: readonly string[]): ParallelCypressRunOptions {
	const args = argv.slice(2).filter((argument) => argument !== '--');
	const options: ParallelCypressRunOptions = {};

	for (let index = 0; index < args.length; index++) {
		const argument = args[index];
		if (argument !== '--port' && argument !== '--shards') {
			throw new Error(
				`Unsupported parallel Cypress argument "${argument}". Use "bun run cypress:run:serial -- ..." for standard Cypress options.`
			);
		}

		const value = Number(args[index + 1]);
		if (!Number.isInteger(value) || value < 1) {
			throw new Error(`${argument} must be a positive integer`);
		}

		if (argument === '--port') {
			options.port = value;
		} else {
			options.shards = value;
		}
		index++;
	}

	return options;
}

export async function startOwnedServer({
	port,
}: OwnedServerStartRequest): Promise<OwnedServerStartResult<OwnedServerProcess>> {
	const nodeExecutable = Bun.which('node');
	if (!nodeExecutable) {
		throw new Error('Node.js is required to start the Cypress playground server');
	}

	const server = Bun.spawn(
		[nodeExecutable, viteCli, 'dev', '--host', '127.0.0.1', '--port', String(port), '--strictPort'],
		{
			cwd: playgroundRoot,
			stdout: 'pipe',
			stderr: 'pipe',
		}
	);
	ownedServerOutput.set(server, {
		stdout: readStreamText(server.stdout),
		stderr: readStreamText(server.stderr),
	});

	const exitCode = await Promise.race([server.exited, Bun.sleep(defaultStartupFailureWindowMs).then(() => undefined)]);

	if (typeof exitCode === 'number') {
		const output = await readCombinedOutput(server);
		throw new Error(`Failed to start playground server: ${output || `exited with code ${exitCode}`}`);
	}

	return {
		server,
		baseUrl: createBaseUrl(port),
	};
}

export async function healthCheckServer(baseUrl: string): Promise<void> {
	const deadline = Date.now() + defaultHealthCheckTimeoutMs;
	let lastError: Error | undefined;
	let lastStatus: number | undefined;

	while (Date.now() < deadline) {
		try {
			const response = await fetch(baseUrl);
			if (response.ok) return;
			lastStatus = response.status;
		} catch (error) {
			lastError = error instanceof Error ? error : new Error(String(error));
		}

		await Bun.sleep(defaultHealthCheckIntervalMs);
	}

	const detail = lastStatus ? `last status ${lastStatus}` : lastError ? lastError.message : 'no response received';
	throw new Error(`Timed out waiting for playground server at ${baseUrl}: ${detail}`);
}

async function runCypressShard({
	baseUrl,
	cypressConfig,
	specs,
}: ParallelCypressShardRequest): Promise<ParallelCypressShardResult> {
	const processHandle = Bun.spawn(
		[
			process.execPath,
			'x',
			'cypress',
			'run',
			'--spec',
			specs.join(','),
			'--config',
			serializeCypressConfig({
				...cypressConfig,
				baseUrl,
			}),
		],
		{
			cwd: repositoryRoot,
			stdout: 'inherit',
			stderr: 'inherit',
		}
	);

	return {
		exitCode: await processHandle.exited,
	};
}

export async function stopOwnedServer(server: OwnedServerProcess): Promise<void> {
	server.kill();
	await server.exited;
}

function serializeCypressConfig(config: CypressConfig): string {
	return [
		`baseUrl=${config.baseUrl}`,
		`video=${String(config.video)}`,
		`videoCompression=${String(config.videoCompression)}`,
		`retries=${String(config.retries)}`,
		`screenshotOnRunFailure=${String(config.screenshotOnRunFailure)}`,
		`trashAssetsBeforeRuns=${String(config.trashAssetsBeforeRuns)}`,
	].join(',');
}

async function readCombinedOutput(server: OwnedServerProcess): Promise<string> {
	const trackedOutput = ownedServerOutput.get(server);
	const [stdout, stderr] = trackedOutput
		? await Promise.all([trackedOutput.stdout, trackedOutput.stderr])
		: await Promise.all([readStreamText(server.stdout), readStreamText(server.stderr)]);

	return [stdout, stderr]
		.filter((output) => output.length > 0)
		.join('\n')
		.trim();
}

async function readStreamText(stream: ReadableStream<Uint8Array> | null): Promise<string> {
	if (!stream) return '';
	const reader = stream.getReader();
	const decoder = new TextDecoder();
	let text = '';
	let truncated = false;

	try {
		while (true) {
			const { done, value } = await reader.read();
			if (done) break;
			if (!value) continue;

			const nextChunk = decoder.decode(value, { stream: true });
			const nextText = text + nextChunk;
			truncated ||= nextText.length > maxCapturedServerOutputLength;
			text = nextText.slice(-maxCapturedServerOutputLength);
		}

		const finalChunk = decoder.decode();
		if (finalChunk.length > 0) {
			const nextText = text + finalChunk;
			truncated ||= nextText.length > maxCapturedServerOutputLength;
			text = nextText.slice(-maxCapturedServerOutputLength);
		}
	} finally {
		reader.releaseLock();
	}

	return truncated ? `[output truncated]\n${text}` : text;
}

function formatRunnerError(error: unknown): string {
	if (error instanceof Error) {
		return error.message;
	}

	return String(error);
}

export async function runParallelCypressCli(argv: readonly string[] = Bun.argv): Promise<number> {
	try {
		const options = parseParallelCypressOptions(argv);
		const runner = createParallelCypressRunner({
			reportError: (error) => {
				console.error(formatRunnerError(error));
			},
		});

		return runner.run(options);
	} catch (error) {
		console.error(formatRunnerError(error));
		return failureExitCode;
	}
}

if (import.meta.main) {
	process.exit(await runParallelCypressCli());
}
