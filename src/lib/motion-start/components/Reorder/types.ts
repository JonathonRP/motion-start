interface Axis {
	min: number;
	max: number;
}

interface Box {
	x: Axis;
	y: Axis;
}

export interface ReorderContextProps<T> {
	axis: 'x' | 'y';
	registerItem: (item: T, layout: Box) => void;
	updateOrder: (item: T, offset: number, velocity: number) => void;
}

export interface ItemData<T> {
	value: T;
	layout: Axis;
}

export type DevMessage = (check: boolean, message: string) => void;

type EasingFunction = (v: number) => number;

/**
 * @public
 */
export interface TransformOptions<T> {
	/**
	 * Clamp values to within the given range. Defaults to `true`
	 *
	 * @public
	 */
	clamp?: boolean;

	/**
	 * Easing functions to use on the interpolations between each value in the input and output ranges.
	 *
	 * If provided as an array, the array must be one item shorter than the input and output ranges, as the easings apply to the transition **between** each.
	 *
	 * @public
	 */
	ease?: EasingFunction | EasingFunction[];

	/**
	 * Provide a function that can interpolate between any two values in the provided range.
	 *
	 * @public
	 */
	mixer?: (from: T, to: T) => (v: number) => any;
}
