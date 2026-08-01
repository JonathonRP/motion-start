/**
 * Parser-time bootstrap for the opt-in `appear` prop.
 *
 * The `<script>` body emitted next to a server-rendered motion element is a
 * serialisation of `motionAppearBootstrap` below. Keeping the executable source
 * fixed means per-element data is never interpolated into JavaScript: it is
 * percent-encoded into `data-motion-appear` and read back with `JSON.parse`.
 *
 * `motionAppearBootstrap` must therefore stay completely self-contained:
 *
 * - no imports, module-scope references, `this` or generated helpers
 * - only syntax that transpiles without helper functions, so no `for...of`,
 *   iterable spread, destructuring of iterables, `async`/`await` or classes
 * - only `//` comments (the serialiser strips whole-line comments)
 *
 * `appear-bootstrap.spec.ts` pins these invariants.
 */

import type { AppearStoreEntry } from '../../animation/optimized-appear/store.js';

/**
 * A single WAAPI animation, resolved on the server.
 *
 * `name` is the CSS property to animate. Individual transform values are
 * consolidated into one `transform` animation, mirroring `appearStoreId()`.
 */
export interface AppearAnimationPayload {
	name: string;
	keyframes: PropertyIndexedKeyframes;
	options: KeyframeAnimationOptions;
	skipOnReducedMotion?: boolean;
}

