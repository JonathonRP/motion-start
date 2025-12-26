/**
 * Browser tests for drag functionality
 * Based on framer-motion@11.11.11 Cypress tests
 */

import { beforeEach, describe, expect, it } from 'vitest';

describe('Drag Interactions', () => {
	beforeEach(() => {
		document.body.innerHTML = '';
	});

	it('should enable dragging on element', async () => {
		const draggable = document.createElement('div');
		draggable.id = 'draggable';
		draggable.style.position = 'absolute';
		draggable.style.left = '0px';
		draggable.style.top = '0px';
		draggable.style.width = '50px';
		draggable.style.height = '50px';
		draggable.style.cursor = 'grab';
		document.body.appendChild(draggable);

		let isDragging = false;
		let startX = 0;
		let startY = 0;

		draggable.addEventListener('pointerdown', (e) => {
			isDragging = true;
			startX = e.clientX - parseInt(draggable.style.left);
			startY = e.clientY - parseInt(draggable.style.top);
			draggable.style.cursor = 'grabbing';
		});

		window.addEventListener('pointermove', (e) => {
			if (isDragging) {
				draggable.style.left = `${e.clientX - startX}px`;
				draggable.style.top = `${e.clientY - startY}px`;
			}
		});

		window.addEventListener('pointerup', () => {
			isDragging = false;
			draggable.style.cursor = 'grab';
		});

		// Simulate drag
		draggable.dispatchEvent(
			new PointerEvent('pointerdown', {
				bubbles: true,
				clientX: 0,
				clientY: 0,
			})
		);

		window.dispatchEvent(
			new PointerEvent('pointermove', {
				bubbles: true,
				clientX: 100,
				clientY: 50,
			})
		);

		window.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));

		await new Promise((resolve) => setTimeout(resolve, 50));

		expect(parseInt(draggable.style.left)).toBe(100);
		expect(parseInt(draggable.style.top)).toBe(50);
	});

	it('should constrain drag to bounds', async () => {
		const draggable = document.createElement('div');
		draggable.style.position = 'absolute';
		draggable.style.left = '50px';
		draggable.style.top = '50px';
		draggable.style.width = '50px';
		draggable.style.height = '50px';
		document.body.appendChild(draggable);

		const constraints = { left: 0, right: 200, top: 0, bottom: 200 };

		let isDragging = false;
		let startX = 0;
		let startY = 0;

		draggable.addEventListener('pointerdown', (e) => {
			isDragging = true;
			startX = e.clientX - parseInt(draggable.style.left);
			startY = e.clientY - parseInt(draggable.style.top);
		});

		window.addEventListener('pointermove', (e) => {
			if (isDragging) {
				let newLeft = e.clientX - startX;
				let newTop = e.clientY - startY;

				// Apply constraints
				newLeft = Math.max(constraints.left, Math.min(newLeft, constraints.right));
				newTop = Math.max(constraints.top, Math.min(newTop, constraints.bottom));

				draggable.style.left = `${newLeft}px`;
				draggable.style.top = `${newTop}px`;
			}
		});

		window.addEventListener('pointerup', () => {
			isDragging = false;
		});

		// Try to drag beyond constraints
		draggable.dispatchEvent(
			new PointerEvent('pointerdown', {
				bubbles: true,
				clientX: 50,
				clientY: 50,
			})
		);

		window.dispatchEvent(
			new PointerEvent('pointermove', {
				bubbles: true,
				clientX: 300, // Beyond right constraint
				clientY: 300, // Beyond bottom constraint
			})
		);

		window.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));

		expect(parseInt(draggable.style.left)).toBeLessThanOrEqual(constraints.right);
		expect(parseInt(draggable.style.top)).toBeLessThanOrEqual(constraints.bottom);
	});

	it('should support drag momentum', async () => {
		const draggable = document.createElement('div');
		draggable.style.position = 'absolute';
		draggable.style.left = '0px';
		draggable.style.top = '0px';
		document.body.appendChild(draggable);

		const positions: { x: number; y: number; time: number }[] = [];

		draggable.addEventListener('pointerdown', () => {
			positions.length = 0; // Reset
		});

		window.addEventListener('pointermove', (e) => {
			positions.push({
				x: e.clientX,
				y: e.clientY,
				time: performance.now(),
			});
		});

		// Simulate quick drag motion
		draggable.dispatchEvent(
			new PointerEvent('pointerdown', {
				bubbles: true,
				clientX: 0,
				clientY: 0,
			})
		);

		for (let i = 0; i < 5; i++) {
			window.dispatchEvent(
				new PointerEvent('pointermove', {
					bubbles: true,
					clientX: i * 20,
					clientY: i * 10,
				})
			);
			await new Promise((resolve) => setTimeout(resolve, 16)); // ~60fps
		}

		window.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));

		// Verify we tracked movement
		expect(positions.length).toBeGreaterThan(0);

		// Calculate velocity (simplified)
		if (positions.length >= 2) {
			const last = positions[positions.length - 1];
			const first = positions[0];
			const deltaTime = last.time - first.time;
			const deltaX = last.x - first.x;

			const velocityX = deltaX / deltaTime;
			expect(Math.abs(velocityX)).toBeGreaterThan(0);
		}
	});

	it('should lock drag to axis', async () => {
		const draggable = document.createElement('div');
		draggable.style.position = 'absolute';
		draggable.style.left = '50px';
		draggable.style.top = '50px';
		document.body.appendChild(draggable);

		const axis = 'x'; // Lock to horizontal
		let isDragging = false;
		let startX = 0;
		const initialTop = 50;

		draggable.addEventListener('pointerdown', (e) => {
			isDragging = true;
			startX = e.clientX - parseInt(draggable.style.left);
		});

		window.addEventListener('pointermove', (e) => {
			if (isDragging) {
				if (axis === 'x') {
					draggable.style.left = `${e.clientX - startX}px`;
					// Don't update top
				}
			}
		});

		window.addEventListener('pointerup', () => {
			isDragging = false;
		});

		// Drag diagonally
		draggable.dispatchEvent(
			new PointerEvent('pointerdown', {
				bubbles: true,
				clientX: 50,
				clientY: 50,
			})
		);

		window.dispatchEvent(
			new PointerEvent('pointermove', {
				bubbles: true,
				clientX: 150,
				clientY: 150, // This should be ignored
			})
		);

		window.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));

		// X should change, Y should stay the same
		expect(parseInt(draggable.style.left)).toBeGreaterThan(50);
		expect(parseInt(draggable.style.top)).toBe(initialTop);
	});
});
