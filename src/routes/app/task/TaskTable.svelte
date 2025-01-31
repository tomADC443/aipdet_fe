<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import type { Variant as BadgeVariant } from '$lib/components/ui/badge/index.js';
	import type { ButtonProps } from '$lib/components/ui/button/index.js';
	import { Button } from '../../../lib/components/ui/button';
	import { selectedTask } from '#app/stores';
	import type { Task } from '#routes/app/task/types';
	import toast from 'svelte-french-toast';
	import { TaskStatus } from '#routes/app/task/constants';
	import BanIcon from 'lucide-svelte/icons/ban';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import { onMount } from 'svelte';
	import { authenticatedBackendFetch, getErrorCodeText } from '../utils';
	import type { FetchData } from '#app/types';
	import TaskTableView from './TaskTableView.svelte';
	import OctagonAlert from 'lucide-svelte/icons/octagon-alert';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';

	let tasks: FetchData<Task[]> = {
		status: 'loading',
		data: null
	};

	onMount(async () => {
		tasks = await authenticatedBackendFetch<Task[]>(`tasks`, 'GET');
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

	async function handleDeleteClick(id: string) {
		try {
			const response = await fetch(import.meta.env.VITE_BASE_URL_API + '/api/task', {
				method: 'DELETE',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
					Connection: 'keep-alive'
				},
				body: JSON.stringify({ id })
			});

			if (response.ok) {
				if (!tasks.data) return;
				selectedTask.set(null);
				tasks.data = tasks.data.filter((task) => task.id !== id);
				toast.success('Task deleted successfully.');
				return;
			} else {
				toast.error('Failed to delete Task. Try again Later.');
				console.error('Response not ok:', response.body);
			}
		} catch (error) {
			toast.error('Failed to delete Task. Try again Later.');
			console.error('Error deleting Task:', error);
		}
	}
</script>

{#if tasks.status === 'loading'}
	<LoaderCircle class="animate-spin" />
{:else if tasks.data && tasks.status === 'success'}
	{#if tasks.data.length > 0}
		<Card.Root>
			<Card.Header class="px-7">
				<Card.Title>Your Tasks</Card.Title>
				<Card.Description>List of all of your tasks.</Card.Description>
			</Card.Header>
			<Card.Content>
				<TaskTableView {handleDeleteClick} {handleSelectClick} tasks={tasks.data}></TaskTableView>
			</Card.Content>
		</Card.Root>
	{:else}
		<div class="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
			<div class="flex flex-col items-center gap-1 text-center py-8">
				<h3 class="text-2xl font-bold tracking-tight">You Have No Tasks</h3>
				<p class="text-muted-foreground text-sm">
					You haven't created a Task yet. You can create a task or select one of the public ones to
					view Reports.
				</p>
			</div>
		</div>
	{/if}
{:else}
	<OctagonAlert />
{/if}
