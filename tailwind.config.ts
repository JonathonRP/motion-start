import Typography from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';

const config: Config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px',
			},
		},
	},
	plugins: [Typography],
};

export default config;
