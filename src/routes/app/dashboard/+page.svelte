<script lang="ts">
	import NotLoggedIn from '$lib/components/screens/NotLoggedIn.svelte';
	import TaskTable from '$lib/components/tables/TaskTable.svelte';
	import { isLoggedIn } from '../stores';
</script>

{#if $isLoggedIn}
	<TaskTable />
{:else}
	<NotLoggedIn title="This is your Dashboard" />
{/if}
