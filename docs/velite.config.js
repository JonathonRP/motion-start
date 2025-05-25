import { defineConfig, s } from "velite";

const baseSchema = s.object({
	title: s.string(),
	description: s.string(),
	path: s.path(),
	content: s.markdown(),
	navLabel: s.string().optional(),
	raw: s.raw(),
	toc: s.toc(),
	section: s.enum(["Animation", "Overview", "Components", "Configuration", "Utilities"]),
});

const docSchema = baseSchema.transform((data) => {
	const cleanPath = data.path.split('/').map(part => part.replace(/^[0-9][0-9]_/, '')).join('/');
	return {
		...data,
		slug: cleanPath,
		slugFull: `/${cleanPath}`,
	};
});

export default defineConfig({
	root: "./src/content",
	collections: {
		docs: {
			name: "Doc",
			pattern: "./**/*.md",
			schema: docSchema,
		},
	},
});
