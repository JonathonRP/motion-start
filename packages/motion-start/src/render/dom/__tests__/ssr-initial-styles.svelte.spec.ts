// @vitest-environment node

import { createContext, runInContext } from 'node:vm';
import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import SsrAppearFixture from './SsrAppearFixture.svelte';
import SsrBlockedAppearFixture from './SsrBlockedAppearFixture.svelte';
import SsrInheritedInitialStylesFixture from './SsrInheritedInitialStylesFixture.svelte';
import SsrInitialStylesFixture from './SsrInitialStylesFixture.svelte';

function parseStyleAttribute(style: string) {
	return Object.fromEntries(
		style
			.split(';')
			.map((declaration) => declaration.trim())
			.filter(Boolean)
			.map((declaration) => {
				const separator = declaration.indexOf(':');
				return [declaration.slice(0, separator).trim(), declaration.slice(separator + 1).trim()];
			})
	);
}

function getOpeningTag(body: string, testId: string) {
	return body.match(new RegExp(`<[a-zA-Z][^>]*data-testid="${testId}"[^>]*>`))?.[0] ?? '';
}

function getAppearId(tag: string) {
	return tag.match(/\sdata-framer-appear-id="([^"]+)"/)?.[1];
}

/**
 * Scripts between this fixture and the next one. The bootstrap is always emitted
 * after its element, so slicing on the fixture markers works for any tag.
 */
function getAdjacentScripts(body: string, testId: string) {
	const marker = body.indexOf(`data-testid="${testId}"`);
	const nextFixture = body.indexOf('data-testid="ssr-appear-', marker + testId.length);
	const segment = body.slice(marker, nextFixture === -1 ? undefined : nextFixture);

	return [...segment.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)].map((match) => ({
		attributes: match[1] ?? '',
		source: match[2] ?? '',
	}));
}

type AnimateCall = {
	elementId: string;
	keyframes: PropertyIndexedKeyframes;
	options?: number | KeyframeAnimationOptions;
	cancelled: boolean;
	played: boolean;
};

/**
 * Replays a server-rendered document the way a browser parser would: elements
 * and their inline scripts are visited in document order, every script shares
 * one realm, and the 10s paint-ready placeholder resolves its `ready` promise so
 * the real Chrome code path is exercised rather than the no-`ready` fallback.
 */
async function executeParserTimeScripts(body: string, globals: Record<string, unknown> = {}) {
	const animateCalls: AnimateCall[] = [];
	let previousElementSibling: FakeElement | FakeScript | null = null;

	class FakeElement {
		dataset: Record<string, string>;
		private animationCount = 0;

		constructor(public id: string) {
			this.dataset = { framerAppearId: id };
		}

		animate(keyframes: PropertyIndexedKeyframes, options?: number | KeyframeAnimationOptions) {
			const call: AnimateCall = { elementId: this.id, keyframes, options, cancelled: false, played: false };
			animateCalls.push(call);
			const isPlaceholder = this.animationCount++ === 0;

			return {
				cancel() {
					call.cancelled = true;
				},
				play() {
					call.played = true;
				},
				ready: isPlaceholder ? Promise.resolve() : undefined,
				startTime: null,
			};
		}
	}

	class FakeScript {
		dataset: Record<string, string> = {};
		previousElementSibling = previousElementSibling;

		constructor(
			public textContent: string,
			attributes: string
		) {
			for (const match of attributes.matchAll(/\sdata-([\w-]+)="([^"]*)"/g)) {
				const key = (match[1] ?? '').replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase());
				this.dataset[key] = match[2] ?? '';
			}
		}
	}

	const document = { currentScript: null as FakeScript | null };
	const sandbox: Record<string, unknown> = {
		Element: FakeElement,
		HTMLElement: FakeElement,
		console,
		document,
		performance: { now: () => 100 },
		queueMicrotask,
		setTimeout,
		...globals,
	};
	sandbox.window = sandbox;
	sandbox.globalThis = sandbox;
	const context = createContext(sandbox);

	const parserTokens = /<[a-zA-Z][^>]*data-framer-appear-id="([^"]+)"[^>]*>|<script\b([^>]*)>([\s\S]*?)<\/script>/g;

	for (const match of body.matchAll(parserTokens)) {
		if (match[1]) {
			previousElementSibling = new FakeElement(match[1]);
			continue;
		}

		const attributes = match[2] ?? '';
		const source = match[3] ?? '';
		const script = new FakeScript(source, attributes);
		document.currentScript = script;
		previousElementSibling = script;

		const type = attributes.match(/\stype="([^"]+)"/)?.[1];
		if (!type || type === 'text/javascript' || type === 'module') {
			runInContext(source, context);
		}
	}

	document.currentScript = null;
	// Flush the paint-ready promise chains.
	await new Promise((resolve) => setTimeout(resolve, 0));

	return { animateCalls, sandbox };
}

