/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
import type {
	CustomValueType,
	Target,
	TargetAndTransition,
	TargetResolver,
	TargetWithKeyframes,
	Transition,
} from '../../types';
import type { ResolvedValues, VisualElement } from '../types';
import type { AnimationDefinition } from './animation';

/** 
based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V.
*/
import { complex } from 'style-value-types';
import type { VariantLabels } from '../../motion/types';
import { isNumericalString } from '../../utils/is-numerical-string.js';
import { resolveFinalValueInKeyframes } from '../../utils/resolve-value.js';
import { motionValue } from '../../value/index.js';
import { getAnimatableNone } from '../dom/value-types/animatable-none.js';
import { findValueType } from '../dom/value-types/find.js';
import { resolveVariant } from './variants.js';

export { checkTargetForNewValues, getOrigin, getOriginFromTransition, setTarget, setValues };

/**
 * Set VisualElement's MotionValue, creating a new MotionValue for it if
 * it doesn't exist.
 */
function setMotionValue(visualElement: VisualElement, key: string, value: any) {
	if (visualElement.hasValue(key)) {
		visualElement.getValue(key)?.set(value);
	} else {
		visualElement.addValue(key, motionValue(value));
	}
}
function setTarget(visualElement: VisualElement, definition: string | TargetAndTransition | TargetResolver) {
	var resolved = resolveVariant(visualElement, definition);
	var _a = resolved ? visualElement.makeTargetAnimatable(resolved, false) : {},
		_b = _a.transitionEnd;
	var { transition, transitionEnd = _b === void 0 ? {} : _b, ...target } = _a;
	target = Object.assign(Object.assign({}, target), transitionEnd);
	for (var key in target) {
		// @ts-expect-error
		var value = resolveFinalValueInKeyframes(target[key]);
		setMotionValue(visualElement, key, value);
	}
}
function setVariants(visualElement: VisualElement, variantLabels: VariantLabels) {
	var reversedLabels = [...variantLabels].reverse();
	reversedLabels.forEach((key) => {
		var _a;
		var variant = visualElement.getVariant(key);
		variant && setTarget(visualElement, variant);
		(_a = visualElement.variantChildren) === null || _a === void 0
			? void 0
			: _a.forEach((child) => {
					setVariants(child, variantLabels);
				});
	});
}
function setValues(visualElement: VisualElement, definition: AnimationDefinition) {
	if (Array.isArray(definition)) {
		return setVariants(visualElement, definition);
	} else if (typeof definition === 'string') {
		return setVariants(visualElement, [definition]);
	} else {
		setTarget(visualElement, definition);
	}
}
function checkTargetForNewValues(visualElement: VisualElement, target: TargetWithKeyframes, origin: ResolvedValues) {
	var _a, _b, _c;
	var _d;
	var newValueKeys = Object.keys(target).filter((key) => !visualElement.hasValue(key));
	var numNewValues = newValueKeys.length;
	if (!numNewValues) return;
	for (var i = 0; i < numNewValues; i++) {
		var key = newValueKeys[i]; //@ts-ignore
		var targetValue = target[key];
		var value = null;
		/**
		 * If the target is a series of keyframes, we can use the first value
		 * in the array. If this first value is null, we'll still need to read from the DOM.
		 */
		if (Array.isArray(targetValue)) {
			value = targetValue[0];
		}
		/**
		 * If the target isn't keyframes, or the first keyframe was null, we need to
		 * first check if an origin value was explicitly defined in the transition as "from",
		 * if not read the value from the DOM. As an absolute fallback, take the defined target value.
		 */
		if (value === null) {
			//@ts-ignore
			value =
				(_b = (_a = origin[key]) !== null && _a !== void 0 ? _a : visualElement.readValue(key)) !== null &&
				_b !== void 0
					? _b // @ts-expect-error
					: target[key];
		}
		/**
		 * If value is still undefined or null, ignore it. Preferably this would throw,
		 * but this was causing issues in Framer.
		 */
		if (value === undefined || value === null) continue;
		if (typeof value === 'string' && isNumericalString(value)) {
			// If this is a number read as a string, ie "0" or "200", convert it to a number
			value = Number.parseFloat(value);
		} else if (!findValueType(value) && complex.test(targetValue)) {
			value = getAnimatableNone(key, targetValue);
		}
		visualElement.addValue(key, motionValue(value));
		(_c = (_d = origin)[key]) !== null && _c !== void 0 ? _c : (_d[key] = value);
		visualElement.setBaseTarget(key, value);
	}
}
function getOriginFromTransition(key: string, transition: Transition) {
	if (!transition) return; //@ts-expect-error
	var valueTransition = transition[key] || transition.default || transition;
	return valueTransition.from;
}
function getOrigin(target: Target, transition: Transition, visualElement: VisualElement) {
	var _a, _b;
	var origin = {};
	for (var key in target) {
		//@ts-ignore
		origin[key] =
			(_a = getOriginFromTransition(key, transition)) !== null && _a !== void 0
				? _a
				: (_b = visualElement.getValue(key)) === null || _b === void 0
					? void 0
					: _b.get();
	}
	return origin as import('../../types').MakeCustomValueType<
		{
			alignContent?: import('csstype').Property.AlignContent | undefined;
			alignItems?: import('csstype').Property.AlignItems | undefined;
			alignSelf?: import('csstype').Property.AlignSelf | undefined;
			alignTracks?: import('csstype').Property.AlignTracks | undefined;
			animationDelay?: import('csstype').Property.AnimationDelay<string & {}> | undefined;
			animationDirection?: import('csstype').Property.AnimationDirection | undefined;
			animationDuration?: import('csstype').Property.AnimationDuration<string & {}> | undefined;
			animationFillMode?: import('csstype').Property.AnimationFillMode | undefined;
			animationIterationCount?: import('csstype').Property.AnimationIterationCount | undefined;
			animationName?: import('csstype').Property.AnimationName | undefined;
			animationPlayState?: import('csstype').Property.AnimationPlayState | undefined;
			animationTimingFunction?: import('csstype').Property.AnimationTimingFunction | undefined;
			appearance?: import('csstype').Property.Appearance | undefined;
			aspectRatio?: import('csstype').Property.AspectRatio | undefined;
			backdropFilter?: import('csstype').Property.BackdropFilter | undefined;
			backfaceVisibility?: import('csstype').Property.BackfaceVisibility | undefined;
			backgroundAttachment?: import('csstype').Property.BackgroundAttachment | undefined;
			backgroundBlendMode?: import('csstype').Property.BackgroundBlendMode | undefined;
			backgroundClip?: import('csstype').Property.BackgroundClip | undefined;
			backgroundColor?: import('csstype').Property.BackgroundColor | undefined;
			backgroundImage?: import('csstype').Property.BackgroundImage | undefined;
			backgroundOrigin?: import('csstype').Property.BackgroundOrigin | undefined;
			backgroundPosition?: import('csstype').Property.BackgroundPosition<string | number> | undefined;
			backgroundPositionX?: import('csstype').Property.BackgroundPositionX<string | number> | undefined;
			backgroundPositionY?: import('csstype').Property.BackgroundPositionY<string | number> | undefined;
			backgroundRepeat?: import('csstype').Property.BackgroundRepeat | undefined;
			backgroundSize?: import('csstype').Property.BackgroundSize<string | number> | undefined;
			blockOverflow?: import('csstype').Property.BlockOverflow | undefined;
			blockSize?: import('csstype').Property.BlockSize<string | number> | undefined;
			borderBlockColor?: import('csstype').Property.BorderBlockColor | undefined;
			borderBlockEndColor?: import('csstype').Property.BorderBlockEndColor | undefined;
			borderBlockEndStyle?: import('csstype').Property.BorderBlockEndStyle | undefined;
			borderBlockEndWidth?: import('csstype').Property.BorderBlockEndWidth<string | number> | undefined;
			borderBlockStartColor?: import('csstype').Property.BorderBlockStartColor | undefined;
			borderBlockStartStyle?: import('csstype').Property.BorderBlockStartStyle | undefined;
			borderBlockStartWidth?: import('csstype').Property.BorderBlockStartWidth<string | number> | undefined;
			borderBlockStyle?: import('csstype').Property.BorderBlockStyle | undefined;
			borderBlockWidth?: import('csstype').Property.BorderBlockWidth<string | number> | undefined;
			borderBottomColor?: import('csstype').Property.BorderBottomColor | undefined;
			borderBottomLeftRadius?: import('csstype').Property.BorderBottomLeftRadius<string | number> | undefined;
			borderBottomRightRadius?: import('csstype').Property.BorderBottomRightRadius<string | number> | undefined;
			borderBottomStyle?: import('csstype').Property.BorderBottomStyle | undefined;
			borderBottomWidth?: import('csstype').Property.BorderBottomWidth<string | number> | undefined;
			borderCollapse?: import('csstype').Property.BorderCollapse | undefined;
			borderEndEndRadius?: import('csstype').Property.BorderEndEndRadius<string | number> | undefined;
			borderEndStartRadius?: import('csstype').Property.BorderEndStartRadius<string | number> | undefined;
			borderImageOutset?: import('csstype').Property.BorderImageOutset<string | number> | undefined;
			borderImageRepeat?: import('csstype').Property.BorderImageRepeat | undefined;
			borderImageSlice?: import('csstype').Property.BorderImageSlice | undefined;
			borderImageSource?: import('csstype').Property.BorderImageSource | undefined;
			borderImageWidth?: import('csstype').Property.BorderImageWidth<string | number> | undefined;
			borderInlineColor?: import('csstype').Property.BorderInlineColor | undefined;
			borderInlineEndColor?: import('csstype').Property.BorderInlineEndColor | undefined;
			borderInlineEndStyle?: import('csstype').Property.BorderInlineEndStyle | undefined;
			borderInlineEndWidth?: import('csstype').Property.BorderInlineEndWidth<string | number> | undefined;
			borderInlineStartColor?: import('csstype').Property.BorderInlineStartColor | undefined;
			borderInlineStartStyle?: import('csstype').Property.BorderInlineStartStyle | undefined;
			borderInlineStartWidth?: import('csstype').Property.BorderInlineStartWidth<string | number> | undefined;
			borderInlineStyle?: import('csstype').Property.BorderInlineStyle | undefined;
			borderInlineWidth?: import('csstype').Property.BorderInlineWidth<string | number> | undefined;
			borderLeftColor?: import('csstype').Property.BorderLeftColor | undefined;
			borderLeftStyle?: import('csstype').Property.BorderLeftStyle | undefined;
			borderLeftWidth?: import('csstype').Property.BorderLeftWidth<string | number> | undefined;
			borderRightColor?: import('csstype').Property.BorderRightColor | undefined;
			borderRightStyle?: import('csstype').Property.BorderRightStyle | undefined;
			borderRightWidth?: import('csstype').Property.BorderRightWidth<string | number> | undefined;
			borderSpacing?: import('csstype').Property.BorderSpacing<string | number> | undefined;
			borderStartEndRadius?: import('csstype').Property.BorderStartEndRadius<string | number> | undefined;
			borderStartStartRadius?: import('csstype').Property.BorderStartStartRadius<string | number> | undefined;
			borderTopColor?: import('csstype').Property.BorderTopColor | undefined;
			borderTopLeftRadius?: import('csstype').Property.BorderTopLeftRadius<string | number> | undefined;
			borderTopRightRadius?: import('csstype').Property.BorderTopRightRadius<string | number> | undefined;
			borderTopStyle?: import('csstype').Property.BorderTopStyle | undefined;
			borderTopWidth?: import('csstype').Property.BorderTopWidth<string | number> | undefined;
			bottom?: import('csstype').Property.Bottom<string | number> | undefined;
			boxDecorationBreak?: import('csstype').Property.BoxDecorationBreak | undefined;
			boxShadow?: import('csstype').Property.BoxShadow | undefined;
			boxSizing?: import('csstype').Property.BoxSizing | undefined;
			breakAfter?: import('csstype').Property.BreakAfter | undefined;
			breakBefore?: import('csstype').Property.BreakBefore | undefined;
			breakInside?: import('csstype').Property.BreakInside | undefined;
			captionSide?: import('csstype').Property.CaptionSide | undefined;
			caretColor?: import('csstype').Property.CaretColor | undefined;
			clear?: import('csstype').Property.Clear | undefined;
			clipPath?: import('csstype').Property.ClipPath | undefined;
			color?: import('csstype').Property.Color | undefined; //@ts-ignore
			colorAdjust?: import('csstype').Property.ColorAdjust | undefined;
			columnCount?: import('csstype').Property.ColumnCount | undefined;
			columnFill?: import('csstype').Property.ColumnFill | undefined;
			columnGap?: import('csstype').Property.ColumnGap<string | number> | undefined;
			columnRuleColor?: import('csstype').Property.ColumnRuleColor | undefined;
			columnRuleStyle?: import('csstype').Property.ColumnRuleStyle | undefined;
			columnRuleWidth?: import('csstype').Property.ColumnRuleWidth<string | number> | undefined;
			columnSpan?: import('csstype').Property.ColumnSpan | undefined;
			columnWidth?: import('csstype').Property.ColumnWidth<string | number> | undefined;
			contain?: import('csstype').Property.Contain | undefined;
			content?: import('csstype').Property.Content | undefined;
			contentVisibility?: import('csstype').Property.ContentVisibility | undefined;
			counterIncrement?: import('csstype').Property.CounterIncrement | undefined;
			counterReset?: import('csstype').Property.CounterReset | undefined;
			counterSet?: import('csstype').Property.CounterSet | undefined;
			cursor?: import('csstype').Property.Cursor | undefined;
			direction?: import('csstype').Property.Direction | undefined;
			display?: import('csstype').Property.Display | undefined;
			emptyCells?: import('csstype').Property.EmptyCells | undefined;
			filter?: import('csstype').Property.Filter | undefined;
			flexBasis?: import('csstype').Property.FlexBasis<string | number> | undefined;
			flexDirection?: import('csstype').Property.FlexDirection | undefined;
			flexGrow?: import('csstype').Property.FlexGrow | undefined;
			flexShrink?: import('csstype').Property.FlexShrink | undefined;
			flexWrap?: import('csstype').Property.FlexWrap | undefined;
			float?: import('csstype').Property.Float | undefined;
			fontFamily?: import('csstype').Property.FontFamily | undefined;
			fontFeatureSettings?: import('csstype').Property.FontFeatureSettings | undefined;
			fontKerning?: import('csstype').Property.FontKerning | undefined;
			fontLanguageOverride?: import('csstype').Property.FontLanguageOverride | undefined;
			fontOpticalSizing?: import('csstype').Property.FontOpticalSizing | undefined;
			fontSize?: import('csstype').Property.FontSize<string | number> | undefined;
			fontSizeAdjust?: import('csstype').Property.FontSizeAdjust | undefined;
			fontSmooth?: import('csstype').Property.FontSmooth<string | number> | undefined;
			fontStretch?: import('csstype').Property.FontStretch | undefined;
			fontStyle?: import('csstype').Property.FontStyle | undefined;
			fontSynthesis?: import('csstype').Property.FontSynthesis | undefined;
			fontVariant?: import('csstype').Property.FontVariant | undefined;
			fontVariantCaps?: import('csstype').Property.FontVariantCaps | undefined;
			fontVariantEastAsian?: import('csstype').Property.FontVariantEastAsian | undefined;
			fontVariantLigatures?: import('csstype').Property.FontVariantLigatures | undefined;
			fontVariantNumeric?: import('csstype').Property.FontVariantNumeric | undefined;
			fontVariantPosition?: import('csstype').Property.FontVariantPosition | undefined;
			fontVariationSettings?: import('csstype').Property.FontVariationSettings | undefined;
			fontWeight?: import('csstype').Property.FontWeight | undefined;
			forcedColorAdjust?: import('csstype').Property.ForcedColorAdjust | undefined;
			gridAutoColumns?: import('csstype').Property.GridAutoColumns<string | number> | undefined;
			gridAutoFlow?: import('csstype').Property.GridAutoFlow | undefined;
			gridAutoRows?: import('csstype').Property.GridAutoRows<string | number> | undefined;
			gridColumnEnd?: import('csstype').Property.GridColumnEnd | undefined;
			gridColumnStart?: import('csstype').Property.GridColumnStart | undefined;
			gridRowEnd?: import('csstype').Property.GridRowEnd | undefined;
			gridRowStart?: import('csstype').Property.GridRowStart | undefined;
			gridTemplateAreas?: import('csstype').Property.GridTemplateAreas | undefined;
			gridTemplateColumns?: import('csstype').Property.GridTemplateColumns<string | number> | undefined;
			gridTemplateRows?: import('csstype').Property.GridTemplateRows<string | number> | undefined;
			hangingPunctuation?: import('csstype').Property.HangingPunctuation | undefined;
			height?: import('csstype').Property.Height<string | number> | undefined;
			hyphens?: import('csstype').Property.Hyphens | undefined;
			imageOrientation?: import('csstype').Property.ImageOrientation | undefined;
			imageRendering?: import('csstype').Property.ImageRendering | undefined;
			imageResolution?: import('csstype').Property.ImageResolution | undefined;
			initialLetter?: import('csstype').Property.InitialLetter | undefined;
			inlineSize?: import('csstype').Property.InlineSize<string | number> | undefined;
			inset?: import('csstype').Property.Inset<string | number> | undefined;
			insetBlock?: import('csstype').Property.InsetBlock<string | number> | undefined;
			insetBlockEnd?: import('csstype').Property.InsetBlockEnd<string | number> | undefined;
			insetBlockStart?: import('csstype').Property.InsetBlockStart<string | number> | undefined;
			insetInline?: import('csstype').Property.InsetInline<string | number> | undefined;
			insetInlineEnd?: import('csstype').Property.InsetInlineEnd<string | number> | undefined;
			insetInlineStart?: import('csstype').Property.InsetInlineStart<string | number> | undefined;
			isolation?: import('csstype').Property.Isolation | undefined;
			justifyContent?: import('csstype').Property.JustifyContent | undefined;
			justifyItems?: import('csstype').Property.JustifyItems | undefined;
			justifySelf?: import('csstype').Property.JustifySelf | undefined;
			justifyTracks?: import('csstype').Property.JustifyTracks | undefined;
			left?: import('csstype').Property.Left<string | number> | undefined;
			letterSpacing?: import('csstype').Property.LetterSpacing<string | number> | undefined;
			lineBreak?: import('csstype').Property.LineBreak | undefined;
			lineHeight?: import('csstype').Property.LineHeight<string | number> | undefined;
			lineHeightStep?: import('csstype').Property.LineHeightStep<string | number> | undefined;
			listStyleImage?: import('csstype').Property.ListStyleImage | undefined;
			listStylePosition?: import('csstype').Property.ListStylePosition | undefined;
			listStyleType?: import('csstype').Property.ListStyleType | undefined;
			marginBlock?: import('csstype').Property.MarginBlock<string | number> | undefined;
			marginBlockEnd?: import('csstype').Property.MarginBlockEnd<string | number> | undefined;
			marginBlockStart?: import('csstype').Property.MarginBlockStart<string | number> | undefined;
			marginBottom?: import('csstype').Property.MarginBottom<string | number> | undefined;
			marginInline?: import('csstype').Property.MarginInline<string | number> | undefined;
			marginInlineEnd?: import('csstype').Property.MarginInlineEnd<string | number> | undefined;
			marginInlineStart?: import('csstype').Property.MarginInlineStart<string | number> | undefined;
			marginLeft?: import('csstype').Property.MarginLeft<string | number> | undefined;
			marginRight?: import('csstype').Property.MarginRight<string | number> | undefined;
			marginTop?: import('csstype').Property.MarginTop<string | number> | undefined;
			maskBorderMode?: import('csstype').Property.MaskBorderMode | undefined;
			maskBorderOutset?: import('csstype').Property.MaskBorderOutset<string | number> | undefined;
			maskBorderRepeat?: import('csstype').Property.MaskBorderRepeat | undefined;
			maskBorderSlice?: import('csstype').Property.MaskBorderSlice | undefined;
			maskBorderSource?: import('csstype').Property.MaskBorderSource | undefined;
			maskBorderWidth?: import('csstype').Property.MaskBorderWidth<string | number> | undefined;
			maskClip?: import('csstype').Property.MaskClip | undefined;
			maskComposite?: import('csstype').Property.MaskComposite | undefined;
			maskImage?: import('csstype').Property.MaskImage | undefined;
			maskMode?: import('csstype').Property.MaskMode | undefined;
			maskOrigin?: import('csstype').Property.MaskOrigin | undefined;
			maskPosition?: import('csstype').Property.MaskPosition<string | number> | undefined;
			maskRepeat?: import('csstype').Property.MaskRepeat | undefined;
			maskSize?: import('csstype').Property.MaskSize<string | number> | undefined;
			maskType?: import('csstype').Property.MaskType | undefined;
			mathStyle?: import('csstype').Property.MathStyle | undefined;
			maxBlockSize?: import('csstype').Property.MaxBlockSize<string | number> | undefined;
			maxHeight?: import('csstype').Property.MaxHeight<string | number> | undefined;
			maxInlineSize?: import('csstype').Property.MaxInlineSize<string | number> | undefined;
			maxLines?: import('csstype').Property.MaxLines | undefined;
			maxWidth?: import('csstype').Property.MaxWidth<string | number> | undefined;
			minBlockSize?: import('csstype').Property.MinBlockSize<string | number> | undefined;
			minHeight?: import('csstype').Property.MinHeight<string | number> | undefined;
			minInlineSize?: import('csstype').Property.MinInlineSize<string | number> | undefined;
			minWidth?: import('csstype').Property.MinWidth<string | number> | undefined;
			mixBlendMode?: import('csstype').Property.MixBlendMode | undefined;
			motionDistance?: import('csstype').Property.OffsetDistance<string | number> | undefined;
			motionPath?: import('csstype').Property.OffsetPath | undefined;
			motionRotation?: import('csstype').Property.OffsetRotate | undefined;
			objectFit?: import('csstype').Property.ObjectFit | undefined;
			objectPosition?: import('csstype').Property.ObjectPosition<string | number> | undefined;
			offsetAnchor?: import('csstype').Property.OffsetAnchor<string | number> | undefined;
			offsetDistance?: import('csstype').Property.OffsetDistance<string | number> | undefined;
			offsetPath?: import('csstype').Property.OffsetPath | undefined;
			offsetRotate?: import('csstype').Property.OffsetRotate | undefined;
			offsetRotation?: import('csstype').Property.OffsetRotate | undefined;
			opacity?: import('csstype').Property.Opacity | undefined;
			order?: import('csstype').Property.Order | undefined;
			orphans?: import('csstype').Property.Orphans | undefined;
			outlineColor?: import('csstype').Property.OutlineColor | undefined;
			outlineOffset?: import('csstype').Property.OutlineOffset<string | number> | undefined;
			outlineStyle?: import('csstype').Property.OutlineStyle | undefined;
			outlineWidth?: import('csstype').Property.OutlineWidth<string | number> | undefined;
			overflowAnchor?: import('csstype').Property.OverflowAnchor | undefined;
			overflowBlock?: import('csstype').Property.OverflowBlock | undefined;
			overflowClipBox?: import('csstype').Property.OverflowClipBox | undefined;
			overflowInline?: import('csstype').Property.OverflowInline | undefined;
			overflowWrap?: import('csstype').Property.OverflowWrap | undefined;
			overflowX?: import('csstype').Property.OverflowX | undefined;
			overflowY?: import('csstype').Property.OverflowY | undefined;
			overscrollBehavior?: import('csstype').Property.OverscrollBehavior | undefined;
			overscrollBehaviorBlock?: import('csstype').Property.OverscrollBehaviorBlock | undefined;
			overscrollBehaviorInline?: import('csstype').Property.OverscrollBehaviorInline | undefined;
			overscrollBehaviorX?: import('csstype').Property.OverscrollBehaviorX | undefined;
			overscrollBehaviorY?: import('csstype').Property.OverscrollBehaviorY | undefined;
			paddingBlock?: import('csstype').Property.PaddingBlock<string | number> | undefined;
			paddingBlockEnd?: import('csstype').Property.PaddingBlockEnd<string | number> | undefined;
			paddingBlockStart?: import('csstype').Property.PaddingBlockStart<string | number> | undefined;
			paddingBottom?: import('csstype').Property.PaddingBottom<string | number> | undefined;
			paddingInline?: import('csstype').Property.PaddingInline<string | number> | undefined;
			paddingInlineEnd?: import('csstype').Property.PaddingInlineEnd<string | number> | undefined;
			paddingInlineStart?: import('csstype').Property.PaddingInlineStart<string | number> | undefined;
			paddingLeft?: import('csstype').Property.PaddingLeft<string | number> | undefined;
			paddingRight?: import('csstype').Property.PaddingRight<string | number> | undefined;
			paddingTop?: import('csstype').Property.PaddingTop<string | number> | undefined;
			pageBreakAfter?: import('csstype').Property.PageBreakAfter | undefined;
			pageBreakBefore?: import('csstype').Property.PageBreakBefore | undefined;
			pageBreakInside?: import('csstype').Property.PageBreakInside | undefined;
			paintOrder?: import('csstype').Property.PaintOrder | undefined;
			perspectiveOrigin?: import('csstype').Property.PerspectiveOrigin<string | number> | undefined;
			placeContent?: import('csstype').Property.PlaceContent | undefined;
			pointerEvents?: import('csstype').Property.PointerEvents | undefined;
			position?: import('csstype').Property.Position | undefined;
			quotes?: import('csstype').Property.Quotes | undefined;
			resize?: import('csstype').Property.Resize | undefined;
			right?: import('csstype').Property.Right<string | number> | undefined;
			rowGap?: import('csstype').Property.RowGap<string | number> | undefined;
			rubyAlign?: import('csstype').Property.RubyAlign | undefined;
			rubyMerge?: import('csstype').Property.RubyMerge | undefined;
			rubyPosition?: import('csstype').Property.RubyPosition | undefined;
			scrollBehavior?: import('csstype').Property.ScrollBehavior | undefined;
			scrollMargin?: import('csstype').Property.ScrollMargin<string | number> | undefined;
			scrollMarginBlock?: import('csstype').Property.ScrollMarginBlock<string | number> | undefined;
			scrollMarginBlockEnd?: import('csstype').Property.ScrollMarginBlockEnd<string | number> | undefined;
			scrollMarginBlockStart?: import('csstype').Property.ScrollMarginBlockStart<string | number> | undefined;
			scrollMarginBottom?: import('csstype').Property.ScrollMarginBottom<string | number> | undefined;
			scrollMarginInline?: import('csstype').Property.ScrollMarginInline<string | number> | undefined;
			scrollMarginInlineEnd?: import('csstype').Property.ScrollMarginInlineEnd<string | number> | undefined;
			scrollMarginInlineStart?: import('csstype').Property.ScrollMarginInlineStart<string | number> | undefined;
			scrollMarginLeft?: import('csstype').Property.ScrollMarginLeft<string | number> | undefined;
			scrollMarginRight?: import('csstype').Property.ScrollMarginRight<string | number> | undefined;
			scrollMarginTop?: import('csstype').Property.ScrollMarginTop<string | number> | undefined;
			scrollPadding?: import('csstype').Property.ScrollPadding<string | number> | undefined;
			scrollPaddingBlock?: import('csstype').Property.ScrollPaddingBlock<string | number> | undefined;
			scrollPaddingBlockEnd?: import('csstype').Property.ScrollPaddingBlockEnd<string | number> | undefined;
			scrollPaddingBlockStart?: import('csstype').Property.ScrollPaddingBlockStart<string | number> | undefined;
			scrollPaddingBottom?: import('csstype').Property.ScrollPaddingBottom<string | number> | undefined;
			scrollPaddingInline?: import('csstype').Property.ScrollPaddingInline<string | number> | undefined;
			scrollPaddingInlineEnd?: import('csstype').Property.ScrollPaddingInlineEnd<string | number> | undefined;
			scrollPaddingInlineStart?: import('csstype').Property.ScrollPaddingInlineStart<string | number> | undefined;
			scrollPaddingLeft?: import('csstype').Property.ScrollPaddingLeft<string | number> | undefined;
			scrollPaddingRight?: import('csstype').Property.ScrollPaddingRight<string | number> | undefined;
			scrollPaddingTop?: import('csstype').Property.ScrollPaddingTop<string | number> | undefined;
			scrollSnapAlign?: import('csstype').Property.ScrollSnapAlign | undefined;
			scrollSnapMargin?: import('csstype').Property.ScrollMargin<string | number> | undefined;
			scrollSnapMarginBottom?: import('csstype').Property.ScrollMarginBottom<string | number> | undefined;
			scrollSnapMarginLeft?: import('csstype').Property.ScrollMarginLeft<string | number> | undefined;
			scrollSnapMarginRight?: import('csstype').Property.ScrollMarginRight<string | number> | undefined;
			scrollSnapMarginTop?: import('csstype').Property.ScrollMarginTop<string | number> | undefined;
			scrollSnapStop?: import('csstype').Property.ScrollSnapStop | undefined;
			scrollSnapType?: import('csstype').Property.ScrollSnapType | undefined;
			scrollbarColor?: import('csstype').Property.ScrollbarColor | undefined;
			scrollbarGutter?: import('csstype').Property.ScrollbarGutter | undefined;
			scrollbarWidth?: import('csstype').Property.ScrollbarWidth | undefined;
			shapeImageThreshold?: import('csstype').Property.ShapeImageThreshold | undefined;
			shapeMargin?: import('csstype').Property.ShapeMargin<string | number> | undefined;
			shapeOutside?: import('csstype').Property.ShapeOutside | undefined;
			tabSize?: import('csstype').Property.TabSize<string | number> | undefined;
			tableLayout?: import('csstype').Property.TableLayout | undefined;
			textAlign?: import('csstype').Property.TextAlign | undefined;
			textAlignLast?: import('csstype').Property.TextAlignLast | undefined;
			textCombineUpright?: import('csstype').Property.TextCombineUpright | undefined;
			textDecorationColor?: import('csstype').Property.TextDecorationColor | undefined;
			textDecorationLine?: import('csstype').Property.TextDecorationLine | undefined;
			textDecorationSkip?: import('csstype').Property.TextDecorationSkip | undefined;
			textDecorationSkipInk?: import('csstype').Property.TextDecorationSkipInk | undefined;
			textDecorationStyle?: import('csstype').Property.TextDecorationStyle | undefined;
			textDecorationThickness?: import('csstype').Property.TextDecorationThickness<string | number> | undefined;
			textDecorationWidth?: import('csstype').Property.TextDecorationThickness<string | number> | undefined;
			textEmphasisColor?: import('csstype').Property.TextEmphasisColor | undefined;
			textEmphasisPosition?: import('csstype').Property.TextEmphasisPosition | undefined;
			textEmphasisStyle?: import('csstype').Property.TextEmphasisStyle | undefined;
			textIndent?: import('csstype').Property.TextIndent<string | number> | undefined;
			textJustify?: import('csstype').Property.TextJustify | undefined;
			textOrientation?: import('csstype').Property.TextOrientation | undefined;
			textOverflow?: import('csstype').Property.TextOverflow | undefined;
			textRendering?: import('csstype').Property.TextRendering | undefined;
			textShadow?: import('csstype').Property.TextShadow | undefined;
			textSizeAdjust?: import('csstype').Property.TextSizeAdjust | undefined;
			textTransform?: import('csstype').Property.TextTransform | undefined;
			textUnderlineOffset?: import('csstype').Property.TextUnderlineOffset<string | number> | undefined;
			textUnderlinePosition?: import('csstype').Property.TextUnderlinePosition | undefined;
			top?: import('csstype').Property.Top<string | number> | undefined;
			touchAction?: import('csstype').Property.TouchAction | undefined;
			transform?: import('csstype').Property.Transform | undefined;
			transformBox?: import('csstype').Property.TransformBox | undefined;
			transformOrigin?: import('csstype').Property.TransformOrigin<string | number> | undefined;
			transformStyle?: import('csstype').Property.TransformStyle | undefined;
			transitionDelay?: import('csstype').Property.TransitionDelay<string & {}> | undefined;
			transitionDuration?: import('csstype').Property.TransitionDuration<string & {}> | undefined;
			transitionProperty?: import('csstype').Property.TransitionProperty | undefined;
			transitionTimingFunction?: import('csstype').Property.TransitionTimingFunction | undefined;
			translate?: import('csstype').Property.Translate<string | number> | undefined;
			unicodeBidi?: import('csstype').Property.UnicodeBidi | undefined;
			userSelect?: import('csstype').Property.UserSelect | undefined;
			verticalAlign?: import('csstype').Property.VerticalAlign<string | number> | undefined;
			visibility?: import('csstype').Property.Visibility | undefined;
			whiteSpace?: import('csstype').Property.WhiteSpace | undefined;
			widows?: import('csstype').Property.Widows | undefined;
			width?: import('csstype').Property.Width<string | number> | undefined;
			willChange?: import('csstype').Property.WillChange | undefined;
			wordBreak?: import('csstype').Property.WordBreak | undefined;
			wordSpacing?: import('csstype').Property.WordSpacing<string | number> | undefined;
			wordWrap?: import('csstype').Property.WordWrap | undefined;
			writingMode?: import('csstype').Property.WritingMode | undefined;
			zIndex?: import('csstype').Property.ZIndex | undefined;
			zoom?: import('csstype').Property.Zoom | undefined;
			all?: import('csstype').Globals | undefined;
			animation?: import('csstype').Property.Animation<string & {}> | undefined;
			background?: import('csstype').Property.Background<string | number> | undefined;
			border?: import('csstype').Property.Border<string | number> | undefined;
			borderBlock?: import('csstype').Property.BorderBlock<string | number> | undefined;
			borderBlockEnd?: import('csstype').Property.BorderBlockEnd<string | number> | undefined;
			borderBlockStart?: import('csstype').Property.BorderBlockStart<string | number> | undefined;
			borderBottom?: import('csstype').Property.BorderBottom<string | number> | undefined;
			borderColor?: import('csstype').Property.BorderColor | undefined;
			borderImage?: import('csstype').Property.BorderImage | undefined;
			borderInline?: import('csstype').Property.BorderInline<string | number> | undefined;
			borderInlineEnd?: import('csstype').Property.BorderInlineEnd<string | number> | undefined;
			borderInlineStart?: import('csstype').Property.BorderInlineStart<string | number> | undefined;
			borderLeft?: import('csstype').Property.BorderLeft<string | number> | undefined;
			borderRadius?: import('csstype').Property.BorderRadius<string | number> | undefined;
			borderRight?: import('csstype').Property.BorderRight<string | number> | undefined;
			borderStyle?: import('csstype').Property.BorderStyle | undefined;
			borderTop?: import('csstype').Property.BorderTop<string | number> | undefined;
			borderWidth?: import('csstype').Property.BorderWidth<string | number> | undefined;
			columnRule?: import('csstype').Property.ColumnRule<string | number> | undefined;
			columns?: import('csstype').Property.Columns<string | number> | undefined;
			flex?: import('csstype').Property.Flex<string | number> | undefined;
			flexFlow?: import('csstype').Property.FlexFlow | undefined;
			font?: import('csstype').Property.Font | undefined;
			gap?: import('csstype').Property.Gap<string | number> | undefined;
			grid?: import('csstype').Property.Grid | undefined;
			gridArea?: import('csstype').Property.GridArea | undefined;
			gridColumn?: import('csstype').Property.GridColumn | undefined;
			gridRow?: import('csstype').Property.GridRow | undefined;
			gridTemplate?: import('csstype').Property.GridTemplate | undefined;
			lineClamp?: import('csstype').Property.LineClamp | undefined;
			listStyle?: import('csstype').Property.ListStyle | undefined;
			margin?: import('csstype').Property.Margin<string | number> | undefined;
			mask?: import('csstype').Property.Mask<string | number> | undefined;
			maskBorder?: import('csstype').Property.MaskBorder | undefined;
			motion?: import('csstype').Property.Offset<string | number> | undefined;
			offset?: import('csstype').Property.Offset<string | number> | undefined;
			outline?: import('csstype').Property.Outline<string | number> | undefined;
			overflow?: import('csstype').Property.Overflow | undefined;
			padding?: import('csstype').Property.Padding<string | number> | undefined;
			placeItems?: import('csstype').Property.PlaceItems | undefined;
			placeSelf?: import('csstype').Property.PlaceSelf | undefined;
			textDecoration?: import('csstype').Property.TextDecoration<string | number> | undefined;
			textEmphasis?: import('csstype').Property.TextEmphasis | undefined;
			MozAnimationDelay?: import('csstype').Property.AnimationDelay<string & {}> | undefined;
			MozAnimationDirection?: import('csstype').Property.AnimationDirection | undefined;
			MozAnimationDuration?: import('csstype').Property.AnimationDuration<string & {}> | undefined;
			MozAnimationFillMode?: import('csstype').Property.AnimationFillMode | undefined;
			MozAnimationIterationCount?: import('csstype').Property.AnimationIterationCount | undefined;
			MozAnimationName?: import('csstype').Property.AnimationName | undefined;
			MozAnimationPlayState?: import('csstype').Property.AnimationPlayState | undefined;
			MozAnimationTimingFunction?: import('csstype').Property.AnimationTimingFunction | undefined;
			MozAppearance?: import('csstype').Property.MozAppearance | undefined;
			MozBackfaceVisibility?: import('csstype').Property.BackfaceVisibility | undefined;
			MozBorderBottomColors?: import('csstype').Property.MozBorderBottomColors | undefined;
			MozBorderEndColor?: import('csstype').Property.BorderInlineEndColor | undefined;
			MozBorderEndStyle?: import('csstype').Property.BorderInlineEndStyle | undefined;
			MozBorderEndWidth?: import('csstype').Property.BorderInlineEndWidth<string | number> | undefined;
			MozBorderLeftColors?: import('csstype').Property.MozBorderLeftColors | undefined;
			MozBorderRightColors?: import('csstype').Property.MozBorderRightColors | undefined;
			MozBorderStartColor?: import('csstype').Property.BorderInlineStartColor | undefined;
			MozBorderStartStyle?: import('csstype').Property.BorderInlineStartStyle | undefined;
			MozBorderTopColors?: import('csstype').Property.MozBorderTopColors | undefined;
			MozBoxSizing?: import('csstype').Property.BoxSizing | undefined;
			MozColumnCount?: import('csstype').Property.ColumnCount | undefined;
			MozColumnFill?: import('csstype').Property.ColumnFill | undefined;
			MozColumnGap?: import('csstype').Property.ColumnGap<string | number> | undefined;
			MozColumnRuleColor?: import('csstype').Property.ColumnRuleColor | undefined;
			MozColumnRuleStyle?: import('csstype').Property.ColumnRuleStyle | undefined;
			MozColumnRuleWidth?: import('csstype').Property.ColumnRuleWidth<string | number> | undefined;
			MozColumnWidth?: import('csstype').Property.ColumnWidth<string | number> | undefined;
			MozContextProperties?: import('csstype').Property.MozContextProperties | undefined;
			MozFontFeatureSettings?: import('csstype').Property.FontFeatureSettings | undefined;
			MozFontLanguageOverride?: import('csstype').Property.FontLanguageOverride | undefined;
			MozHyphens?: import('csstype').Property.Hyphens | undefined;
			MozImageRegion?: import('csstype').Property.MozImageRegion | undefined;
			MozMarginEnd?: import('csstype').Property.MarginInlineEnd<string | number> | undefined;
			MozMarginStart?: import('csstype').Property.MarginInlineStart<string | number> | undefined;
			MozOrient?: import('csstype').Property.MozOrient | undefined;
			MozOsxFontSmoothing?: import('csstype').Property.FontSmooth<string | number> | undefined;
			MozPaddingEnd?: import('csstype').Property.PaddingInlineEnd<string | number> | undefined;
			MozPaddingStart?: import('csstype').Property.PaddingInlineStart<string | number> | undefined;
			MozPerspective?: import('csstype').Property.Perspective<string | number> | undefined;
			MozPerspectiveOrigin?: import('csstype').Property.PerspectiveOrigin<string | number> | undefined;
			MozStackSizing?: import('csstype').Property.MozStackSizing | undefined;
			MozTabSize?: import('csstype').Property.TabSize<string | number> | undefined;
			MozTextBlink?: import('csstype').Property.MozTextBlink | undefined;
			MozTextSizeAdjust?: import('csstype').Property.TextSizeAdjust | undefined;
			MozTransformOrigin?: import('csstype').Property.TransformOrigin<string | number> | undefined;
			MozTransformStyle?: import('csstype').Property.TransformStyle | undefined;
			MozTransitionDelay?: import('csstype').Property.TransitionDelay<string & {}> | undefined;
			MozTransitionDuration?: import('csstype').Property.TransitionDuration<string & {}> | undefined;
			MozTransitionProperty?: import('csstype').Property.TransitionProperty | undefined;
			MozTransitionTimingFunction?: import('csstype').Property.TransitionTimingFunction | undefined;
			MozUserFocus?: import('csstype').Property.MozUserFocus | undefined;
			MozUserModify?: import('csstype').Property.MozUserModify | undefined;
			MozUserSelect?: import('csstype').Property.UserSelect | undefined;
			MozWindowDragging?: import('csstype').Property.MozWindowDragging | undefined;
			MozWindowShadow?: import('csstype').Property.MozWindowShadow | undefined;
			msAccelerator?: import('csstype').Property.MsAccelerator | undefined;
			msAlignSelf?: import('csstype').Property.AlignSelf | undefined;
			msBlockProgression?: import('csstype').Property.MsBlockProgression | undefined;
			msContentZoomChaining?: import('csstype').Property.MsContentZoomChaining | undefined;
			msContentZoomLimitMax?: import('csstype').Property.MsContentZoomLimitMax | undefined;
			msContentZoomLimitMin?: import('csstype').Property.MsContentZoomLimitMin | undefined;
			msContentZoomSnapPoints?: import('csstype').Property.MsContentZoomSnapPoints | undefined;
			msContentZoomSnapType?: import('csstype').Property.MsContentZoomSnapType | undefined;
			msContentZooming?: import('csstype').Property.MsContentZooming | undefined;
			msFilter?: import('csstype').Property.MsFilter | undefined;
			msFlexDirection?: import('csstype').Property.FlexDirection | undefined;
			msFlexPositive?: import('csstype').Property.FlexGrow | undefined;
			msFlowFrom?: import('csstype').Property.MsFlowFrom | undefined;
			msFlowInto?: import('csstype').Property.MsFlowInto | undefined;
			msGridColumns?: import('csstype').Property.MsGridColumns<string | number> | undefined;
			msGridRows?: import('csstype').Property.MsGridRows<string | number> | undefined;
			msHighContrastAdjust?: import('csstype').Property.MsHighContrastAdjust | undefined;
			msHyphenateLimitChars?: import('csstype').Property.MsHyphenateLimitChars | undefined;
			msHyphenateLimitLines?: import('csstype').Property.MsHyphenateLimitLines | undefined;
			msHyphenateLimitZone?: import('csstype').Property.MsHyphenateLimitZone<string | number> | undefined;
			msHyphens?: import('csstype').Property.Hyphens | undefined;
			msImeAlign?: import('csstype').Property.MsImeAlign | undefined;
			msJustifySelf?: import('csstype').Property.JustifySelf | undefined;
			msLineBreak?: import('csstype').Property.LineBreak | undefined;
			msOrder?: import('csstype').Property.Order | undefined;
			msOverflowStyle?: import('csstype').Property.MsOverflowStyle | undefined;
			msOverflowX?: import('csstype').Property.OverflowX | undefined;
			msOverflowY?: import('csstype').Property.OverflowY | undefined;
			msScrollChaining?: import('csstype').Property.MsScrollChaining | undefined;
			msScrollLimitXMax?: import('csstype').Property.MsScrollLimitXMax<string | number> | undefined;
			msScrollLimitXMin?: import('csstype').Property.MsScrollLimitXMin<string | number> | undefined;
			msScrollLimitYMax?: import('csstype').Property.MsScrollLimitYMax<string | number> | undefined;
			msScrollLimitYMin?: import('csstype').Property.MsScrollLimitYMin<string | number> | undefined;
			msScrollRails?: import('csstype').Property.MsScrollRails | undefined;
			msScrollSnapPointsX?: import('csstype').Property.MsScrollSnapPointsX | undefined;
			msScrollSnapPointsY?: import('csstype').Property.MsScrollSnapPointsY | undefined;
			msScrollSnapType?: import('csstype').Property.MsScrollSnapType | undefined;
			msScrollTranslation?: import('csstype').Property.MsScrollTranslation | undefined;
			msScrollbar3dlightColor?: import('csstype').Property.MsScrollbar3dlightColor | undefined;
			msScrollbarArrowColor?: import('csstype').Property.MsScrollbarArrowColor | undefined;
			msScrollbarBaseColor?: import('csstype').Property.MsScrollbarBaseColor | undefined;
			msScrollbarDarkshadowColor?: import('csstype').Property.MsScrollbarDarkshadowColor | undefined;
			msScrollbarFaceColor?: import('csstype').Property.MsScrollbarFaceColor | undefined;
			msScrollbarHighlightColor?: import('csstype').Property.MsScrollbarHighlightColor | undefined;
			msScrollbarShadowColor?: import('csstype').Property.MsScrollbarShadowColor | undefined;
			msTextAutospace?: import('csstype').Property.MsTextAutospace | undefined;
			msTextCombineHorizontal?: import('csstype').Property.TextCombineUpright | undefined;
			msTextOverflow?: import('csstype').Property.TextOverflow | undefined;
			msTouchAction?: import('csstype').Property.TouchAction | undefined;
			msTouchSelect?: import('csstype').Property.MsTouchSelect | undefined;
			msTransform?: import('csstype').Property.Transform | undefined;
			msTransformOrigin?: import('csstype').Property.TransformOrigin<string | number> | undefined;
			msTransitionDelay?: import('csstype').Property.TransitionDelay<string & {}> | undefined;
			msTransitionDuration?: import('csstype').Property.TransitionDuration<string & {}> | undefined;
			msTransitionProperty?: import('csstype').Property.TransitionProperty | undefined;
			msTransitionTimingFunction?: import('csstype').Property.TransitionTimingFunction | undefined;
			msUserSelect?: import('csstype').Property.MsUserSelect | undefined;
			msWordBreak?: import('csstype').Property.WordBreak | undefined;
			msWrapFlow?: import('csstype').Property.MsWrapFlow | undefined;
			msWrapMargin?: import('csstype').Property.MsWrapMargin<string | number> | undefined;
			msWrapThrough?: import('csstype').Property.MsWrapThrough | undefined;
			msWritingMode?: import('csstype').Property.WritingMode | undefined;
			WebkitAlignContent?: import('csstype').Property.AlignContent | undefined;
			WebkitAlignItems?: import('csstype').Property.AlignItems | undefined;
			WebkitAlignSelf?: import('csstype').Property.AlignSelf | undefined;
			WebkitAnimationDelay?: import('csstype').Property.AnimationDelay<string & {}> | undefined;
			WebkitAnimationDirection?: import('csstype').Property.AnimationDirection | undefined;
			WebkitAnimationDuration?: import('csstype').Property.AnimationDuration<string & {}> | undefined;
			WebkitAnimationFillMode?: import('csstype').Property.AnimationFillMode | undefined;
			WebkitAnimationIterationCount?: import('csstype').Property.AnimationIterationCount | undefined;
			WebkitAnimationName?: import('csstype').Property.AnimationName | undefined;
			WebkitAnimationPlayState?: import('csstype').Property.AnimationPlayState | undefined;
			WebkitAnimationTimingFunction?: import('csstype').Property.AnimationTimingFunction | undefined;
			WebkitAppearance?: import('csstype').Property.WebkitAppearance | undefined;
			WebkitBackdropFilter?: import('csstype').Property.BackdropFilter | undefined;
			WebkitBackfaceVisibility?: import('csstype').Property.BackfaceVisibility | undefined;
			WebkitBackgroundClip?: import('csstype').Property.BackgroundClip | undefined;
			WebkitBackgroundOrigin?: import('csstype').Property.BackgroundOrigin | undefined;
			WebkitBackgroundSize?: import('csstype').Property.BackgroundSize<string | number> | undefined;
			WebkitBorderBeforeColor?: import('csstype').Property.WebkitBorderBeforeColor | undefined;
			WebkitBorderBeforeStyle?: import('csstype').Property.WebkitBorderBeforeStyle | undefined;
			WebkitBorderBeforeWidth?: import('csstype').Property.WebkitBorderBeforeWidth<string | number> | undefined;
			WebkitBorderBottomLeftRadius?: import('csstype').Property.BorderBottomLeftRadius<string | number> | undefined;
			WebkitBorderBottomRightRadius?: import('csstype').Property.BorderBottomRightRadius<string | number> | undefined;
			WebkitBorderImageSlice?: import('csstype').Property.BorderImageSlice | undefined;
			WebkitBorderTopLeftRadius?: import('csstype').Property.BorderTopLeftRadius<string | number> | undefined;
			WebkitBorderTopRightRadius?: import('csstype').Property.BorderTopRightRadius<string | number> | undefined;
			WebkitBoxDecorationBreak?: import('csstype').Property.BoxDecorationBreak | undefined;
			WebkitBoxReflect?: import('csstype').Property.WebkitBoxReflect<string | number> | undefined;
			WebkitBoxShadow?: import('csstype').Property.BoxShadow | undefined;
			WebkitBoxSizing?: import('csstype').Property.BoxSizing | undefined;
			WebkitClipPath?: import('csstype').Property.ClipPath | undefined;
			WebkitColumnCount?: import('csstype').Property.ColumnCount | undefined;
			WebkitColumnFill?: import('csstype').Property.ColumnFill | undefined;
			WebkitColumnGap?: import('csstype').Property.ColumnGap<string | number> | undefined;
			WebkitColumnRuleColor?: import('csstype').Property.ColumnRuleColor | undefined;
			WebkitColumnRuleStyle?: import('csstype').Property.ColumnRuleStyle | undefined;
			WebkitColumnRuleWidth?: import('csstype').Property.ColumnRuleWidth<string | number> | undefined;
			WebkitColumnSpan?: import('csstype').Property.ColumnSpan | undefined;
			WebkitColumnWidth?: import('csstype').Property.ColumnWidth<string | number> | undefined;
			WebkitFilter?: import('csstype').Property.Filter | undefined;
			WebkitFlexBasis?: import('csstype').Property.FlexBasis<string | number> | undefined;
			WebkitFlexDirection?: import('csstype').Property.FlexDirection | undefined;
			WebkitFlexGrow?: import('csstype').Property.FlexGrow | undefined;
			WebkitFlexShrink?: import('csstype').Property.FlexShrink | undefined;
			WebkitFlexWrap?: import('csstype').Property.FlexWrap | undefined;
			WebkitFontFeatureSettings?: import('csstype').Property.FontFeatureSettings | undefined;
			WebkitFontKerning?: import('csstype').Property.FontKerning | undefined;
			WebkitFontSmoothing?: import('csstype').Property.FontSmooth<string | number> | undefined;
			WebkitFontVariantLigatures?: import('csstype').Property.FontVariantLigatures | undefined;
			WebkitHyphens?: import('csstype').Property.Hyphens | undefined;
			WebkitJustifyContent?: import('csstype').Property.JustifyContent | undefined;
			WebkitLineBreak?: import('csstype').Property.LineBreak | undefined;
			WebkitLineClamp?: import('csstype').Property.WebkitLineClamp | undefined;
			WebkitMarginEnd?: import('csstype').Property.MarginInlineEnd<string | number> | undefined;
			WebkitMarginStart?: import('csstype').Property.MarginInlineStart<string | number> | undefined;
			WebkitMaskAttachment?: import('csstype').Property.WebkitMaskAttachment | undefined;
			WebkitMaskBoxImageOutset?: import('csstype').Property.MaskBorderOutset<string | number> | undefined;
			WebkitMaskBoxImageRepeat?: import('csstype').Property.MaskBorderRepeat | undefined;
			WebkitMaskBoxImageSlice?: import('csstype').Property.MaskBorderSlice | undefined;
			WebkitMaskBoxImageSource?: import('csstype').Property.MaskBorderSource | undefined;
			WebkitMaskBoxImageWidth?: import('csstype').Property.MaskBorderWidth<string | number> | undefined;
			WebkitMaskClip?: import('csstype').Property.WebkitMaskClip | undefined;
			WebkitMaskComposite?: import('csstype').Property.WebkitMaskComposite | undefined;
			WebkitMaskImage?: import('csstype').Property.WebkitMaskImage | undefined;
			WebkitMaskOrigin?: import('csstype').Property.WebkitMaskOrigin | undefined;
			WebkitMaskPosition?: import('csstype').Property.WebkitMaskPosition<string | number> | undefined;
			WebkitMaskPositionX?: import('csstype').Property.WebkitMaskPositionX<string | number> | undefined;
			WebkitMaskPositionY?: import('csstype').Property.WebkitMaskPositionY<string | number> | undefined;
			WebkitMaskRepeat?: import('csstype').Property.WebkitMaskRepeat | undefined;
			WebkitMaskRepeatX?: import('csstype').Property.WebkitMaskRepeatX | undefined;
			WebkitMaskRepeatY?: import('csstype').Property.WebkitMaskRepeatY | undefined;
			WebkitMaskSize?: import('csstype').Property.WebkitMaskSize<string | number> | undefined;
			WebkitMaxInlineSize?: import('csstype').Property.MaxInlineSize<string | number> | undefined;
			WebkitOrder?: import('csstype').Property.Order | undefined;
			WebkitOverflowScrolling?: import('csstype').Property.WebkitOverflowScrolling | undefined;
			WebkitPaddingEnd?: import('csstype').Property.PaddingInlineEnd<string | number> | undefined;
			WebkitPaddingStart?: import('csstype').Property.PaddingInlineStart<string | number> | undefined;
			WebkitPerspective?: import('csstype').Property.Perspective<string | number> | undefined;
			WebkitPerspectiveOrigin?: import('csstype').Property.PerspectiveOrigin<string | number> | undefined;
			WebkitPrintColorAdjust?: import('csstype').Property.PrintColorAdjust | undefined;
			WebkitRubyPosition?: import('csstype').Property.RubyPosition | undefined;
			WebkitScrollSnapType?: import('csstype').Property.ScrollSnapType | undefined;
			WebkitShapeMargin?: import('csstype').Property.ShapeMargin<string | number> | undefined;
			WebkitTapHighlightColor?: import('csstype').Property.WebkitTapHighlightColor | undefined;
			WebkitTextCombine?: import('csstype').Property.TextCombineUpright | undefined;
			WebkitTextDecorationColor?: import('csstype').Property.TextDecorationColor | undefined;
			WebkitTextDecorationLine?: import('csstype').Property.TextDecorationLine | undefined;
			WebkitTextDecorationSkip?: import('csstype').Property.TextDecorationSkip | undefined;
			WebkitTextDecorationStyle?: import('csstype').Property.TextDecorationStyle | undefined;
			WebkitTextEmphasisColor?: import('csstype').Property.TextEmphasisColor | undefined;
			WebkitTextEmphasisPosition?: import('csstype').Property.TextEmphasisPosition | undefined;
			WebkitTextEmphasisStyle?: import('csstype').Property.TextEmphasisStyle | undefined;
			WebkitTextFillColor?: import('csstype').Property.WebkitTextFillColor | undefined;
			WebkitTextOrientation?: import('csstype').Property.TextOrientation | undefined;
			WebkitTextSizeAdjust?: import('csstype').Property.TextSizeAdjust | undefined;
			WebkitTextStrokeColor?: import('csstype').Property.WebkitTextStrokeColor | undefined;
			WebkitTextStrokeWidth?: import('csstype').Property.WebkitTextStrokeWidth<string | number> | undefined;
			WebkitTextUnderlinePosition?: import('csstype').Property.TextUnderlinePosition | undefined;
			WebkitTouchCallout?: import('csstype').Property.WebkitTouchCallout | undefined;
			WebkitTransform?: import('csstype').Property.Transform | undefined;
			WebkitTransformOrigin?: import('csstype').Property.TransformOrigin<string | number> | undefined;
			WebkitTransformStyle?: import('csstype').Property.TransformStyle | undefined;
			WebkitTransitionDelay?: import('csstype').Property.TransitionDelay<string & {}> | undefined;
			WebkitTransitionDuration?: import('csstype').Property.TransitionDuration<string & {}> | undefined;
			WebkitTransitionProperty?: import('csstype').Property.TransitionProperty | undefined;
			WebkitTransitionTimingFunction?: import('csstype').Property.TransitionTimingFunction | undefined;
			WebkitUserModify?: import('csstype').Property.WebkitUserModify | undefined;
			WebkitUserSelect?: import('csstype').Property.UserSelect | undefined;
			WebkitWritingMode?: import('csstype').Property.WritingMode | undefined;
			MozAnimation?: import('csstype').Property.Animation<string & {}> | undefined;
			MozBorderImage?: import('csstype').Property.BorderImage | undefined;
			MozColumnRule?: import('csstype').Property.ColumnRule<string | number> | undefined;
			MozColumns?: import('csstype').Property.Columns<string | number> | undefined;
			MozTransition?: import('csstype').Property.Transition<string & {}> | undefined;
			msContentZoomLimit?: import('csstype').Property.MsContentZoomLimit | undefined;
			msContentZoomSnap?: import('csstype').Property.MsContentZoomSnap | undefined;
			msFlex?: import('csstype').Property.Flex<string | number> | undefined;
			msScrollLimit?: import('csstype').Property.MsScrollLimit | undefined;
			msScrollSnapX?: import('csstype').Property.MsScrollSnapX | undefined;
			msScrollSnapY?: import('csstype').Property.MsScrollSnapY | undefined;
			msTransition?: import('csstype').Property.Transition<string & {}> | undefined;
			WebkitAnimation?: import('csstype').Property.Animation<string & {}> | undefined;
			WebkitBorderBefore?: import('csstype').Property.WebkitBorderBefore<string | number> | undefined;
			WebkitBorderImage?: import('csstype').Property.BorderImage | undefined;
			WebkitBorderRadius?: import('csstype').Property.BorderRadius<string | number> | undefined;
			WebkitColumnRule?: import('csstype').Property.ColumnRule<string | number> | undefined;
			WebkitColumns?: import('csstype').Property.Columns<string | number> | undefined;
			WebkitFlex?: import('csstype').Property.Flex<string | number> | undefined;
			WebkitFlexFlow?: import('csstype').Property.FlexFlow | undefined;
			WebkitMask?: import('csstype').Property.WebkitMask<string | number> | undefined;
			WebkitMaskBoxImage?: import('csstype').Property.MaskBorder | undefined;
			WebkitTextEmphasis?: import('csstype').Property.TextEmphasis | undefined;
			WebkitTextStroke?: import('csstype').Property.WebkitTextStroke<string | number> | undefined;
			WebkitTransition?: import('csstype').Property.Transition<string & {}> | undefined;
			azimuth?: import('csstype').Property.Azimuth | undefined;
			boxAlign?: import('csstype').Property.BoxAlign | undefined;
			boxDirection?: import('csstype').Property.BoxDirection | undefined;
			boxFlex?: import('csstype').Property.BoxFlex | undefined;
			boxFlexGroup?: import('csstype').Property.BoxFlexGroup | undefined;
			boxLines?: import('csstype').Property.BoxLines | undefined;
			boxOrdinalGroup?: import('csstype').Property.BoxOrdinalGroup | undefined;
			boxOrient?: import('csstype').Property.BoxOrient | undefined;
			boxPack?: import('csstype').Property.BoxPack | undefined;
			clip?: import('csstype').Property.Clip | undefined;
			fontVariantAlternates?: import('csstype').Property.FontVariantAlternates | undefined;
			gridColumnGap?: import('csstype').Property.GridColumnGap<string | number> | undefined;
			gridGap?: import('csstype').Property.GridGap<string | number> | undefined;
			gridRowGap?: import('csstype').Property.GridRowGap<string | number> | undefined;
			imeMode?: import('csstype').Property.ImeMode | undefined;
			offsetBlock?: import('csstype').Property.InsetBlock<string | number> | undefined;
			offsetBlockEnd?: import('csstype').Property.InsetBlockEnd<string | number> | undefined;
			offsetBlockStart?: import('csstype').Property.InsetBlockStart<string | number> | undefined;
			offsetInline?: import('csstype').Property.InsetInline<string | number> | undefined;
			offsetInlineEnd?: import('csstype').Property.InsetInlineEnd<string | number> | undefined;
			offsetInlineStart?: import('csstype').Property.InsetInlineStart<string | number> | undefined;
			scrollSnapCoordinate?: import('csstype').Property.ScrollSnapCoordinate<string | number> | undefined;
			scrollSnapDestination?: import('csstype').Property.ScrollSnapDestination<string | number> | undefined;
			scrollSnapPointsX?: import('csstype').Property.ScrollSnapPointsX | undefined;
			scrollSnapPointsY?: import('csstype').Property.ScrollSnapPointsY | undefined;
			scrollSnapTypeX?: import('csstype').Property.ScrollSnapTypeX | undefined;
			scrollSnapTypeY?: import('csstype').Property.ScrollSnapTypeY | undefined;
			scrollbarTrackColor?: import('csstype').Property.MsScrollbarTrackColor | undefined;
			textCombineHorizontal?: import('csstype').Property.TextCombineUpright | undefined;
			KhtmlBoxAlign?: import('csstype').Property.BoxAlign | undefined;
			KhtmlBoxDirection?: import('csstype').Property.BoxDirection | undefined;
			KhtmlBoxFlex?: import('csstype').Property.BoxFlex | undefined;
			KhtmlBoxFlexGroup?: import('csstype').Property.BoxFlexGroup | undefined;
			KhtmlBoxLines?: import('csstype').Property.BoxLines | undefined;
			KhtmlBoxOrdinalGroup?: import('csstype').Property.BoxOrdinalGroup | undefined;
			KhtmlBoxOrient?: import('csstype').Property.BoxOrient | undefined;
			KhtmlBoxPack?: import('csstype').Property.BoxPack | undefined;
			KhtmlLineBreak?: import('csstype').Property.LineBreak | undefined;
			KhtmlOpacity?: import('csstype').Property.Opacity | undefined;
			KhtmlUserSelect?: import('csstype').Property.UserSelect | undefined;
			MozBackgroundClip?: import('csstype').Property.BackgroundClip | undefined;
			MozBackgroundInlinePolicy?: import('csstype').Property.BoxDecorationBreak | undefined;
			MozBackgroundOrigin?: import('csstype').Property.BackgroundOrigin | undefined;
			MozBackgroundSize?: import('csstype').Property.BackgroundSize<string | number> | undefined;
			MozBinding?: import('csstype').Property.MozBinding | undefined;
			MozBorderRadius?: import('csstype').Property.BorderRadius<string | number> | undefined;
			MozBorderRadiusBottomleft?: import('csstype').Property.BorderBottomLeftRadius<string | number> | undefined;
			MozBorderRadiusBottomright?: import('csstype').Property.BorderBottomRightRadius<string | number> | undefined;
			MozBorderRadiusTopleft?: import('csstype').Property.BorderTopLeftRadius<string | number> | undefined;
			MozBorderRadiusTopright?: import('csstype').Property.BorderTopRightRadius<string | number> | undefined;
			MozBoxAlign?: import('csstype').Property.BoxAlign | undefined;
			MozBoxDirection?: import('csstype').Property.BoxDirection | undefined;
			MozBoxFlex?: import('csstype').Property.BoxFlex | undefined;
			MozBoxOrdinalGroup?: import('csstype').Property.BoxOrdinalGroup | undefined;
			MozBoxOrient?: import('csstype').Property.BoxOrient | undefined;
			MozBoxPack?: import('csstype').Property.BoxPack | undefined;
			MozBoxShadow?: import('csstype').Property.BoxShadow | undefined;
			MozFloatEdge?: import('csstype').Property.MozFloatEdge | undefined;
			MozForceBrokenImageIcon?: import('csstype').Property.MozForceBrokenImageIcon | undefined;
			MozOpacity?: import('csstype').Property.Opacity | undefined;
			MozOutline?: import('csstype').Property.Outline<string | number> | undefined;
			MozOutlineColor?: import('csstype').Property.OutlineColor | undefined;
			MozOutlineRadius?: import('csstype').Property.MozOutlineRadius<string | number> | undefined;
			MozOutlineRadiusBottomleft?: import('csstype').Property.MozOutlineRadiusBottomleft<string | number> | undefined;
			MozOutlineRadiusBottomright?: import('csstype').Property.MozOutlineRadiusBottomright<string | number> | undefined;
			MozOutlineRadiusTopleft?: import('csstype').Property.MozOutlineRadiusTopleft<string | number> | undefined;
			MozOutlineRadiusTopright?: import('csstype').Property.MozOutlineRadiusTopright<string | number> | undefined;
			MozOutlineStyle?: import('csstype').Property.OutlineStyle | undefined;
			MozOutlineWidth?: import('csstype').Property.OutlineWidth<string | number> | undefined;
			MozTextAlignLast?: import('csstype').Property.TextAlignLast | undefined;
			MozTextDecorationColor?: import('csstype').Property.TextDecorationColor | undefined;
			MozTextDecorationLine?: import('csstype').Property.TextDecorationLine | undefined;
			MozTextDecorationStyle?: import('csstype').Property.TextDecorationStyle | undefined;
			MozUserInput?: import('csstype').Property.MozUserInput | undefined;
			msImeMode?: import('csstype').Property.ImeMode | undefined;
			msScrollbarTrackColor?: import('csstype').Property.MsScrollbarTrackColor | undefined;
			OAnimation?: import('csstype').Property.Animation<string & {}> | undefined;
			OAnimationDelay?: import('csstype').Property.AnimationDelay<string & {}> | undefined;
			OAnimationDirection?: import('csstype').Property.AnimationDirection | undefined;
			OAnimationDuration?: import('csstype').Property.AnimationDuration<string & {}> | undefined;
			OAnimationFillMode?: import('csstype').Property.AnimationFillMode | undefined;
			OAnimationIterationCount?: import('csstype').Property.AnimationIterationCount | undefined;
			OAnimationName?: import('csstype').Property.AnimationName | undefined;
			OAnimationPlayState?: import('csstype').Property.AnimationPlayState | undefined;
			OAnimationTimingFunction?: import('csstype').Property.AnimationTimingFunction | undefined;
			OBackgroundSize?: import('csstype').Property.BackgroundSize<string | number> | undefined;
			OBorderImage?: import('csstype').Property.BorderImage | undefined;
			OObjectFit?: import('csstype').Property.ObjectFit | undefined;
			OObjectPosition?: import('csstype').Property.ObjectPosition<string | number> | undefined;
			OTabSize?: import('csstype').Property.TabSize<string | number> | undefined;
			OTextOverflow?: import('csstype').Property.TextOverflow | undefined;
			OTransform?: import('csstype').Property.Transform | undefined;
			OTransformOrigin?: import('csstype').Property.TransformOrigin<string | number> | undefined;
			OTransition?: import('csstype').Property.Transition<string & {}> | undefined;
			OTransitionDelay?: import('csstype').Property.TransitionDelay<string & {}> | undefined;
			OTransitionDuration?: import('csstype').Property.TransitionDuration<string & {}> | undefined;
			OTransitionProperty?: import('csstype').Property.TransitionProperty | undefined;
			OTransitionTimingFunction?: import('csstype').Property.TransitionTimingFunction | undefined;
			WebkitBoxAlign?: import('csstype').Property.BoxAlign | undefined;
			WebkitBoxDirection?: import('csstype').Property.BoxDirection | undefined;
			WebkitBoxFlex?: import('csstype').Property.BoxFlex | undefined;
			WebkitBoxFlexGroup?: import('csstype').Property.BoxFlexGroup | undefined;
			WebkitBoxLines?: import('csstype').Property.BoxLines | undefined;
			WebkitBoxOrdinalGroup?: import('csstype').Property.BoxOrdinalGroup | undefined;
			WebkitBoxOrient?: import('csstype').Property.BoxOrient | undefined;
			WebkitBoxPack?: import('csstype').Property.BoxPack | undefined;
			WebkitScrollSnapPointsX?: import('csstype').Property.ScrollSnapPointsX | undefined;
			WebkitScrollSnapPointsY?: import('csstype').Property.ScrollSnapPointsY | undefined;
			alignmentBaseline?: import('csstype').Property.AlignmentBaseline | undefined;
			baselineShift?: import('csstype').Property.BaselineShift<string | number> | undefined;
			clipRule?: import('csstype').Property.ClipRule | undefined;
			colorInterpolation?: import('csstype').Property.ColorInterpolation | undefined;
			colorRendering?: import('csstype').Property.ColorRendering | undefined;
			dominantBaseline?: import('csstype').Property.DominantBaseline | undefined;
			fill?: import('csstype').Property.Fill | undefined;
			fillOpacity?: import('csstype').Property.FillOpacity | undefined;
			fillRule?: import('csstype').Property.FillRule | undefined;
			floodColor?: import('csstype').Property.FloodColor | undefined;
			floodOpacity?: import('csstype').Property.FloodOpacity | undefined;
			glyphOrientationVertical?: import('csstype').Property.GlyphOrientationVertical | undefined;
			lightingColor?: import('csstype').Property.LightingColor | undefined;
			marker?: import('csstype').Property.Marker | undefined;
			markerEnd?: import('csstype').Property.MarkerEnd | undefined;
			markerMid?: import('csstype').Property.MarkerMid | undefined;
			markerStart?: import('csstype').Property.MarkerStart | undefined;
			shapeRendering?: import('csstype').Property.ShapeRendering | undefined;
			stopColor?: import('csstype').Property.StopColor | undefined;
			stopOpacity?: import('csstype').Property.StopOpacity | undefined;
			stroke?: import('csstype').Property.Stroke | undefined;
			strokeDasharray?: import('csstype').Property.StrokeDasharray<string | number> | undefined;
			strokeDashoffset?: import('csstype').Property.StrokeDashoffset<string | number> | undefined;
			strokeLinecap?: import('csstype').Property.StrokeLinecap | undefined;
			strokeLinejoin?: import('csstype').Property.StrokeLinejoin | undefined;
			strokeMiterlimit?: import('csstype').Property.StrokeMiterlimit | undefined;
			strokeOpacity?: import('csstype').Property.StrokeOpacity | undefined;
			strokeWidth?: import('csstype').Property.StrokeWidth<string | number> | undefined;
			textAnchor?: import('csstype').Property.TextAnchor | undefined;
			vectorEffect?: import('csstype').Property.VectorEffect | undefined;
		} & import('svelte/elements').SVGAttributes<SVGElement> &
			import('../../motion/types').TransformProperties &
			import('../../motion/types').CustomStyles &
			import('../../motion/types').SVGPathProperties
	>;
}
