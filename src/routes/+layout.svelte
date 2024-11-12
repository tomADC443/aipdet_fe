<script lang="ts">
	import '../app.pcss';
	import { writable } from 'svelte/store';

	export const isAuthenticated = writable(false);
</script>

<slot />
