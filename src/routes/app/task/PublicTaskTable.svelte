<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { Button } from '../../../lib/components/ui/button';
	import { selectedTask } from '#app/stores';
	import type { Task } from '#routes/app/task/types';
	import toast from 'svelte-french-toast';
	import { onMount } from 'svelte';
	import { authenticatedBackendFetch, getErrorCodeText } from '../utils';
	import type { FetchData } from '#app/types';
	import PublicTaskTableView from './PublicTaskTableView.svelte';
	import OctagonAlert from 'lucide-svelte/icons/octagon-alert';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';

	let tasks: FetchData<Task[]> = {
		status: 'loading',
		data: null
	};

	onMount(async () => {
		tasks = await authenticatedBackendFetch<Task[]>(`tasks/public`, 'GET');
		if (tasks.status === 'error') {
			toast.error(`Tasks: ${getErrorCodeText(tasks.errorCode)}`);
		}
	});

	function handleSelectClick(id: string) {
		if (!tasks.data) return;
		const selected_table_task = tasks.data.find((task) => task.id === id);
		if (!selected_table_task) {
			toast.error('Selected Task not found in tasks');
			return;
		}
		const taskInfo: Task = selected_table_task;
		selectedTask.set(taskInfo);
	}
</script>

{#if tasks.status === 'loading'}
	<LoaderCircle class="animate-spin" />
{:else if tasks.data && tasks.status === 'success'}
	{#if tasks.data.length > 0}
		<Card.Root>
			<Card.Header class="px-7">
				<Card.Title>Public Tasks</Card.Title>
				<Card.Description>List of all public tasks of other users.</Card.Description>
			</Card.Header>
			<Card.Content>
				<PublicTaskTableView {handleSelectClick} tasks={tasks.data}></PublicTaskTableView>
			</Card.Content>
		</Card.Root>
	{:else}
		<div class="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
			<div class="flex flex-col items-center gap-1 text-center py-8">
				<h3 class="text-2xl font-bold tracking-tight">There Are No Public Tasks</h3>
				<p class="text-muted-foreground text-sm">
					Other users have not created any public tasks yet. You can create a task and make it
					public to share it with other users.
				</p>
			</div>
		</div>
	{/if}
{:else}
	<OctagonAlert />
{/if}
