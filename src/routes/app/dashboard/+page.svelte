<script lang="ts">
	import NotLoggedIn from '$lib/components/screens/NotLoggedIn.svelte';
	import DashboardTable from '$lib/components/tables/DashboardTable.svelte';
	import { isLoggedIn } from '../stores';
</script>

{#if $isLoggedIn}
	<DashboardTable />
{:else}
	<NotLoggedIn title="This is your Dashboard" />
{/if}
