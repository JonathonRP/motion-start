/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import type { RefObject } from "react";
import type { Point2D } from "../types/geometry";

/** @public */
export interface EventInfo {
    point: Point2D;
}
export type EventHandler = (event: MouseEvent | TouchEvent | PointerEvent, info: EventInfo) => void;
export type ListenerControls = [() => void, () => void];
export type TargetOrRef = EventTarget | RefObject<EventTarget>;
export type TargetBasedReturnType<Target> = Target extends EventTarget ? ListenerControls : undefined;
