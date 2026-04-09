import type { Attachment } from 'svelte/attachments';
import { isMotionValue } from '../../../value/utils/is-motion-value';

function isCustomStyleProperty(key: string) {
	return key.startsWith('--') || key.includes('-');
}

export function createStyleAttachment(style: Record<string, unknown>): Attachment<HTMLElement | SVGElement> {
	const entries = Object.entries(style).filter(([, value]) => value != null && !isMotionValue(value));

	return (node) => {
		const elementStyle = node.style as CSSStyleDeclaration & Record<string, string | number>;

		for (const [key, value] of entries) {
			if (isCustomStyleProperty(key)) {
				elementStyle.setProperty(key, `${value}`);
			} else {
				elementStyle[key] = value as string | number;
			}
		}

		return () => {
			for (const [key] of entries) {
				if (isCustomStyleProperty(key)) {
					elementStyle.removeProperty(key);
				} else {
					elementStyle[key] = '';
				}
			}
		};
	};
}
