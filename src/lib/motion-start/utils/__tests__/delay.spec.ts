/**
 * Based on framer-motion@11.11.11
 * https://github.com/motiondivision/motion
 */

import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { delay } from '../delay';
import { MotionGlobalConfig } from '../GlobalConfig';
import { frameData, frameSteps } from '../../frameloop';

describe('delay', () => {
	beforeEach(() => {
		MotionGlobalConfig.useManualTiming = true;
		frameData.timestamp = 0;
	});

	afterEach(() => {
		MotionGlobalConfig.useManualTiming = false;
	});

	// Helper to manually advance the frame loop
	const advanceFrames = (ms: number) => {
		frameData.timestamp += ms;
		const frameInfo = { timestamp: frameData.timestamp, delta: ms, isProcessing: true };
		// Process the read step where delay schedules its callback
		frameSteps.read.process(frameInfo);
	};

	test('resolves after provided duration', async () => {
		return new Promise<void>((resolve) => {
			let called = false;
			delay(() => {
				called = true;
				resolve();
			}, 50);

			// Advance time by 30ms - should not fire
			advanceFrames(30);
			expect(called).toBe(false);

			// Advance time by another 30ms (total 60ms) - should fire
			advanceFrames(30);
			expect(called).toBe(true);
		});
	});

	test('provides overshoot duration', async () => {
		return new Promise<void>((resolve) => {
			delay((overshoot) => {
				// Overshoot is 60 - 50 = 10ms
				expect(overshoot).toBe(10);
				resolve();
			}, 50);

			// Advance past the delay
			advanceFrames(60);
		});
	});

	test("callback doesn't fire if cancelled", async () => {
		const callback = vi.fn();

		const cancelDelay = delay(callback, 10);
		cancelDelay();

		// Advance time past when it would have fired
		advanceFrames(50);

		expect(callback).not.toBeCalled();
	});
});
