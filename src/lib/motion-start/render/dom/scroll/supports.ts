/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { memo } from '../../../utils/memo';

export const supportsScrollTimeline = memo(() => window.ScrollTimeline !== undefined);
