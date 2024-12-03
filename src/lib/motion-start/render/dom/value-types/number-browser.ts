/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import { px } from '../../../value/types/numbers/units';
import type { ValueTypeMap } from './types';

export const browserNumberValueTypes: ValueTypeMap = {
	// Border props
	borderWidth: px,
	borderTopWidth: px,
	borderRightWidth: px,
	borderBottomWidth: px,
	borderLeftWidth: px,
	borderRadius: px,
	radius: px,
	borderTopLeftRadius: px,
	borderTopRightRadius: px,
	borderBottomRightRadius: px,
	borderBottomLeftRadius: px,

	// Positioning props
	width: px,
	maxWidth: px,
	height: px,
	maxHeight: px,
	top: px,
	right: px,
	bottom: px,
	left: px,

	// Spacing props
	padding: px,
	paddingTop: px,
	paddingRight: px,
	paddingBottom: px,
	paddingLeft: px,
	margin: px,
	marginTop: px,
	marginRight: px,
	marginBottom: px,
	marginLeft: px,

	// Misc
	backgroundPositionX: px,
	backgroundPositionY: px,
};
