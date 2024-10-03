/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import type { VisualElement } from '../../../render/types';
export type LeadAndFollow = [VisualElement | undefined, VisualElement | undefined];
export interface LayoutStack {
	add(element: VisualElement): void;
	remove(element: VisualElement): void;
	getLead(): VisualElement | undefined;
	updateSnapshot(): void;
	clearSnapshot(): void;
	animate(element: VisualElement, crossfade: boolean): void;
	updateLeadAndFollow(): void;
}

/** 
based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V.
*/

import { elementDragControls } from '../../../gestures/drag/VisualElementDragControls.js';
import { Presence } from '../types.js';
import { createCrossfader } from './crossfader.js';
import type { AxisBox2D, Point2D } from '../../../types/geometry';

function layoutStack(): LayoutStack {
	var stack = new Set();
	var state = { leadIsExiting: false, lead: {} as VisualElement, follow: {} as VisualElement };
	var prevState = Object.assign({}, state);
	var prevValues: any;
	var prevViewportBox: AxisBox2D| undefined;
	var prevDragCursor: Point2D | undefined;
	var crossfader = createCrossfader();
	var needsCrossfadeAnimation = false;
	function getFollowViewportBox() {
		return state.follow ? state.follow.prevViewportBox : prevViewportBox;
	}
	function getFollowLayout() {
		var _a;
		return (_a = state.follow) === null || _a === void 0 ? void 0 : _a.getLayoutState().layout;
	}
	return {
		add: (element) => {
			element.setCrossfader(crossfader);
			stack.add(element);
			/**
			 * Hydrate new element with previous drag position if we have one
			 */
			if (prevDragCursor) element.prevDragCursor = prevDragCursor;
			if (!state.lead) state.lead = element;
		},
		remove: (element) => {
			stack.delete(element);
		},
		getLead: () => state.lead,
		updateSnapshot: () => {
			//@ts-ignore
			if (!state.lead) return;
			prevValues = crossfader.isActive() ? crossfader.getLatestValues() : state.lead.getLatestValues(); //wierd
			prevViewportBox = state.lead.prevViewportBox;
			var dragControls = elementDragControls.get(state.lead);
			if (dragControls && dragControls.isDragging) {
				//@ts-ignore
				prevDragCursor = dragControls.cursorProgress;
			}
		},
		clearSnapshot: () => {
			prevDragCursor = prevViewportBox = undefined;
		},
		updateLeadAndFollow: () => {
			var _a;
			prevState = Object.assign({}, state);
			var lead;
			var follow;
			var order = Array.from(stack);
			for (var i = order.length; i--; i >= 0) {
				var element = order[i];
				if (lead) follow !== null && follow !== void 0 ? follow : (follow = element);
				lead !== null && lead !== void 0 ? lead : (lead = element);
				if (lead && follow) break;
			}
			state.lead = lead as VisualElement;
			state.follow = follow as VisualElement;
			state.leadIsExiting = ((_a = state.lead) === null || _a === void 0 ? void 0 : _a.presence) === Presence.Exiting;
			crossfader.setOptions({
				lead: lead as VisualElement,
				follow: follow as VisualElement,
				prevValues: prevValues,
				crossfadeOpacity:
				// @ts-expect-error
					(follow === null || follow === void 0 ? void 0 : follow.isPresenceRoot) ||// @ts-expect-error
					(lead === null || lead === void 0 ? void 0 : lead.isPresenceRoot),
			});
			if (
				// Don't crossfade if we've just animated back from lead and switched the
				// old follow to the new lead.
				state.lead !== prevState.follow &&
				(prevState.lead !== state.lead || prevState.leadIsExiting !== state.leadIsExiting)
			) {
				needsCrossfadeAnimation = true;
			}
		},
		animate: (child, shouldCrossfade) => {
			var _a;
			if (shouldCrossfade === void 0) {
				shouldCrossfade = false;
			}
			if (child === state.lead) {
				if (shouldCrossfade) {
					/**
					 * Point a lead to itself in case it was previously pointing
					 * to a different visual element
					 */
					child.pointTo(state.lead);
				} else {
					child.setVisibility(true);
				}
				var config = {};
				var prevParent = (_a = state.follow) === null || _a === void 0 ? void 0 : _a.getProjectionParent();
				if (prevParent) {
					/**
					 * We'll use this to determine if the element or its layoutId has been reparented.
					 */
					// @ts-expect-error
					config.prevParent = prevParent;
				}
				if (child.presence === Presence.Entering) {// @ts-expect-error
					config.originBox = getFollowViewportBox();
				} else if (child.presence === Presence.Exiting) {// @ts-expect-error
					config.targetBox = getFollowLayout();
				}
				if (needsCrossfadeAnimation) {
					needsCrossfadeAnimation = false;
					var transition = child.getDefaultTransition();
					child.presence === Presence.Entering ? crossfader.toLead(transition) : crossfader.fromLead(transition);
				}
				child.notifyLayoutReady(config);
			} else {
				if (shouldCrossfade) {
					state.lead && child.pointTo(state.lead);
				} else {
					child.setVisibility(false);
				}
			}
		},
	};
}

export { layoutStack };
