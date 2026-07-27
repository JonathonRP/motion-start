import { defineNavigation } from "@svecodocs/kit";
import { getAllDocs } from "./utils.js";

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
			title: "Getting Started",
			items: [
				{ title: "Introduction", href: "/docs" },
				{ title: "Installation", href: "/docs/getting-started" },
			],
		},
		{
			title: "Animation",
			items: section("Animation"),
		},
		{
			title: "Components",
			items: section("Components"),
		},
		{
			title: "Motion values",
			items: section("Motion values"),
		},
	],
});
