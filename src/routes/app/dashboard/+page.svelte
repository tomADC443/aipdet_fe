<script lang="ts">
	import NotLoggedIn from '$lib/components/screens/NotLoggedIn.svelte';
	import { isUserLoggedIn, updateAuthStatus } from '../stores';

	updateAuthStatus();
</script>

{#if $isUserLoggedIn}
	<h1>you are logged in</h1>
{:else}
	<NotLoggedIn title="This is your Dashboard" />
{/if}
