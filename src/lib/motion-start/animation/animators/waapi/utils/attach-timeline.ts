/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

export function attachTimeline(animation: Animation, timeline: any) {
	animation.timeline = timeline;
	animation.onfinish = null;
}
