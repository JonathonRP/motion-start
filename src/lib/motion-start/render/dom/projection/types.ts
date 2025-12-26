/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/
import type { LayoutState, TargetProjection } from "../../utils/state";
export type ScaleCorrection = (latest: string | number, layoutState: LayoutState, projection: TargetProjection) => string | number;
export interface ScaleCorrectionDefinition {
    process: ScaleCorrection;
    applyTo?: string[];
}
export type ScaleCorrectionDefinitionMap = {
    [key: string]: ScaleCorrectionDefinition;
};
