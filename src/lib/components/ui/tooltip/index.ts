import type { Component } from 'svelte';
import { Tooltip as TooltipPrimitive } from 'bits-ui';
import Trigger from './tooltip-trigger.svelte';
import Content from './tooltip-content.svelte';

const Root = TooltipPrimitive.Root as Component<Record<string, unknown>>;
const Provider = TooltipPrimitive.Provider as Component<Record<string, unknown>>;
const Portal = TooltipPrimitive.Portal as Component<Record<string, unknown>>;

export {
	Root,
	Trigger,
	Content,
	Provider,
	Portal,
	//
	Root as Tooltip,
	Content as TooltipContent,
	Trigger as TooltipTrigger,
	Provider as TooltipProvider,
	Portal as TooltipPortal,
};
