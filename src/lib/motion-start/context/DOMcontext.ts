import type { Writable } from 'svelte/store';
import type { MotionContextProps } from './MotionContext';
import type { MotionConfigContext } from './MotionConfigContext';
import type { SwitchLayoutGroupContext } from './SwitchLayoutGroupContext';
import type { PresenceContext } from './PresenceContext';
import type { ReorderContext } from '../components/Reorder/types';
import type { LazyContext } from './LazyContext';
import type { LayoutGroupContext } from './LayoutGroupContext';

export const getDomContext = (
	name: string,
	el: any
):
	| Writable<
			MotionContextProps &
				SwitchLayoutGroupContext &
				MotionConfigContext &
				(ReorderContext<any> | null) &
				(PresenceContext | null) &
				LazyContext &
				LayoutGroupContext &
				string
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
