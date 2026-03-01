/** 
based on framer-motion@11.11.11,
Copyright (c) 2018 Framer B.V.
*/

import type { ProgressTimeline } from '../render/dom/scroll/observe';
import { supportsScrollTimeline } from '../render/dom/scroll/supports';
import type { AnimationPlaybackControls } from './types';

type PropNames = 'time' | 'speed' | 'duration' | 'attachTimeline' | 'startTime';

export class GroupPlaybackControls implements AnimationPlaybackControls {
	animations: AnimationPlaybackControls[];

	constructor(animations: Array<AnimationPlaybackControls | undefined>) {
		this.animations = animations.filter(Boolean) as AnimationPlaybackControls[];
	}

	then(onResolve: VoidFunction, onReject?: VoidFunction) {
		return Promise.all(this.animations).then(onResolve).catch(onReject);
	}

	private getTimeValue() {
		return this.animations[0]?.time;
	}

	private getNumberValue(propName: 'speed' | 'startTime') {
		const value = this.animations[0]?.[propName];
		return value as number | null | undefined;
	}

	attachTimeline(
		timeline: ProgressTimeline,
		fallback: ((animation: AnimationPlaybackControls) => VoidFunction) | undefined
	): VoidFunction {
		const subscriptions = this.animations.map((animation) => {
			if (supportsScrollTimeline() && animation.attachTimeline) {
				return animation.attachTimeline(timeline, undefined);
			} else {
				return fallback && fallback(animation);
			}
		});

		return () => {
			subscriptions.forEach((cancel, i) => {
				cancel && cancel();
				this.animations[i].stop();
			});
		};
	}

	get time() {
		return this.getTimeValue() ?? 0;
	}

	set time(time: number) {
		for (let i = 0; i < this.animations.length; i++) {
			this.animations[i].time = time;
		}
	}

	get speed() {
		return this.getNumberValue('speed') ?? 1;
	}

	set speed(speed: number) {
		for (let i = 0; i < this.animations.length; i++) {
			this.animations[i].speed = speed;
		}
	}

	get startTime() {
		return this.getNumberValue('startTime') ?? null;
	}

	get duration() {
		let max = 0;
		for (let i = 0; i < this.animations.length; i++) {
			max = Math.max(max, this.animations[i].duration);
		}
		return max;
	}

	private runAll(methodName: keyof Omit<AnimationPlaybackControls, PropNames | 'then' | 'state'>) {
		this.animations.forEach((controls) => controls[methodName]());
	}

	play() {
		this.runAll('play');
	}

	pause() {
		this.runAll('pause');
	}

	// Bound to accomodate common `return animation.stop` pattern
	stop = () => this.runAll('stop');

	cancel() {
		this.runAll('cancel');
	}

	complete() {
		this.runAll('complete');
	}
}
