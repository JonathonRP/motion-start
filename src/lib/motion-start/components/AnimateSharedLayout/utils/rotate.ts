/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import type { VisualElement } from '../../../render/types';

/** 
based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V.
*/

import { transformAxes } from '../../../render/html/utils/transform.js';

function resetRotate(child: VisualElement): void {
	// If there's no detected rotation values, we can early return without a forced render.
	var hasRotate = false;
	// Keep a record of all the values we've reset
	var resetValues = {};
	// Check the rotate value of all axes and reset to 0
	for (var i = 0; i < transformAxes.length; i++) {
		var axis = transformAxes[i];
		var key = 'rotate' + axis;
		// If this rotation doesn't exist as a motion value, then we don't
		// need to reset it
		if (!child.hasValue(key) || child.getStaticValue(key) === 0) continue;
		hasRotate = true;
		// Record the rotation and then temporarily set it to 0
		(resetValues as any)[key] = child.getStaticValue(key);
		child.setStaticValue(key, 0);
	}
	// If there's no rotation values, we don't need to do any more.
	if (!hasRotate) return;
	// Force a render of this element to apply the transform with all rotations
	// set to 0.
	child.syncRender();
	// Put back all the values we reset
	for (var key in resetValues) {
		//@ts-error
		child.setStaticValue(key, (resetValues as any)[key]);
	}
	// Schedule a render for the next frame. This ensures we won't visually
	// see the element with the reset rotate value applied.
	child.scheduleRender();
}

export { resetRotate };
