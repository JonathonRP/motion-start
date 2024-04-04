/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import { VisualElement } from "../types";
export declare function isDraggable(visualElement: VisualElement): boolean | undefined;


/** 
based on framer-motion@4.1.11,
Copyright (c) 2018 Framer B.V.
*/
function isDraggable(visualElement) {
    var _a = visualElement.getProps(), drag = _a.drag, _dragX = _a._dragX;
    return drag && !_dragX;
}

export { isDraggable };
