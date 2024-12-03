/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

/**
 * Decides if the supplied variable is variant label
 */
export function isVariantLabel(v: unknown): v is string | string[] {
	return typeof v === 'string' || Array.isArray(v);
}