function findAnimateCall(calls: AnimateCall[], elementId: string | undefined, property: string, duration: number) {
	return calls.find(
		(call) =>
			call.elementId === elementId &&
			call.keyframes[property] !== undefined &&
			(call.options as KeyframeAnimationOptions)?.duration === duration
	);
}

describe('motion element SSR styles', () => {
	it('serializes raw styles, CSS variables, and resolved initial animation values', () => {
		const { body } = render(SsrInitialStylesFixture);
		const motionElement = body.match(/<div[^>]*data-testid="ssr-motion"[^>]*>/)?.[0];
		const style = motionElement?.match(/\sstyle="([^"]*)"/)?.[1];

		expect(style).toBeDefined();
		const declarations = parseStyleAttribute(style ?? '');
		expect(declarations).toMatchObject({
			'background-color': 'tomato',
			'background-image': '\\00005c',
			'--accentColor': 'rebeccapurple',
			'-webkit-filter': 'blur(1px)',
			color: 'red\\00003b position: fixed',
			opacity: '0.25',
			transform: 'translateX(24px)',
		});
		expect(declarations).not.toHaveProperty('position');
	});

	it('serializes inherited initial variant styles before a parent enters view', () => {
		const { body } = render(SsrInheritedInitialStylesFixture);
		const parentTag = getOpeningTag(body, 'ssr-inherited-parent');
		const childTag = getOpeningTag(body, 'ssr-inherited-child');

		// The parent controls whileInView, but both elements must remain on their
		// hidden initial variants until an intersection activates the visible variant.
		expect({
			parent: parseStyleAttribute(parentTag.match(/\sstyle="([^"]*)"/)?.[1] ?? ''),
			child: parseStyleAttribute(childTag.match(/\sstyle="([^"]*)"/)?.[1] ?? ''),
		}).toMatchObject({
			parent: { opacity: '0' },
			child: { opacity: '0', transform: 'translateY(16px)' },
		});
	});
});

