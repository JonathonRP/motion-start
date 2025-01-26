import type { Context } from './index.svelte';

export function useContext<T>(context: Context<T>) {
	return context.pipe();
}
