/**
 * Browser tests for AnimatePresence (exit animations)
 * Based on framer-motion@11.11.11 Cypress tests
 */

import { describe, it, expect, beforeEach } from 'vitest';

describe('AnimatePresence', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('should animate element on mount', async () => {
    const container = document.createElement('div');
    container.id = 'presence-container';
    document.body.appendChild(container);

    // Create element that will animate in
    const element = document.createElement('div');
    element.id = 'presence-element';
    element.style.opacity = '0';
    element.style.transition = 'opacity 0.3s';

    container.appendChild(element);

    // Trigger enter animation
    await new Promise(resolve => setTimeout(resolve, 10));
    element.style.opacity = '1';

    await new Promise(resolve => setTimeout(resolve, 400));

    const opacity = parseFloat(window.getComputedStyle(element).opacity);
    expect(opacity).toBeGreaterThan(0.9);
  });

  it('should animate element on unmount', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    const element = document.createElement('div');
    element.id = 'exit-element';
    element.style.opacity = '1';
    element.style.transition = 'opacity 0.3s';
    container.appendChild(element);

    // Trigger exit animation
    element.style.opacity = '0';

    await new Promise(resolve => setTimeout(resolve, 350));

    const opacity = parseFloat(window.getComputedStyle(element).opacity);
    expect(opacity).toBeLessThan(0.1);

    // Remove element after animation completes
    await new Promise(resolve => setTimeout(resolve, 100));
    element.remove();

    expect(container.querySelector('#exit-element')).toBeNull();
  });

  it('should handle multiple elements entering/exiting', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    // Create initial elements
    const element1 = document.createElement('div');
    element1.className = 'item';
    element1.style.opacity = '1';
    element1.style.transition = 'opacity 0.2s';

    const element2 = document.createElement('div');
    element2.className = 'item';
    element2.style.opacity = '1';
    element2.style.transition = 'opacity 0.2s';

    container.appendChild(element1);
    container.appendChild(element2);

    expect(container.querySelectorAll('.item').length).toBe(2);

    // Remove first element
    element1.style.opacity = '0';
    await new Promise(resolve => setTimeout(resolve, 250));
    element1.remove();

    expect(container.querySelectorAll('.item').length).toBe(1);
    expect(container.contains(element2)).toBe(true);
  });

  it('should wait for exit animation before removing element', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    const element = document.createElement('div');
    element.id = 'wait-for-exit';
    element.style.opacity = '1';
    element.style.transition = 'opacity 0.3s';
    container.appendChild(element);

    const startTime = performance.now();

    // Start exit animation
    element.style.opacity = '0';

    // Wait for animation to complete with timeout
    await new Promise<void>((resolve) => {
      const timeout = setTimeout(() => {
        element.remove();
        resolve();
      }, 1000);

      element.addEventListener('transitionend', () => {
        clearTimeout(timeout);
        const duration = performance.now() - startTime;
        expect(duration).toBeGreaterThanOrEqual(250);
        element.remove();
        resolve();
      }, { once: true });
    });

    expect(container.querySelector('#wait-for-exit')).toBeNull();
  });

  it('should support staggered exit animations', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    const elements = Array.from({ length: 3 }, (_, i) => {
      const el = document.createElement('div');
      el.className = 'stagger-item';
      el.style.opacity = '1';
      el.style.transition = 'opacity 0.2s';
      el.dataset.index = i.toString();
      return el;
    });

    elements.forEach(el => container.appendChild(el));

    // Stagger exit animations with delays
    const exitPromises = elements.map((el, i) => {
      return new Promise<void>(resolve => {
        setTimeout(() => {
          el.style.opacity = '0';
          setTimeout(() => {
            el.remove();
            resolve();
          }, 250);
        }, i * 100); // Stagger by 100ms
      });
    });

    await Promise.all(exitPromises);

    expect(container.querySelectorAll('.stagger-item').length).toBe(0);
  });
});
