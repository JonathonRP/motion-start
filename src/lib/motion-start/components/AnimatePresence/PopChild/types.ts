import type { MutableRefObject, RefObject } from '../../../utils/safe-react-types';
import type { Snippet } from 'svelte';

export interface Size {
	width: number;
	height: number;
	top: number;
	left: number;
}

export interface Props {
	children?: Snippet;
	isPresent: boolean;
}

export interface MeasureProps extends Props {
	childRef: MutableRefObject<HTMLElement>;
	sizeRef: MutableRefObject<Size>;
}
