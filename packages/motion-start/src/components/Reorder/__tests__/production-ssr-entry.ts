import { render } from 'svelte/server';
import Group from '../Group.svelte';
import ReorderProductionSsrFixture from './ReorderProductionSsrFixture.svelte';

export function renderFixture(withItem = false) {
	return render(ReorderProductionSsrFixture, { props: { withItem } }).body;
}

export function renderGroupWithoutValues() {
	return render(Group, { props: {} as never }).body;
}
