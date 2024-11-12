/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

export function shallowCompare(next: unknown[], prev: unknown[] | null) {
	if (!Array.isArray(prev)) return false;

	const prevLength = prev.length;

	if (prevLength !== next.length) return false;

	for (let i = 0; i < prevLength; i++) {
		if (prev[i] !== next[i]) return false;
	}

	return true;
}
