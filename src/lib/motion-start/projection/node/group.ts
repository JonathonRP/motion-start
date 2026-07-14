/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { IProjectionNode, Measurements } from './types';

type LayoutBox = Measurements['layoutBox'];

function cloneBox(box: LayoutBox): LayoutBox {
	return {
		x: { ...box.x },
		y: { ...box.y },
	};
}

function cloneMeasurements(measurements: Measurements): Measurements {
	return {
		...measurements,
		measuredBox: cloneBox(measurements.measuredBox),
		layoutBox: cloneBox(measurements.layoutBox),
		latestValues: { ...measurements.latestValues },
	};
}

function boxesDiffer(a: LayoutBox, b: LayoutBox) {
	return (
		Math.abs(a.x.min - b.x.min) > 0.5 ||
		Math.abs(a.x.max - b.x.max) > 0.5 ||
		Math.abs(a.y.min - b.y.min) > 0.5 ||
		Math.abs(a.y.max - b.y.max) > 0.5
	);
}

function seedLateSnapshot(node: IProjectionNode<unknown>) {
	if (node.snapshot || !node.layout || !node.instance || node.root?.isUpdateBlocked()) return false;

	const instance = node.instance as Element | undefined;
	if (instance && !instance.isConnected) return false;

	const measured = node.measure(false);
	if (!boxesDiffer(measured.layoutBox, node.layout.layoutBox)) return false;

	node.snapshot = cloneMeasurements(node.layout);
	return true;
}

const notify = (node: IProjectionNode<unknown>) => {
	if (node.isLayoutDirty) return false;
	const seededSnapshot = seedLateSnapshot(node);
	node.willUpdate(false);
	return seededSnapshot || node.isLayoutDirty;
};

export interface NodeGroup {
	add: (node: IProjectionNode<unknown>) => void;
	remove: (node: IProjectionNode<unknown>) => void;
	dirty: VoidFunction;
	forEach: (cb: (node: IProjectionNode<unknown>) => void) => void;
}

export function nodeGroup(): NodeGroup {
	const nodes = new Set<IProjectionNode<unknown>>();
	const subscriptions = new WeakMap<IProjectionNode<unknown>, () => void>();

	const dirtyAll = () => {
		let hasDirtyNode = false;
		nodes.forEach((node) => {
			hasDirtyNode = notify(node) || hasDirtyNode;
		});
		return hasDirtyNode;
	};

	const dirtyAllAndUpdate = (root?: IProjectionNode<unknown>) => {
		if (dirtyAll()) {
			root?.didUpdate();
		}
	};

	return {
		add: (node) => {
			nodes.add(node);
			subscriptions.set(node, node.addEventListener('willUpdate', () => dirtyAllAndUpdate(node.root)));
		},
		remove: (node) => {
			nodes.delete(node);
			const unsubscribe = subscriptions.get(node);
			if (unsubscribe) {
				unsubscribe();
				subscriptions.delete(node);
			}
			dirtyAllAndUpdate(node.root);
		},
		dirty: () => {
			dirtyAll();
		},
		forEach: (cb) => nodes.forEach(cb),
	};
}
