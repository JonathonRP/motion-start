import type { Component, ComponentProps, Snippet } from 'svelte';

export type ComponentPropsWithChildren<Comp extends Component, Props extends ComponentProps<Comp> = ComponentProps<Comp>, ArgsT extends unknown[] = []> = PropsWithChildren<Props, ArgsT>

export type PropsWithChildren<Props, ArgsT extends unknown[] = []> = Props & {
	children: Snippet<ArgsT>;
};
