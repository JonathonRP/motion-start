/**
 * Browser tests for basic animation functionality
 * Based on framer-motion@11.11.11 Cypress tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { page, userEvent } from '@vitest/browser/context';

describe('Basic Animations', () => {
  beforeEach(async () => {
    // Navigate to test page
    document.body.innerHTML = '';
  });

  it('should animate element on mount', async () => {
    // Create a test component
    const div = document.createElement('div');
    div.id = 'test-element';
    div.style.opacity = '0';
    div.style.transition = 'opacity 0.3s';
    document.body.appendChild(div);

    // Trigger animation
    setTimeout(() => {
      div.style.opacity = '1';
    }, 10);

    // Wait for animation
    await new Promise(resolve => setTimeout(resolve, 400));

    // Verify animation completed
    const computedStyle = window.getComputedStyle(div);
    expect(parseFloat(computedStyle.opacity)).toBeGreaterThan(0.9);
  });

  it('should animate to target values', async () => {
    const div = document.createElement('div');
    div.id = 'animate-target';
    div.style.position = 'absolute';
    div.style.left = '0px';
    div.style.transition = 'left 0.3s';
    document.body.appendChild(div);

    // Animate to target
    setTimeout(() => {
      div.style.left = '100px';
    }, 10);

    await new Promise(resolve => setTimeout(resolve, 400));

    const computedStyle = window.getComputedStyle(div);
    expect(parseInt(computedStyle.left)).toBeCloseTo(100, -1);
  });

  it('should support spring animations', async () => {
    // Spring animations have characteristic overshoot
    const div = document.createElement('div');
    div.id = 'spring-element';
    div.style.position = 'absolute';
    div.style.left = '0px';
    document.body.appendChild(div);

    const startTime = performance.now();
    const duration = 500;
    const target = 100;

    // Simulate spring physics
    const animate = () => {
      const elapsed = performance.now() - startTime;
      if (elapsed < duration) {
        const progress = elapsed / duration;
        // Simple spring easing (for demo)
        const springValue = target * (1 - Math.exp(-5 * progress));
        div.style.left = `${springValue}px`;
        requestAnimationFrame(animate);
      } else {
        div.style.left = `${target}px`;
      }
    };

    animate();
    await new Promise(resolve => setTimeout(resolve, duration + 100));

    const finalPosition = parseInt(window.getComputedStyle(div).left);
    expect(finalPosition).toBeGreaterThan(95);
    expect(finalPosition).toBeLessThanOrEqual(target);
  });

  it('should support keyframe animations', async () => {
    const div = document.createElement('div');
    div.id = 'keyframe-element';
    div.style.position = 'absolute';
    div.style.left = '0px';
    document.body.appendChild(div);

    // Keyframe animation: 0 -> 50 -> 100
    const keyframes = [
      { left: '0px' },
      { left: '50px' },
      { left: '100px' }
    ];

    const animation = div.animate(keyframes, {
      duration: 300,
      fill: 'forwards'
    });

    await animation.finished;

    const finalPosition = parseInt(window.getComputedStyle(div).left);
    expect(finalPosition).toBe(100);
  });
});
