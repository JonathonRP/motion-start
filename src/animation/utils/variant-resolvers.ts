/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import { MotionValue } from "../../value";
type VariantNameList = string[];
type VariantName = string | VariantNameList;
type UnresolvedVariant = VariantName | MotionValue;
export type resolveVariantLabels = (variant?: UnresolvedVariant | undefined) => VariantNameList;
/**
 * Hooks in React sometimes accept a dependency array as their final argument. (ie useEffect/useMemo)
 * When values in this array change, React re-runs the dependency. However if the array
 * contains a variable number of items, React throws an error.
 */
export type asDependencyList = (list: VariantNameList) => string[];