function motionAppearBootstrap() {
	const w = window;
	const script = document.currentScript as HTMLScriptElement | null;
	const element = script?.previousElementSibling as HTMLElement | null | undefined;
	const elementId = element?.dataset.framerAppearId;

	// Bail without our own script/element pair, without WAAPI, or once Motion has
	// hydrated and taken ownership of these values.
	if (!script || !element || !elementId || typeof element.animate !== 'function' || w.MotionIsMounted) return;

	let animations: AppearAnimationPayload[];
	try {
		animations = JSON.parse(decodeURIComponent(script.dataset.motionAppear || ''));
	} catch {
		return;
	}
	if (!animations?.length) return;
	const reduceMotion = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

	// Keep in sync with `appearStoreId()`.
	const transformValue = /^(transformPerspective|x|y|z|translate[XYZ]|scale[XY]?|rotate[XYZ]?|skew[XY]?)$/;
	const storeId = (id: string, valueName: string) =>
		`${id}: ${transformValue.test(valueName) ? 'transform' : valueName}`;

	// Window-scoped so this script and `startOptimizedAppearAnimation` always
	// read and write the same entries, whichever of them runs first.
	let store: Map<string, AppearStoreEntry> | undefined = w.__MotionAppearAnimations;
	if (!store) {
		store = new Map();
		w.__MotionAppearAnimations = store;
	}
	let complete: Map<string, boolean> | undefined = w.__MotionAppearComplete;
	if (!complete) {
		complete = new Map();
		w.__MotionAppearComplete = complete;
	}

	// The first script on the page installs the bridge Motion looks for during
	// hydration. `startOptimizedAppearAnimation` installs an equivalent bridge
	// over the same maps, so it is safe for either to win.
	if (!w.MotionHandoffAnimation) {
		w.MotionHasOptimisedAnimation = (id, valueName) => {
			// Element ids are recorded as they start animating: the attribute can be
			// present without ever leading to an animation.
			if (!id) return false;
			return valueName ? store.has(storeId(id, valueName)) : complete.has(id);
		};

		w.MotionHandoffMarkAsComplete = (id) => {
			if (complete.has(id)) complete.set(id, true);
		};

		w.MotionHandoffIsComplete = (id) => complete.get(id) === true;

		w.MotionCancelOptimisedAnimation = (id, valueName, frame, canResume) => {
			const key = storeId(id, valueName);
			const entry = store.get(key);
			if (!entry) return;

			if (frame && canResume === undefined) {
				// Wait until the end of the subsequent frame so the main thread has had
				// a chance to resolve keyframes and render before we drop the animation.
				frame.postRender(() => {
					frame.postRender(() => {
						entry.animation.cancel();
					});
				});
			} else {
				entry.animation.cancel();
			}

			if (frame && canResume) {
				// Suspended for layout measurement rather than cancelled.
				frame.render(() => {
					entry.animation.play();
					entry.animation.startTime = entry.startTime;
				});
			} else {
				store.delete(key);
				// Tells the projection tree it can stop looking for conflicting
				// appear animations.
				if (!store.size) w.MotionCancelOptimisedAnimation = undefined;
			}
		};

		w.MotionHandoffAnimation = (id, valueName, frame) => {
			const entry = store.get(storeId(id, valueName));
			if (!entry) return null;

			const cancel = () => {
				const cancelOptimisedAnimation = w.MotionCancelOptimisedAnimation;
				if (cancelOptimisedAnimation) cancelOptimisedAnimation(id, valueName, frame);
			};

			// Prefer `onfinish` over `finished` for browser support.
			entry.animation.onfinish = cancel;

			// A null startTime means this is still the paint-ready placeholder, and an
			// already-complete handoff means Motion is interrupting its own animation.
			if (entry.startTime === null || complete.get(id) === true) {
				cancel();
				return null;
			}

			// A finished WAAPI animation can no longer fire the newly-installed
			// `onfinish` callback. Clean it up now, but preserve its original
			// startTime so Motion resumes the completed timeline instead of replaying.
			if (entry.animation.playState === 'finished') {
				const startTime = entry.startTime;
				cancel();
				return startTime;
			}

			return entry.startTime;
		};

		w.MotionCheckAppearSync = (visualElement, valueName, value) => {
			const id = visualElement.props['data-framer-appear-id'];
			const values = visualElement.props.values;
			const externalValue = values ? values[valueName] : undefined;
			if (!id || !externalValue || !store.has(storeId(id, valueName))) return;

			const removeSyncCheck = value.on('change', (latestValue) => {
				if (externalValue.get() !== latestValue) {
					const cancelOptimisedAnimation = w.MotionCancelOptimisedAnimation;
					if (cancelOptimisedAnimation) cancelOptimisedAnimation(id, valueName);
					removeSyncCheck();
				}
			});

			return removeSyncCheck;
		};
	}

	complete.set(elementId, false);

	// A dummy animation detects when Chrome is ready to start painting; starting
	// the real animation any earlier drops its opening frames.
	// https://bugs.chromium.org/p/chromium/issues/detail?id=1406850
	const activeAnimations = animations.filter((animation) => !(reduceMotion && animation.skipOnReducedMotion));
	if (!activeAnimations.length) {
		complete.delete(elementId);
		return;
	}
	const first = activeAnimations[0];
	const firstFrames = first.keyframes[first.name] as string[];
	const placeholderKeyframes: PropertyIndexedKeyframes = {};
	placeholderKeyframes[first.name] = [firstFrames[0], firstFrames[0]];
	const readyAnimation = element.animate(placeholderKeyframes, { duration: 10000, easing: 'linear' });

	// Register every value up front so a handoff that lands before the browser is
	// paint-ready still finds this element and cancels the placeholder.
	for (let i = 0; i < activeAnimations.length; i++) {
		store.set(storeId(elementId, activeAnimations[i].name), { animation: readyAnimation, startTime: null });
	}

	const start = () => {
		readyAnimation.cancel();

		// Motion hydrated while we waited to paint, so it now owns these values and
		// a parser-time animation would fight the main thread.
		if (w.MotionIsMounted) return;

		// A single start time shared with every other appear script and with
		// `startOptimizedAppearAnimation` keeps the page's animations in sync.
		let startTime = w.__MotionAppearStartTime;
		if (startTime === undefined) {
			startTime = performance.now();
			w.__MotionAppearStartTime = startTime;
		}

		for (let i = 0; i < activeAnimations.length; i++) {
			const animation = activeAnimations[i];
			const key = storeId(elementId, animation.name);
			// Removed by an early handoff.
			if (!store.has(key)) continue;
			const started = element.animate(animation.keyframes, animation.options);
			started.startTime = startTime;
			store.set(key, { animation: started, startTime });
		}
	};

	// `ready` rejects when the animation is cancelled before the browser is ready
	// to paint. Leave the store entries so Motion still handles the handoff, but
	// drop the placeholder rather than let it hold the first frame for 10s.
	const abort = () => {
		readyAnimation.cancel();
	};

	const pendingReady = w.__MotionAppearReady;
	if (pendingReady) {
		pendingReady.then(start, abort);
	} else {
		const ready = readyAnimation.ready;
		w.__MotionAppearReady = ready ? ready.then(() => undefined) : Promise.resolve();
		w.__MotionAppearReady.then(start, abort);
	}
}

/**
 * Shrink the serialised source without a JavaScript parser. Only whole-line
 * `//` comments, generated bundler annotations and leading indentation are
 * removed, which is safe because `motionAppearBootstrap` contains no multi-line
 * strings or hand-written block comments.
 */
function compactSource(source: string) {
	return source
		.replace(/\/\* *@__[A-Z_]+__ *\*\//g, '')
		.replace(/^[ \t]*\/\/.*$/gm, '')
		.replace(/^[ \t]+/gm, '')
		.replace(/\n{2,}/g, '\n')
		.trim();
}

/**
 * The exact, user-data-free script body inlined next to an appearing element.
 */
export const appearBootstrapSource = `(${compactSource(String(motionAppearBootstrap))})();`;
