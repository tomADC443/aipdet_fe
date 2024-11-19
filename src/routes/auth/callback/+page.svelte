<script>
	import { onMount } from 'svelte';
	import { auth0 } from '../service';

	onMount(async () => {
		// Handle the redirect and extract tokens
		try {
			const result = await auth0.handleRedirectCallback();
			// Redirect user to their intended route
			window.location.replace('/app/dashboard'); // Replace with your desired route
		} catch (error) {
			console.error('Error during callback handling', error);
		}
	});
</script>
