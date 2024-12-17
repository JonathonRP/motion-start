
//"$lib/motion-start/context/DOMcontext.js";
import { writable } from "svelte/store";
export const getDomContext = (
	name,
	el
) => {
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
import { createBatcher } from "./batcher";
function SharedLayoutContext(custom) {
    return (getDomContext('SharedLayout', custom)) || writable(createBatcher());
}
function isSharedLayout(context){
    return 'forceUpdate' in context;
}

export { SharedLayoutContext, isSharedLayout };