<script lang="ts">
	import NotLoggedIn from '$lib/components/screens/NotLoggedIn.svelte';
	import DashboardTable from '$lib/components/tables/DashboardTable.svelte';
	import { isUserLoggedIn, updateAuthStatus } from '../stores';

	updateAuthStatus();
</script>

{#if $isUserLoggedIn}
	<DashboardTable />
{:else}
	<NotLoggedIn title="This is your Dashboard" />
{/if}
