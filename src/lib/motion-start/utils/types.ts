import type { Component, ComponentProps, Snippet } from 'svelte';

export type withChildren<TProps> = TProps & {
	children?: Snippet;
};
