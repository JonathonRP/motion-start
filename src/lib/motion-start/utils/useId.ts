export const useId = ((prefix?: string) => {
	let i = 0;
	return () => {
		const id = (i++).toString();
		return prefix ? prefix + id : id;
	};
})();
