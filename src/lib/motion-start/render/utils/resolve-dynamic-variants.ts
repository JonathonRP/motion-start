/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { TargetAndTransition, TargetResolver } from '../../types';
import type { VisualElement } from '../VisualElement';
import { resolveVariantFromProps } from './resolve-variants';

/**
 * Resovles a variant if it's a variant resolver
 */
export function resolveVariant<I>(
	visualElement: VisualElement<I>,
	definition: TargetAndTransition | TargetResolver,
	custom?: any
): TargetAndTransition;
export function resolveVariant<I>(
	visualElement: VisualElement<I>,
	definition?: string | TargetAndTransition | TargetResolver,
	custom?: any
): TargetAndTransition | undefined;
export function resolveVariant<I>(
	visualElement: VisualElement<I>,
	definition?: string | TargetAndTransition | TargetResolver,
	custom?: any
) {
	const props = visualElement.getProps();
	return resolveVariantFromProps(props, definition, custom !== undefined ? custom : props.custom, visualElement);
}
