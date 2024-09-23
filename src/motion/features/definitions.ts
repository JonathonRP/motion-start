/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import type { FeatureComponents, FeatureDefinitions } from "./types";


/** 
based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V.
*/

var createDefinition = function (propNames) { return ({
    isEnabled: function (props) { return propNames.some(function (name) { return !!props[name]; }); },
}); };
var featureDefinitions = {
    measureLayout: createDefinition(["layout", "layoutId", "drag"]),
    animation: createDefinition([
        "animate",
        "exit",
        "variants",
        "whileHover",
        "whileTap",
        "whileFocus",
        "whileDrag",
    ]),
    exit: createDefinition(["exit"]),
    drag: createDefinition(["drag", "dragControls"]),
    focus: createDefinition(["whileFocus"]),
    hover: createDefinition(["whileHover", "onHoverStart", "onHoverEnd"]),
    tap: createDefinition(["whileTap", "onTap", "onTapStart", "onTapCancel"]),
    pan: createDefinition([
        "onPan",
        "onPanStart",
        "onPanSessionStart",
        "onPanEnd",
    ]),
    layoutAnimation: createDefinition(["layout", "layoutId"]),
} satisfies FeatureDefinitions;
function loadFeatures(features: FeatureComponents): void {
    for (var key in features) {
        var Component = (features as any)[key];
        if (Component !== null){
            (featureDefinitions as any)[key].Component = Component;
        }
    }
}

export { featureDefinitions, loadFeatures };
