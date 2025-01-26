import { Context } from './index.svelte';

export function createContext<T>(defaultValue: T) {
	return new Context<T>(defaultValue);
}
