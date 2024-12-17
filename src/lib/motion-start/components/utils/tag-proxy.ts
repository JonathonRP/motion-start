import type { Component, Snippet } from 'svelte';

export type CreateComponent<Props> = (
	key: string | Component<Props & { children: Snippet }>
) => Component<Props & { children: Snippet }>;

type BindProps<ComponentProps, TagProps> = ComponentProps & Omit<TagProps, keyof ComponentProps>;

type BoundComponents<ComponentProps, TagsWithProps> = {
	[K in keyof TagsWithProps]: Component<BindProps<ComponentProps, TagsWithProps[K]> & { children: Snippet }>;
};

export function tagProxy<ComponentProps extends {}, TagsWithProps>(createComponent: CreateComponent<ComponentProps>) {
	const cache = new Map<string, any>();

	return new Proxy(createComponent, {
		get: (_, key: string) => {
			if (!cache.has(key)) cache.set(key, createComponent(key));
			return cache.get(key);
		},
	}) as (<TagProps>(
		Component: Component<any>
	) => Component<BindProps<ComponentProps, TagProps> & { children: Snippet }>) &
		BoundComponents<ComponentProps, TagsWithProps>;
}
