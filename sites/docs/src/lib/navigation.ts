import { defineNavigation } from '@svecodocs/kit';
import { getAllDocs } from './utils.js';

const allDocs = getAllDocs();

/** Docs are ordered by their `NN_` filename prefix, which velite strips from the slug. */
function section(name: string) {
	return allDocs
		.filter((doc) => doc.section === name)
		.map((doc) => ({
			title: doc.navLabel ?? doc.title,
			href: `/docs/${doc.slug}`,
		}));
}

/**
 * The design has no icon anchor block — every entry sits under a section
 * heading, starting with "Getting Started". Its two pages have no `NN_`
 * prefix to sort by, so they're listed explicitly to guarantee the order.
 */
export const navigation = defineNavigation({
	sections: [
		{
			title: 'Getting Started',
			items: [
				{ title: 'Introduction', href: '/docs' },
				{ title: 'Installation', href: '/docs/getting-started' },
				{ title: 'Examples', href: '/docs/examples' },
			],
		},
		{
			title: 'Animation',
			items: section('Animation'),
		},
		{
			title: 'Components',
			items: section('Components'),
		},
		{
			title: 'Motion values',
			items: section('Motion values'),
		},
	],
});

/**
 * Every doc href, flattened in the order it appears in the sidebar.
 *
 * The page transition slides along this axis: navigating down the sidebar
 * brings the next page in from the right, navigating up brings it in from the
 * left, so the motion agrees with the direction the reader just moved.
 */
export const docsOrder: string[] = (navigation.sections ?? []).flatMap((s) =>
	(s.items ?? []).map((item) => item.href).filter((href): href is string => Boolean(href))
);

/**
 * Which way a move between two paths runs: 1 forward (down the sidebar), -1
 * back. Anything not in the sidebar - a deep link, or the landing page -
 * counts as forward, which is also the direction a first visit arrives from.
 */
export function navDirection(from: string | undefined, to: string): 1 | -1 {
	if (!from) return 1;
	const a = docsOrder.indexOf(from.replace(/\/$/, '') || '/');
	const b = docsOrder.indexOf(to.replace(/\/$/, '') || '/');
	if (a === -1 || b === -1) return 1;
	return b < a ? -1 : 1;
}
