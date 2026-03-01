/**
 * based on framer-motion@11.11.11,
 * Copyright (c) 2018 Framer B.V.
 */

import { describe, test, expect, beforeEach, afterEach } from "vitest";
import { isNodeOrChild } from "../utils/is-node-or-child";

// Skip in environments without DOM (e.g., Bun test runner)
const hasDom = typeof document !== "undefined";

describe.skipIf(!hasDom)("isNodeOrChild", () => {
	let container: HTMLDivElement;

	beforeEach(() => {
		// Create DOM structure:
		// <div>
		//   <div data-testid="a">
		//     <div data-testid="b" />
		//   </div>
		//   <div data-testid="c">
		//     <div data-testid="d" />
		//   </div>
		// </div>
		container = document.createElement("div");
		container.innerHTML = `
			<div data-testid="a">
				<div data-testid="b"></div>
			</div>
			<div data-testid="c">
				<div data-testid="d"></div>
			</div>
		`;
		document.body.appendChild(container);
	});

	afterEach(() => {
		document.body.removeChild(container);
	});

	const getByTestId = (testId: string): Element => {
		const element = container.querySelector(`[data-testid="${testId}"]`);
		if (!element) {
			throw new Error(`Element with data-testid="${testId}" not found`);
		}
		return element;
	};

	test("returns true when parent and child are the same element", () => {
		expect(isNodeOrChild(container, container)).toBe(true);
	});

	test("returns true when child is a descendant of parent", () => {
		expect(isNodeOrChild(getByTestId("a"), getByTestId("b"))).toBe(true);
	});

	test("returns false when child is an ancestor of parent", () => {
		expect(isNodeOrChild(getByTestId("b"), getByTestId("a"))).toBe(false);
	});

	test("returns false when elements are siblings or in different branches", () => {
		expect(isNodeOrChild(getByTestId("c"), getByTestId("a"))).toBe(false);
		expect(isNodeOrChild(getByTestId("a"), getByTestId("c"))).toBe(false);
		expect(isNodeOrChild(getByTestId("b"), getByTestId("d"))).toBe(false);
	});

	test("returns false when child is null or undefined", () => {
		expect(isNodeOrChild(getByTestId("a"), null)).toBe(false);
		expect(isNodeOrChild(getByTestId("a"), undefined)).toBe(false);
	});

	test("returns false when parent is null", () => {
		expect(isNodeOrChild(null, getByTestId("a"))).toBe(false);
	});

	test("returns true for deeply nested descendants", () => {
		const deepContainer = document.createElement("div");
		deepContainer.innerHTML = `
			<div data-testid="level1">
				<div data-testid="level2">
					<div data-testid="level3">
						<div data-testid="level4"></div>
					</div>
				</div>
			</div>
		`;
		document.body.appendChild(deepContainer);

		const level1 = deepContainer.querySelector('[data-testid="level1"]')!;
		const level4 = deepContainer.querySelector('[data-testid="level4"]')!;

		expect(isNodeOrChild(level1, level4)).toBe(true);

		document.body.removeChild(deepContainer);
	});
});
