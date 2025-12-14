import { collectMotionValues } from '.';
import { useCombineMotionValues } from './use-combine-values.svelte';

export function useComputed<O>(computed: () => O) {
	/**
	 * Open session of collectMotionValues. Any MotionValue that calls get()
	 * will be saved into this array.
	 */
	collectMotionValues.current = [];

	const { value, subscribe, updateValue } = useCombineMotionValues(computed);

	subscribe(collectMotionValues.current)
	/**
	 * Synchronously close session of collectMotionValues.
	 */
	collectMotionValues.current = undefined;

	$effect(() => {
		collectMotionValues.current = [];
		updateValue();
		const unsubscribe = subscribe(collectMotionValues.current);
		collectMotionValues.current = undefined;

		return unsubscribe;
	});

	return value;
}
