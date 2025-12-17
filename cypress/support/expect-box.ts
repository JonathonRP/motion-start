/**
 * Shared Cypress helpers for bounding box assertions.
 * Adapted to Cypress/Chai from motiondivision/motion v11.11.11 patterns.
 */

interface BoundingBox {
  top?: number;
  left?: number;
  width?: number;
  height?: number;
}

export function expectBbox(
  element: HTMLElement,
  expectedBbox: Partial<BoundingBox>,
  tolerance = 2
) {
  const bbox = element.getBoundingClientRect();
  const { top, left, width, height } = expectedBbox;

  if (top !== undefined) {
    expect(bbox.top).to.be.closeTo(top, tolerance);
  }
  if (left !== undefined) {
    expect(bbox.left).to.be.closeTo(left, tolerance);
  }
  if (width !== undefined) {
    expect(bbox.width).to.be.closeTo(width, tolerance);
  }
  if (height !== undefined) {
    expect(bbox.height).to.be.closeTo(height, tolerance);
  }
}

export function expectBox(rect: DOMRect | { width: number; height: number }) {
  return {
    to: {
      be: {
        visible() {
          expect(rect.width).to.be.greaterThan(0);
          expect(rect.height).to.be.greaterThan(0);
        },
      },
    },
  };
}
