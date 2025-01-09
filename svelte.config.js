import adapter from '@sveltejs/adapter-node';  // Changed from adapter-auto
import { sveltePreprocess } from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: sveltePreprocess({
		postcss: true
	}),
	kit: {
		alias: {
			$lib: '/src/lib',
			'#routes': './src/routes',
			'#app': './src/routes/app',
		},
		adapter: adapter()  // Using node adapter
	}
};

export default config;