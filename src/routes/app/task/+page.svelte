<script lang="ts">
	import TaskTable from '$lib/components/tables/TaskTable.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import type { Task } from '#app/task/types';
	import Plus from 'lucide-svelte/icons/plus';
	import toast from 'svelte-french-toast';
	import { onMount } from 'svelte';

	import { Content } from '$lib/components/ui/accordion';

	onMount(() => {
		fetchTasks();
	});

	let tasks: Task[] = [];
	let status: 'loading' | 'success' | 'empty' | 'error' = 'loading';
	async function fetchTasks() {
		status = 'loading';
		try {
			const response = await fetch(import.meta.env.VITE_BASE_URL_API + '/api/tasks', {
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
					Connection: 'keep-alive'
				}
			});
			const data = await response.json();

			if (response.ok) {
				tasks = data;
				if (tasks.length === 0) {
					status = 'empty';
				} else {
					status = 'success';
				}
				return;
			} else {
				status = 'error';
				toast.error('Failed to get Tasks. Try again Later.');
				console.error('Response not ok:', response.body);
			}
		} catch (error) {
			status = 'error';
			toast.error('Failed to get Tasks. Try again Later.');
			console.error('Error fetching Tasks:', error);
		}
	}
</script>

<div class="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8 flex-wrap">
	<h1 class="text-lg font-semibold md:text-2xl">Tasks</h1>
	<Card.Root>
		<Card.Header>
			<div class=" flex flex-row justify-between items-center pb-6">
				<div>
					<Card.Title class="pb-2">Create a Task</Card.Title>
					<Card.Description>
						By creating a Task you initiate the process of analyzing a specified Area of Interest.
						When the Task is completed you can see the results of the Analysis in the 'Reports'
						section.
					</Card.Description>
				</div>

				<a href="/app/aoi/create">
					<Button class="w-64">
						<Plus class="mr-2 h-4 w-4" />
						Add AOI
					</Button></a
				>
			</div>
		</Card.Header>
	</Card.Root>

	<TaskTable {tasks} />
</div>
