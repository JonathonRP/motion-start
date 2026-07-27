import { defineNavigation } from "@svecodocs/kit";
import ChalkboardTeacher from "phosphor-svelte/lib/ChalkboardTeacher";
import RocketLaunch from "phosphor-svelte/lib/RocketLaunch";
import Tag from "phosphor-svelte/lib/Tag";
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

export const navigation = defineNavigation({
	anchors: [
		{
			title: "Introduction",
			href: "/docs",
			icon: ChalkboardTeacher,
		},
		{
			title: "Getting Started",
			href: "/docs/getting-started",
			icon: RocketLaunch,
		},
		{
			title: "Releases",
			href: "https://github.com/JonathonRP/motion-start/releases",
			icon: Tag,
		},
	],
	sections: [
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