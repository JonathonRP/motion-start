/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

const createUnitType = (unit: string) => ({
	test: (v: string | number) => typeof v === 'string' && v.endsWith(unit) && v.split(' ').length === 1,
	parse: Number.parseFloat,
	transform: (v: number | string) => `${v}${unit}`,
});

export const degrees = /*@__PURE__*/ createUnitType('deg');
export const percent = /*@__PURE__*/ createUnitType('%');
export const px = /*@__PURE__*/ createUnitType('px');
export const vh = /*@__PURE__*/ createUnitType('vh');
export const vw = /*@__PURE__*/ createUnitType('vw');

export const progressPercentage = {
	...percent,
	parse: (v: string) => percent.parse(v) / 100,
	transform: (v: number) => percent.transform(v * 100),
};
