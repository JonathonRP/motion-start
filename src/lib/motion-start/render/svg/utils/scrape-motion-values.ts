/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import type { MotionProps } from "../../../motion/types";


/** 
based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V.
*/
import { isMotionValue } from '../../../value/utils/is-motion-value.js';
import { scrapeMotionValuesFromProps as scrapeMotionValuesFromProps$1 } from '../../html/utils/scrape-motion-values.js';

function scrapeMotionValuesFromProps(props: MotionProps) {
    var newValues = scrapeMotionValuesFromProps$1(props);
    for (var key in props) {
        //@ts-ignore
        if (isMotionValue(props[key])) {
            var targetKey = key === "x" || key === "y" ? "attr" + key.toUpperCase() : key;
            //@ts-ignore
            newValues[targetKey] = props[key];
        }
    }
    return newValues;
}

export { scrapeMotionValuesFromProps };