describe('opt-in appear animations during SSR', () => {
	it('renders the initial frame and an internal hydration-stable appear id without leaking the appear prop', () => {
		const firstBody = render(SsrAppearFixture).body;
		const secondBody = render(SsrAppearFixture).body;
		const firstTag = getOpeningTag(firstBody, 'ssr-appear-tween');
		const secondTag = getOpeningTag(secondBody, 'ssr-appear-tween');
		const declarations = parseStyleAttribute(firstTag.match(/\sstyle="([^"]*)"/)?.[1] ?? '');

		expect(declarations).toMatchObject({
			opacity: '0',
			transform: 'translateX(20px)',
		});
		expect(firstTag).not.toMatch(/\sappear(?:=|\s|>)/);
		expect(getAppearId(firstTag)).toBeTruthy();
		expect(getAppearId(secondTag)).toBe(getAppearId(firstTag));
		expect(getAppearId(getOpeningTag(firstBody, 'ssr-appear-keyframes'))).not.toBe(getAppearId(firstTag));
		// Hydration re-runs the same code in the browser, so the markup - including
		// the generated ids and the encoded payload - has to be reproducible.
		expect(secondBody).toBe(firstBody);
	});

	it('emits adjacent parser-time scripts only for opted-in, explicitly WAAPI-safe HTML transitions', () => {
		const { body } = render(SsrAppearFixture);

		expect(getAdjacentScripts(body, 'ssr-appear-tween')).not.toHaveLength(0);
		expect(getAdjacentScripts(body, 'ssr-appear-tween')[0]?.attributes).toContain('nonce="appear-nonce"');
		expect(getAdjacentScripts(body, 'ssr-appear-keyframes')).not.toHaveLength(0);
		expect(getAdjacentScripts(body, 'ssr-appear-implicit-ease')).not.toHaveLength(0);
		expect(getAdjacentScripts(body, 'ssr-appear-negative-delay')).toHaveLength(0);
		expect(getAdjacentScripts(body, 'ssr-appear-reserved-keyframe-property')).toHaveLength(0);
		expect(getAdjacentScripts(body, 'ssr-appear-css-variable')).toHaveLength(0);
		expect(getAdjacentScripts(body, 'ssr-appear-opted-out')).toHaveLength(0);
		expect(getAdjacentScripts(body, 'ssr-appear-spring')).toHaveLength(0);
		expect(getAdjacentScripts(body, 'ssr-appear-unsafe')).toHaveLength(0);
		// SVG values are attributes rather than styles, so they can't be resolved
		// into CSS keyframes on the server.
		expect(getAdjacentScripts(body, 'ssr-appear-svg')).toHaveLength(0);
	});

	it('starts consolidated transform and opacity WAAPI animations before hydration and exposes them for handoff', async () => {
		const { body } = render(SsrAppearFixture);
		const tweenId = getAppearId(getOpeningTag(body, 'ssr-appear-tween'));
		const { animateCalls, sandbox } = await executeParserTimeScripts(body);
		const placeholder = findAnimateCall(animateCalls, tweenId, 'transform', 10000);
		const transform = findAnimateCall(animateCalls, tweenId, 'transform', 400);
		const opacity = findAnimateCall(animateCalls, tweenId, 'opacity', 400);

		// The paint-ready placeholder is cancelled once the real animations start.
		expect(placeholder?.cancelled).toBe(true);
		expect(transform?.keyframes.transform).toEqual(['translateX(20px)', 'translateX(0px)']);
		expect(opacity?.keyframes.opacity).toEqual([0, 1]);
		expect(transform?.options).toMatchObject({ duration: 400, easing: 'ease-out', fill: 'both' });
		expect(opacity?.options).toMatchObject({ duration: 400, easing: 'ease-out', fill: 'both' });
		expect(typeof sandbox.MotionHandoffAnimation).toBe('function');
		expect(
			(sandbox.MotionHasOptimisedAnimation as ((id: string, value: string) => boolean) | undefined)?.(
				tweenId ?? '',
				'opacity'
			)
		).toBe(true);
	});

	it('starts every element on the page from one shared, paint-ready start time', async () => {
		const { body } = render(SsrAppearFixture);
		const tweenId = getAppearId(getOpeningTag(body, 'ssr-appear-tween'));
		const keyframesId = getAppearId(getOpeningTag(body, 'ssr-appear-keyframes'));
		const { animateCalls, sandbox } = await executeParserTimeScripts(body);

		// The second element chains onto the first element's ready promise rather
		// than starting immediately or being dropped.
		expect(findAnimateCall(animateCalls, tweenId, 'opacity', 400)).toBeDefined();
		expect(findAnimateCall(animateCalls, keyframesId, 'opacity', 600)).toBeDefined();
		expect(sandbox.__MotionAppearStartTime).toBe(100);
	});

	it('resolves an omitted ease to the curve Motion would use for that value', async () => {
		const { body } = render(SsrAppearFixture);
		const implicitId = getAppearId(getOpeningTag(body, 'ssr-appear-implicit-ease'));
		const { animateCalls } = await executeParserTimeScripts(body);

		// Motion seeds every value transition with easeOut before merging the
		// user transition, including animations resumed through handoff.
		expect(findAnimateCall(animateCalls, implicitId, 'transform', 400)?.options).toMatchObject({
			easing: 'ease-out',
		});
		expect(findAnimateCall(animateCalls, implicitId, 'opacity', 400)?.options).toMatchObject({ easing: 'ease-out' });
	});

	it('leaves the page alone when Motion has already hydrated', async () => {
		const { body } = render(SsrAppearFixture);
		const { animateCalls } = await executeParserTimeScripts(body, { MotionIsMounted: true });

		expect(animateCalls).toHaveLength(0);
	});

	it('preserves explicit keyframe offsets and easing while converting seconds to milliseconds', async () => {
		const { body } = render(SsrAppearFixture);
		const keyframesId = getAppearId(getOpeningTag(body, 'ssr-appear-keyframes'));
		const { animateCalls } = await executeParserTimeScripts(body);
		const opacity = findAnimateCall(animateCalls, keyframesId, 'opacity', 600);

		expect(opacity?.keyframes).toMatchObject({
			opacity: [0, 0.5, 1],
			offset: [0, 0.25, 1],
			easing: ['linear', 'ease-out'],
		});
		expect(opacity?.options).toMatchObject({ duration: 600, easing: 'linear' });
	});

	it('keeps unsupported config inert instead of allowing inline script injection', async () => {
		const { body } = render(SsrAppearFixture);
		const { sandbox } = await executeParserTimeScripts(body);

		expect(body).not.toContain('<script>globalThis.__appearInjected');
		expect(sandbox.__appearInjected).toBeUndefined();
	});

	it('does not animate when an AnimatePresence boundary blocks initial animations', () => {
		const { body } = render(SsrBlockedAppearFixture);
		const tag = getOpeningTag(body, 'ssr-blocked-appear');
		const declarations = parseStyleAttribute(tag.match(/\sstyle="([^"]*)"/)?.[1] ?? '');

		expect(declarations.opacity).toBe('1');
		expect(body).not.toContain('data-motion-appear');
	});
});
