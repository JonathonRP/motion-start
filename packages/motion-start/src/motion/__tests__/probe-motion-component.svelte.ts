import type { CreateVisualElement } from '../../render/types.js';
import type { VisualElement } from '../../render/VisualElement.svelte.js';
import { createRendererMotionComponent } from '../index.svelte.js';
import type { MotionProps } from '../types.js';
import { makeUseVisualState } from '../utils/use-visual-state.svelte.js';

/**
 * A motion component built on the real `createRendererMotionComponent` with a
 * stubbed renderer and visual element, so the reactive wiring of the motion body
 * can be observed without depending on the DOM feature bundle.
 */

/** Nested prop objects the fixture passes by reference, for identity assertions. */
export const probeStyle = { opacity: 1 };
export const probeVariants = {
	visible: { x: 0 },
	hidden: { x: 100 },
};

export interface ProbeRecord {
	createProps: MotionProps | null;
	updateProps: MotionProps[];
	renderProps: {
		props: MotionProps;
		visualElement?: VisualElement<HTMLElement>;
	} | null;
	visualElement: VisualElement<HTMLElement> | null;
}

export const probe: ProbeRecord = {
	createProps: null,
	updateProps: [],
	renderProps: null,
	visualElement: null,
};

export function resetProbe() {
	probe.createProps = null;
	probe.updateProps = [];
	probe.renderProps = null;
	probe.visualElement = null;
}

const noop = () => undefined;

const createVisualElement: CreateVisualElement<HTMLElement> = ((
	_Component: unknown,
	options: { props: MotionProps; visualState: { latestValues: Record<string, unknown> } }
) => {
	probe.createProps = options.props;

	const element = {
		type: 'probe',
		props: options.props,
		latestValues: options.visualState.latestValues,
		listeners: {},
		options: {},
		presenceContext: null,
		projection: undefined,
		animationState: undefined,
		update(props: MotionProps) {
			element.props = props;
			probe.updateProps.push(props);
		},
		updateFeatures: noop,
		render: noop,
		mount: noop,
		unmount: noop,
	};

	probe.visualElement = element as unknown as VisualElement<HTMLElement>;
	return probe.visualElement;
}) as unknown as CreateVisualElement<HTMLElement>;

const useVisualState = makeUseVisualState<HTMLElement, Record<string, unknown>>({
	scrapeMotionValuesFromProps: () => ({}),
	createRenderState: () => ({}),
});

export const ProbeMotion = createRendererMotionComponent<MotionProps, HTMLElement, Record<string, unknown>>({
	createVisualElement,
	useVisualState,
	useRender: ((_anchor: unknown, props: ProbeRecord['renderProps']) => {
		probe.renderProps = props;
		return null;
	}) as never,
	Component: 'div',
});
