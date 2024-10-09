/** 
based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V.
*/
import Motion from '../../motion/Motion.svelte';
import { loadFeatures } from '../../motion/features/definitions';


const createMotionClass = (features: Parameters<typeof loadFeatures>[0]) => {
	features && loadFeatures(features);
	return Motion as any;
};

export { createMotionClass }
