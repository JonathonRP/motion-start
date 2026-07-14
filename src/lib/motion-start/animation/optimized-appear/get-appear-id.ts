/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { optimizedAppearDataAttribute } from './data-id';
import type { WithAppearProps } from './types';

export function getOptimisedAppearId(visualElement: WithAppearProps): string | undefined {
	return visualElement.props[optimizedAppearDataAttribute];
}
