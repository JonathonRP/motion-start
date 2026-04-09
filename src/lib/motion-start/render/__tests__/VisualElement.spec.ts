import { describe, expect, it, vi } from 'vitest';
import { VisualElement } from '../VisualElement.svelte';
import type { MotionProps } from '../../motion/types';
import { featureDefinitions } from '../../motion/features/definitions';
import type { VisualElementOptions } from '../types';

class TestVisualElement extends VisualElement<HTMLElement, {}, {}> {
	type = 'html';

	sortInstanceNodePosition() {
		return 0;
	}

	measureInstanceViewportBox() {
		return {
			x: { min: 0, max: 0 },
			y: { min: 0, max: 0 },
		};
	}

	getBaseTargetFromProps() {
		return undefined;
	}

	readValueFromInstance() {
		return undefined;
	}

	removeValueFromRenderState() {}

	build() {}

	renderInstance() {}
}

function createVisualElement(props: MotionProps = {}) {
	return new TestVisualElement(
		{
			parent: null,
			props,
			presenceContext: null,
			reducedMotionConfig: 'never',
			blockInitialAnimation: false,
			visualState: { latestValues: {}, renderState: {} },
		} as VisualElementOptions<HTMLElement, {}>,
		{}
	);
}

describe('VisualElement.updateFeatures', () => {
	it('keeps an existing feature mounted when its enabling prop becomes falsy', () => {
		const mount = vi.fn();
		const update = vi.fn();
		const unmount = vi.fn();

		class TestFeature {
			isMounted = false;

			constructor(public node: VisualElement<HTMLElement>) {}

			mount() {
				mount();
			}

			update() {
				update();
			}

			unmount() {
				unmount();
			}
		}

		const originalAnimation = featureDefinitions.animation;
		featureDefinitions.animation = {
			...originalAnimation,
			Feature: TestFeature as never,
			isEnabled: (props: MotionProps) => Boolean(props.animate),
		};

		try {
			const visualElement = createVisualElement({ animate: { opacity: 1 } });

			visualElement.updateFeatures();
			expect(mount).toHaveBeenCalledTimes(1);
			expect(update).not.toHaveBeenCalled();

			visualElement.update({}, null);
			visualElement.updateFeatures();

			expect(update).toHaveBeenCalledTimes(1);
			expect(unmount).not.toHaveBeenCalled();
			expect(visualElement.features.animation).toBeDefined();
		} finally {
			featureDefinitions.animation = originalAnimation;
		}
	});
});
