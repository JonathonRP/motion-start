import type { MutableRefObject, RefObject } from '../../../utils/safe-react-types';
import type { Snippet } from 'svelte';
import type { Attachment } from 'svelte/attachments';

export interface Size {
	width: number;
	height: number;
	top: number;
	left: number;
}

export interface Props {
	children: Snippet;
	isPresent: boolean;
}

export interface MeasureProps extends Props {
	child: HTMLElement | SVGElement;
	size: Size;
}
