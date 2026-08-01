import { render } from 'svelte/server';
import AppearSsrFixture from './AppearSsrFixture.svelte';

export function GET() {
	const { body, head } = render(AppearSsrFixture);
	const html = `<!doctype html><html><head>${head}</head><body>${body}</body></html>`;

	return new Response(html, {
		headers: { 'content-type': 'text/html; charset=utf-8' },
	});
}
