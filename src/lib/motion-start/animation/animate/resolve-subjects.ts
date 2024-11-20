/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { resolveElements, type SelectorCache } from '../../render/dom/utils/resolve-element';
import type { ObjectTarget } from '../sequence/types';
import type { AnimationScope, DOMKeyframesDefinition } from '../types';
import { isDOMKeyframes } from '../utils/is-dom-keyframes';

export function resolveSubjects<O extends {}>(
	subject: string | Element | Element[] | NodeListOf<Element> | O | O[],
	keyframes: DOMKeyframesDefinition | ObjectTarget<O>,
	scope?: AnimationScope,
	selectorCache?: SelectorCache
) {
	if (typeof subject === 'string' && isDOMKeyframes(keyframes)) {
		return resolveElements(subject, scope, selectorCache);
	} else if (subject instanceof NodeList) {
		return Array.from(subject);
	} else if (Array.isArray(subject)) {
		return subject;
	} else {
		return [subject];
	}
}
