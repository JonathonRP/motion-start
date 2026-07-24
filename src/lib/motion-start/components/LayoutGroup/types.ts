import type { Snippet } from 'svelte';

export type InheritOption = boolean | 'id' | 'group';

export interface LayoutGroupProps {
	id?: string;
	inherit?: InheritOption;
	children?: Snippet<
		[
			props: {
				forceRender: VoidFunction;
				key: number;
			},
		]
	>;
}
