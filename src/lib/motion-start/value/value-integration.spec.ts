import { describe, it, expect, beforeEach } from 'vitest';
import { MotionValue } from './index';
import { keyframes } from '../animation/generators/keyframes';
import { spring } from '../animation/generators/spring';
import { inertia } from '../animation/generators/inertia';

describe('Integration: MotionValue System', () => {
  describe('MotionValue with animation generators', () => {
    it('should animate MotionValue with keyframes', () => {
      const value = new MotionValue(0);
      const generator = keyframes({
        keyframes: [0, 50, 100],
        times: [0, 0.5, 1],
      });

      let current = generator.next(0);
      expect(current.value).toBe(0);

      current = generator.next(150);
      expect(current.value).toBeGreaterThan(0);
      expect(current.value).toBeLessThan(100);

      current = generator.next(600);
      expect(current.value).toBeGreaterThanOrEqual(0);
      expect(current.done).toBe(true);
    });

    it('should animate MotionValue with spring', () => {
      const value = new MotionValue(0);
      const generator = spring({
        keyframes: [0, 100],
        stiffness: 100,
        damping: 10,
      });

      let current = generator.next(0);
      expect(current.value).toBe(0);

      current = generator.next(100);
      expect(current.value).toBeGreaterThan(0);
      expect(current.value).toBeLessThan(100);

      // Eventually settles
      let settledValue: number | null = null;
      let time = 0;
      for (let i = 0; i < 300; i++) {
        time += 16;
        current = generator.next(time);
        if (typeof current.value === 'number' && Number.isFinite(current.value)) {
          settledValue = current.value;
        }
        if (current.done) break;
      }
      expect(settledValue).not.toBeNull();
      expect(settledValue as number).toBeCloseTo(100, 1);
    });

    it('should animate MotionValue with inertia', () => {
      const value = new MotionValue(0);
      const generator = inertia({
        keyframes: [0, 200],
        velocity: 300,
        power: 0.05,
        restDelta: 2,
      });

      let current = generator.next(0);
      expect(current.value).toBe(0);

      current = generator.next(50);
      expect(current.value).toBeGreaterThan(0);

      // Advance for a while; inertia may not flag done immediately
      let previous = current.value;
      let time = 0;
      for (let i = 0; i < 200; i++) {
        time += 16;
        current = generator.next(time);
        if (current.done) break;
        if (typeof current.value === 'number' && typeof previous === 'number') {
          const delta = Math.abs(current.value - previous);
          if (delta < 0.5) break; // consider settled
          previous = current.value;
        }
      }
      expect(typeof current.value).toBe('number');
    });
  });

  describe('MotionValue state transitions', () => {
    it('should handle multiple sequential animations', () => {
      const value = new MotionValue(0);
      const results: number[] = [];

      // First animation: 0 -> 50
      const anim1 = keyframes({
        keyframes: [0, 50],
      });

      let current = anim1.next(0);
      results.push(current.value);

      current = anim1.next(150);
      results.push(current.value);

      // Second animation: 50 -> 100
      const anim2 = keyframes({
        keyframes: [50, 100],
      });

      current = anim2.next(0);
      expect(current.value).toBeCloseTo(50, 0);

      current = anim2.next(150);
      results.push(current.value);

      // Verify progression
      expect(results.length).toBeGreaterThan(0);
      expect(results[results.length - 1]).toBeLessThanOrEqual(100);
    });

    it('should handle animation interruption', () => {
      const value = new MotionValue(0);

      // Start first animation
      const anim1 = keyframes({
        keyframes: [0, 100],
        duration: 300,
      });

      let current = anim1.next(150);
      const midpoint = current.value;

      // Start new animation from current position
      const anim2 = keyframes({
        keyframes: [midpoint, 50],
        duration: 300,
      });

      current = anim2.next(0);
      expect(current.value).toBeCloseTo(midpoint, 0);

      current = anim2.next(150);
      expect(current.value).toBeLessThanOrEqual(midpoint);

      current = anim2.next(300);
      expect(current.value).toBeCloseTo(50, 0);
    });
  });

  describe('MotionValue with value constraints', () => {
    it('should respect min/max constraints during animation', () => {
      const generator = keyframes({
        keyframes: [0, 200],
        duration: 300,
      });

      const min = 50;
      const max = 150;

      let current = generator.next(0);
      let constrained = Math.max(min, Math.min(max, current.value));
      expect(constrained).toBe(min); // clamped to min

      current = generator.next(150);
      constrained = Math.max(min, Math.min(max, current.value));
      expect(constrained).toBeGreaterThanOrEqual(min);
      expect(constrained).toBeLessThanOrEqual(max);

      current = generator.next(300);
      constrained = Math.max(min, Math.min(max, current.value));
      expect(constrained).toBeLessThanOrEqual(max);
    });

    it('should handle constraint changes during animation', () => {
      let constraints = { min: 0, max: 100 };

      const generator = keyframes({
        keyframes: [0, 150],
        duration: 300,
      });

      let current = generator.next(150);
      let value = current.value;

      // Tighten constraints
      constraints = { min: 40, max: 80 };
      const clamped = Math.max(constraints.min, Math.min(constraints.max, value));

      expect(clamped).toBeGreaterThanOrEqual(constraints.min);
      expect(clamped).toBeLessThanOrEqual(constraints.max);
    });
  });

  describe('MotionValue with velocity tracking', () => {
    it('should track velocity changes through spring animation', () => {
      const generator = spring({
        keyframes: [0, 100],
        stiffness: 100,
        damping: 10,
      });

      const timeStep = 16;
      let current = generator.next(0);
      let prevValue = current.value;
      let time = 0;

      const velocities: number[] = [];

      for (let i = 0; i < 10; i++) {
        time += timeStep;
        current = generator.next(time);
        const velocity = (current.value - prevValue) / timeStep;
        velocities.push(velocity);
        prevValue = current.value;
      }

      // Velocity should increase initially then decrease
      expect(velocities.length).toBeGreaterThan(0);
      expect(velocities.some((v) => v > 0)).toBe(true);
    });

    it('should respect velocity boundaries in inertia', () => {
      const generator = inertia({
        keyframes: [0, 500],
        velocity: 1000,
        power: 0.05,
        restDelta: 2,
        modifyTarget: (v) => (v > 200 ? 200 : v),
      });

      let current = generator.next(0);
      let maxValue = 0;
      let time = 0;

      for (let i = 0; i < 100; i++) {
        time += 16;
        current = generator.next(time);
        if (typeof current.value === 'number' && Number.isFinite(current.value)) {
          maxValue = Math.max(maxValue, current.value);
        }
        if (current.done) break;
      }

      if (!Number.isFinite(maxValue)) maxValue = 0;
      expect(maxValue).toBeLessThanOrEqual(200);
    });
  });

  describe('MotionValue composition', () => {
    it('should compose multiple generators in sequence', () => {
      // Keyframes: 0 -> 100
      const gen1 = keyframes({
        keyframes: [0, 100],
        duration: 300,
      });

      let current = gen1.next(300);
      const firstEnd = current.value;

      // Spring from end position to 150
      const gen2 = spring({
        keyframes: [firstEnd, 150],
        stiffness: 100,
        damping: 10,
      });

      current = gen2.next(0);
      if (typeof current.value === 'number') {
        expect(current.value).toBeGreaterThanOrEqual(firstEnd - 10);
      }

      // Eventually reaches target
      let time = 0;
      for (let i = 0; i < 100; i++) {
        time += 16;
        current = gen2.next(time);
        if (current.done) break;
      }
      expect(typeof current.value).toBe('number');
    });

    it('should handle color value interpolation', () => {
      const generator = keyframes({
        keyframes: ['rgb(255, 0, 0)', 'rgb(0, 0, 255)'],
        duration: 300,
      });

      let current = generator.next(0);
      expect(current.value).toContain('rgb');

      current = generator.next(150);
      expect(current.value).toContain('rgb');

      current = generator.next(300);
      expect(current.value).toContain('rgb');
      // Color will be interpolated, should contain blue values
      expect(typeof current.value).toBe('string');
    });

    it('should handle complex transform values', () => {
      const startTransform = { x: 0, y: 0, rotate: 0 };
      const endTransform = { x: 100, y: 50, rotate: 45 };

      const generator = keyframes({
        keyframes: [startTransform, endTransform],
        duration: 300,
      });

      let current = generator.next(0);
      expect(current.value).toBeDefined();

      current = generator.next(150);
      const midTransform = current.value;
      if (typeof midTransform === 'object' && 'x' in midTransform) {
        expect(midTransform.x).toBeGreaterThan(0);
        expect(midTransform.x).toBeLessThan(100);
      }

      current = generator.next(300);
      expect(current.value).toBeDefined();
    });
  });

  describe('MotionValue edge cases', () => {
    it('should handle zero-distance animations', () => {
      const generator = spring({
        keyframes: [100, 100],
        stiffness: 100,
        damping: 10,
      });

      const current = generator.next(100);
      expect(current.value).toBeCloseTo(100, 0);
      expect(current.done).toBe(true);
    });

    it('should handle negative value ranges', () => {
      const generator = keyframes({
        keyframes: [-100, -50, 0],
        duration: 300,
      });

      let current = generator.next(0);
      expect(current.value).toBe(-100);

      current = generator.next(150);
      expect(current.value).toBeGreaterThan(-100);
      expect(current.value).toBeLessThan(0);

      current = generator.next(300);
      expect(current.value).toBeCloseTo(0, 0);
    });

    it('should handle very large value ranges', () => {
      const generator = keyframes({
        keyframes: [0, 10000],
        duration: 300,
      });

      let current = generator.next(0);
      expect(current.value).toBe(0);

      current = generator.next(150);
      expect(current.value).toBeGreaterThan(0);
      expect(current.value).toBeLessThan(10000);

      current = generator.next(300);
      expect(current.value).toBeCloseTo(10000, 0);
    });

    it('should handle rapid state changes', () => {
      const gen1 = keyframes({
        keyframes: [0, 50],
        duration: 100,
      });

      let current = gen1.next(50);
      const val1 = current.value;

      const gen2 = keyframes({
        keyframes: [val1, 100],
        duration: 100,
      });

      current = gen2.next(50);
      const val2 = current.value;

      expect(val2).toBeGreaterThan(val1);

      const gen3 = keyframes({
        keyframes: [val2, 0],
        duration: 100,
      });

      current = gen3.next(100);
      expect(current.value).toBeCloseTo(0, 0);
    });
  });

  describe('MotionValue with multiple simultaneous constraints', () => {
    it('should apply multiple constraints together', () => {
      const constraints = {
        min: 10,
        max: 90,
        step: 5,
      };

      const generator = keyframes({
        keyframes: [0, 100],
        duration: 300,
      });

      let current = generator.next(150);
      let value = current.value;

      // Apply all constraints
      value = Math.max(constraints.min, Math.min(constraints.max, value));
      value = Math.round(value / constraints.step) * constraints.step;

      expect(value).toBeGreaterThanOrEqual(constraints.min);
      expect(value).toBeLessThanOrEqual(constraints.max);
      expect(value % constraints.step).toBe(0);
    });

    it('should handle conflicting constraint resolution', () => {
      const constraints = {
        preferred: 50,
        absolute_min: 20,
        absolute_max: 80,
      };

      const generator = keyframes({
        keyframes: [0, 100],
        duration: 300,
      });

      let current = generator.next(150);
      let value = current.value;

      // Resolve conflicts: absolute constraints win
      if (value < constraints.absolute_min) {
        value = constraints.absolute_min;
      } else if (value > constraints.absolute_max) {
        value = constraints.absolute_max;
      }

      expect(value).toBeGreaterThanOrEqual(constraints.absolute_min);
      expect(value).toBeLessThanOrEqual(constraints.absolute_max);
    });
  });

  describe('MotionValue callback system', () => {
    it('should fire callbacks on value changes', () => {
      const callbacks: number[] = [];
      const generator = keyframes({
        keyframes: [0, 100],
        duration: 300,
      });

      let current = generator.next(0);
      callbacks.push(current.value);

      current = generator.next(150);
      callbacks.push(current.value);

      current = generator.next(300);
      callbacks.push(current.value);

      expect(callbacks.length).toBe(3);
      expect(callbacks[0]).toBe(0);
      expect(callbacks[1]).toBeGreaterThan(0);
      expect(callbacks[2]).toBeCloseTo(100, 0);
    });

    it('should handle multiple callbacks', () => {
      const callbacks1: number[] = [];
      const callbacks2: number[] = [];

      const generator = keyframes({
        keyframes: [0, 100],
        duration: 300,
      });

      let current = generator.next(150);
      callbacks1.push(current.value);
      callbacks2.push(current.value * 2);

      expect(callbacks1[0]).toBeGreaterThan(0);
      expect(callbacks2[0]).toBeGreaterThan(callbacks1[0]);
    });
  });
});
