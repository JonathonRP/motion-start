import type { Component, ComponentProps, Snippet } from 'svelte';

export type PropsWithChildren<Props, ArgsT extends unknown[] = []> = Props & {
	children?: Snippet<ArgsT>;
};
