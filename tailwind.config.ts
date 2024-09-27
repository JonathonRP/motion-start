import type { Config } from "tailwindcss";
import Typography from '@tailwindcss/typography'
const config: Config = {
	content: ["./src/**/*.{html,js,svelte,ts}"],
	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px"
			}
		},
    },
	plugins: [
		Typography
	]
};

export default config;
