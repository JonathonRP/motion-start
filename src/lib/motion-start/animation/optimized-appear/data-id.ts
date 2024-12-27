/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { camelToDash } from '../../render/dom/utils/camel-to-dash';

export const optimizedAppearDataId = 'framerAppearId';

export const optimizedAppearDataAttribute = ('data-' + camelToDash(optimizedAppearDataId)) as 'data-framer-appear-id';
