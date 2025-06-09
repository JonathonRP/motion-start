import { Feature } from '../motion/features/Feature';

export abstract class Gesture<T extends Element | HTMLElement = Element> extends Feature<T> {
	constructor(node, event) {
		super(node);
		this.node.current?.addEventListener(event, this);
	}

	handleEvent(event) {
		this['on' + event.type](event);
	}
}
