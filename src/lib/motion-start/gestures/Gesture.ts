import { Feature } from '../motion/features/Feature';

export abstract class Gesture<T extends Element | HTMLElement = Element> extends Feature<T> {
	constructor(node: Feature<T>['node'], event: string) {
		super(node);
		this.node.current?.addEventListener(event, this);
	}

	handleEvent(event: Event) {
		// Dispatch to specific handler like onclick, onpointerdown, etc
		const handler = (this as unknown as Record<string, (e: Event) => void>)['on' + event.type];
		if (typeof handler === 'function') handler(event);
	}
}
