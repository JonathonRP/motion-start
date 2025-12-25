/**
 * Browser tests for layout animations
 * Based on framer-motion@11.11.11 Cypress tests
 */

import { describe, it, expect, beforeEach } from 'vitest';

describe('Layout Animations', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('should animate layout changes', async () => {
    const element = document.createElement('div');
    element.id = 'layout-element';
    element.style.width = '100px';
    element.style.height = '100px';
    element.style.transition = 'all 0.3s';
    element.style.position = 'relative';
    document.body.appendChild(element);

    const initialWidth = element.offsetWidth;
    expect(initialWidth).toBe(100);

    // Trigger layout change
    element.style.width = '200px';
    element.style.height = '200px';

    await new Promise(resolve => setTimeout(resolve, 400));

    const finalWidth = element.offsetWidth;
    const finalHeight = element.offsetHeight;

    expect(finalWidth).toBe(200);
    expect(finalHeight).toBe(200);
  });

  it('should animate position changes', async () => {
    const element = document.createElement('div');
    element.id = 'position-element';
    element.style.position = 'absolute';
    element.style.left = '0px';
    element.style.top = '0px';
    element.style.transition = 'left 0.3s, top 0.3s';
    document.body.appendChild(element);

    // Change position
    element.style.left = '100px';
    element.style.top = '50px';

    await new Promise(resolve => setTimeout(resolve, 400));

    const computedStyle = window.getComputedStyle(element);
    expect(parseInt(computedStyle.left)).toBeCloseTo(100, -1);
    expect(parseInt(computedStyle.top)).toBeCloseTo(50, -1);
  });

  it('should handle shared layout transitions', async () => {
    const container = document.createElement('div');
    container.style.position = 'relative';
    document.body.appendChild(container);

    // Create two states of the same logical element
    const element1 = document.createElement('div');
    element1.id = 'shared-1';
    element1.style.position = 'absolute';
    element1.style.left = '0px';
    element1.style.top = '0px';
    element1.style.width = '50px';
    element1.style.height = '50px';
    element1.style.backgroundColor = 'red';
    element1.style.opacity = '1';
    element1.style.transition = 'opacity 0.3s';

    const element2 = document.createElement('div');
    element2.id = 'shared-2';
    element2.style.position = 'absolute';
    element2.style.left = '100px';
    element2.style.top = '100px';
    element2.style.width = '100px';
    element2.style.height = '100px';
    element2.style.backgroundColor = 'red';
    element2.style.opacity = '0';
    element2.style.transition = 'opacity 0.3s';

    container.appendChild(element1);
    container.appendChild(element2);

    // Transition from element1 to element2
    element1.style.opacity = '0';
    element2.style.opacity = '1';

    await new Promise(resolve => setTimeout(resolve, 400));

    const opacity1 = parseFloat(window.getComputedStyle(element1).opacity);
    const opacity2 = parseFloat(window.getComputedStyle(element2).opacity);

    expect(opacity1).toBeLessThan(0.1);
    expect(opacity2).toBeGreaterThan(0.9);
  });

  it('should maintain aspect ratio during layout animations', async () => {
    const element = document.createElement('div');
    element.id = 'aspect-ratio';
    element.style.width = '100px';
    element.style.height = '100px';
    element.style.transition = 'all 0.3s';
    document.body.appendChild(element);

    const initialRatio = element.offsetWidth / element.offsetHeight;

    // Scale proportionally
    element.style.width = '200px';
    element.style.height = '200px';

    await new Promise(resolve => setTimeout(resolve, 400));

    const finalRatio = element.offsetWidth / element.offsetHeight;

    expect(finalRatio).toBeCloseTo(initialRatio, 2);
  });

  it('should handle layout groups', async () => {
    const container = document.createElement('div');
    container.id = 'layout-group';
    container.style.display = 'flex';
    container.style.gap = '10px';
    document.body.appendChild(container);

    // Create group of elements
    const elements = Array.from({ length: 3 }, (_, i) => {
      const el = document.createElement('div');
      el.className = 'group-item';
      el.style.width = '50px';
      el.style.height = '50px';
      el.style.transition = 'all 0.3s';
      el.dataset.index = i.toString();
      return el;
    });

    elements.forEach(el => container.appendChild(el));

    // Reorder elements
    const firstElement = elements[0];
    container.removeChild(firstElement);
    container.appendChild(firstElement);

    await new Promise(resolve => setTimeout(resolve, 400));

    const items = Array.from(container.querySelectorAll<HTMLElement>('.group-item'));
    expect(items[items.length - 1]?.dataset.index).toBe('0');
  });

  it('should animate border radius changes', async () => {
    const element = document.createElement('div');
    element.style.width = '100px';
    element.style.height = '100px';
    element.style.borderRadius = '0px';
    element.style.transition = 'border-radius 0.3s';
    element.style.backgroundColor = 'blue';
    document.body.appendChild(element);

    element.style.borderRadius = '50px';

    await new Promise(resolve => setTimeout(resolve, 400));

    const borderRadius = window.getComputedStyle(element).borderRadius;
    expect(borderRadius).toBe('50px');
  });
});
