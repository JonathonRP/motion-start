import type { ComponentProps } from 'svelte';
import LayoutGroup from './LayoutGroup.svelte';
import type { LayoutGroupProps } from './types.js';

describe('test components type - svelte 5', () => {
	it('should have Svelte component type for LayoutGroup', () => {
		assertType<LayoutGroupProps>({} as ComponentProps<typeof LayoutGroup>);
		assertType<ComponentProps<typeof LayoutGroup>>({} as LayoutGroupProps);
	});
});
