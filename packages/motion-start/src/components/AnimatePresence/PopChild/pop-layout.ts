/**
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

let styleId = 0;

interface LayoutBox {
	x: { min: number; max: number };
	y: { min: number; max: number };
}

function getOffsetLayout(node: HTMLElement, layoutBox?: LayoutBox) {
	return {
		width: layoutBox ? layoutBox.x.max - layoutBox.x.min : node.offsetWidth || 0,
		height: layoutBox ? layoutBox.y.max - layoutBox.y.min : node.offsetHeight || 0,
		top: node.offsetTop,
		left: node.offsetLeft,
	};
}

export function applyPopLayout(node: Element, nonce?: string, layoutBox?: LayoutBox) {
	if (!(node instanceof HTMLElement)) return () => undefined;

	const id = `${styleId++}`;
	const { width, height, top, left } = getOffsetLayout(node, layoutBox);
	const selector = `[data-motion-pop-id="${id}"]`;
	const style = document.createElement('style');

	if (nonce) {
		style.nonce = nonce;
	}
	style.dataset.motionPopStyle = id;

	node.dataset.motionPopId = id;
	style.textContent = `${selector} {
	position: absolute !important;
	width: ${width}px !important;
	height: ${height}px !important;
	top: ${top}px !important;
	left: ${left}px !important;
}`;

	document.head.appendChild(style);

	return () => {
		removePopLayout(node);
	};
}

export function removePopLayout(node: Element) {
	if (!(node instanceof HTMLElement)) return;
	const id = node.dataset.motionPopId;
	if (!id) return;

	for (const style of document.querySelectorAll<HTMLStyleElement>(`style[data-motion-pop-style="${id}"]`)) {
		style.remove();
	}
	delete node.dataset.motionPopId;
}
