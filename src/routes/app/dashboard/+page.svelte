<script lang="ts">
	import NotLoggedIn from '$lib/components/screens/NotLoggedIn.svelte';
	import { auth0 } from '../../auth/service';
	import { onMount } from 'svelte';

	let isUserAuthenticated: null | boolean = null;

	onMount(async () => {
		isUserAuthenticated = await auth0.isAuthenticated();
	});
</script>

{#if isUserAuthenticated}
	<h1>you are logged in</h1>
{:else}
	<NotLoggedIn title="This is your Dashboard" />
{/if}
