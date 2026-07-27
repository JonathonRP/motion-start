/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

export function memo<T>(callback: () => T) {
	let result: T | undefined;

	return () => {
		if (result === undefined) result = callback();
		return result;
	};
}
