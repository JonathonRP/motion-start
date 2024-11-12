import type { Writable } from 'svelte/store';
import type { MotionContextProps } from './MotionContext';
import type { MotionConfigContext } from './MotionConfigContext';
import type { SwitchLayoutGroupContext } from './SwitchLayoutGroupContext';
import type { PresenceContextProps } from './PresenceContext';
import type { ReorderContextProps } from '../components/Reorder/types';
import type { LazyContextProps } from './LazyContext';
import type { LayoutGroupContextProps } from './LayoutGroupContext';

export const getDomContext = (
	name: string,
	el: any
):
	| Writable<
			MotionContextProps &
				SwitchLayoutGroupContext &
				MotionConfigContext &
				(ReorderContextProps<any> | null) &
				(PresenceContextProps | null) &
				LazyContextProps &
				LayoutGroupContextProps
	  >
	| undefined => {
	if (!el || !window) {
		return undefined;
	}
	let par = el;
	while ((par = par.parentNode)) {
		if (par.motionDomContext && par.motionDomContext.has(name)) {
			return par.motionDomContext.get(name);
		}
	}
	return undefined;
};

export const setDomContext = (name: string, el: any, value: any) => {
	if (el && window) {
		if (!el.motionDomContext) {
			el.motionDomContext = new Map();
		}
		el.motionDomContext.set(name, value);
	}
};
