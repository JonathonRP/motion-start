import type { MotionProps } from 'svelte-motion';
import type { DefaultPropsType as DefaultComponentProps } from '..';
import Group from './Group.svelte';
import Item from './Item.svelte';

export type DefaultPropsType = MotionProps & Pick<DefaultComponentProps, 'children'> & { class?: string };

export const Reorder = {
	Group,
	Item,
};
