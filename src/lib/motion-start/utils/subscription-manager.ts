/** 
based on framer-motion@4.1.17,
Copyright (c) 2018 Framer B.V.
*/
type GenericHandler = (...args: any) => void;
class SubscriptionManager<Handler extends GenericHandler> {
	private subscriptions: ((a?: any, b?: any, c?: any) => void)[] = [];
	add = (handler: Handler) => {
		addUniqueItem(this.subscriptions, handler);
		return () => {
			return removeItem(this.subscriptions, handler);
		};
	};
	notify = ([a, b, c]: Parameters<Handler>) => {
		var numSubscriptions = this.subscriptions.length;
		if (!numSubscriptions) return;
		if (numSubscriptions === 1) {
			/**
			 * If there's only a single handler we can just call it without invoking a loop.
			 */
			this.subscriptions[0](a, b, c);
		} else {
			for (var i = 0; i < numSubscriptions; i++) {
				/**
				 * Check whether the handler exists before firing as it's possible
				 * the subscriptions were modified during this loop running.
				 */
				var handler = this.subscriptions[i];
				handler && handler(a, b, c);
			}
		}
	};
	getSize = () => {
		return this.subscriptions.length;
	};
	clear = () => {
		this.subscriptions.length = 0;
	};
}

/** 
based on framer-motion@4.0.3,
Copyright (c) 2018 Framer B.V.
*/
import { addUniqueItem, removeItem } from './array.js';

export { SubscriptionManager };
