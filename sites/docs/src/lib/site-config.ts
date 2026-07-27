import { defineSiteConfig } from "@svecodocs/kit";

export const siteConfig = defineSiteConfig({
	name: "Motion Start",
	url: "https://motion-start.com",
	ogImage: {
		url: "https://motion-start.com/og.png",
		height: "630",
		width: "1200",
	},
	description: "Svelte animation library inspired by the React library framer-motion.",
	author: "Jonathon Reese Perry",
	keywords: ["svelte", "sveltekit", "animation", "motion", "framer-motion"],
	links: {
		github: "https://github.com/JonathonRP/motion-start",
	},
});
