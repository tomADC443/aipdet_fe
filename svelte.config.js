import adapter from '@sveltejs/adapter-node';
import { sveltePreprocess } from 'svelte-preprocess';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: sveltePreprocess({
		postcss: true
	}),
	kit: {
		alias: {
			$lib: join(dirname(fileURLToPath(import.meta.url)), 'src/lib'),
			'#routes': join(dirname(fileURLToPath(import.meta.url)), 'src/routes'),
			'#app': join(dirname(fileURLToPath(import.meta.url)), 'src/routes/app')
		},
		adapter: adapter({
			// Specific node adapter options
			out: 'build',
			precompress: false,
			envPrefix: ''
		}),
		files: {
			hooks: {
				server: './hooks.server.ts'
			}
		}
	}

};

export default config;