import type { Context } from './index.svelte';

export function useContext<T>(context: Context<T>) {
	// biome-ignore lint/complexity/useLiteralKeys: <explanation>
	return context['exists']() ? context['get']() : context['create']();
}
