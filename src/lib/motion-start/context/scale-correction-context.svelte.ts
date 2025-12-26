/**
 * Scale Correction Context
 * Based on framer-motion@11.11.11
 */

import { writable } from 'svelte/store';
import { getDomContext, setDomContext } from './DOMcontext.js';
import { getContext, setContext } from 'svelte';

export const ScaleCorrectionContext = (isCustom?: any) =>
	getDomContext('ScaleCorrection', isCustom) || writable([]);

export const ScaleCorrectionParentContext = () => writable([] as unknown[]);

export const provideScaleCorrection = (isCustom?: any) => {
	const fromParent = getContext(ScaleCorrectionContext) || ScaleCorrectionContext(isCustom);

	const ctx = ScaleCorrectionContext();
	setContext(ScaleCorrectionContext, ctx);
	setDomContext('ScaleCorrection', isCustom, ctx);

	setContext(ScaleCorrectionParentContext, fromParent);
};
