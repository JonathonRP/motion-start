import { fileURLToPath } from "node:url";
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { docs } from "../.velite/index.js";
import removeMd from "remove-markdown";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

// Inlined from @svecodocs/kit's `cleanMarkdown`. That helper lives in
// `dist/utils.js`, which the package does not expose through its exports map,
// so importing it meant reaching into node_modules by relative path - which
// only resolved while the docs had their own non-hoisted install, and which
// disappeared entirely in @svecodocs/kit 0.5.x.
function cleanMarkdown(raw) {
	return removeMd(raw, {
		replaceLinksWithURL: true,
		gfm: true,
		useImgAltText: true,
	})
		.replaceAll("\n", " ")
		.replaceAll("\t", " ");
}

export function buildDocsSearchIndex() {
	return docs.map((doc) => ({
		title: doc.title,
		href: `/docs/${doc.slug}`,
		description: doc.description,
		content: cleanMarkdown(doc.raw),
	}));
}

const searchData = buildDocsSearchIndex();

writeFileSync(
	resolve(__dirname, "../src/routes/api/search.json/search.json"),
	JSON.stringify(searchData),
	{ flag: "w" }
);
