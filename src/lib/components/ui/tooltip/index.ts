import { Tooltip as TooltipPrimitive } from 'bits-ui';
import type { Component } from 'svelte';
import Trigger from './tooltip-trigger.svelte';
import Content from './tooltip-content.svelte';

const Root: Component<TooltipPrimitive.RootProps> = TooltipPrimitive.Root;
const Provider: Component<TooltipPrimitive.ProviderProps> = TooltipPrimitive.Provider;
const Portal: Component<TooltipPrimitive.PortalProps> = TooltipPrimitive.Portal;

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
