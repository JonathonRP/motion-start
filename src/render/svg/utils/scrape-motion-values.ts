/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import { MotionProps } from "../../../motion/types";
export declare function scrapeMotionValuesFromProps(props: MotionProps): {};


/** 
based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V.
*/
import { isMotionValue } from '../../../value/utils/is-motion-value.js';
import { scrapeMotionValuesFromProps as scrapeMotionValuesFromProps$1 } from '../../html/utils/scrape-motion-values.js';

function scrapeMotionValuesFromProps(props) {
    var newValues = scrapeMotionValuesFromProps$1(props);
    for (var key in props) {
        if (isMotionValue(props[key])) {
            var targetKey = key === "x" || key === "y" ? "attr" + key.toUpperCase() : key;
            newValues[targetKey] = props[key];
        }
    }
    return newValues;
}

export { scrapeMotionValuesFromProps };
