<script lang="ts">
	import TaskTable from '$lib/components/tables/TaskTable.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import type { Task } from '#app/task/types';
	import Plus from 'lucide-svelte/icons/plus';
	import toast from 'svelte-french-toast';
	import { onMount } from 'svelte';

	onMount(() => {
		fetchTasks();
	});

	let tasks: Task[] = [];
	let status: 'loading' | 'success' | 'empty' | 'error' = 'loading';
	async function fetchTasks() {
		status = 'loading';
		try {
			const response = await fetch(import.meta.env.VITE_BASE_URL_API + '/api/task', {
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

<div class="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
	<div class="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
		<!-- <div class="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8"> -->
		<div class="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
			<Card.Root>
				<Card.Header>
					<Card.Title>Tasks</Card.Title>
					<Card.Description
						>Add the name and description of the new Area Of Interest (AOI).</Card.Description
					>
					<div class="ml-auto mr-4">
						<a href="/app/task/create">
							<Button>
								<Plus class="mr-2 h-4 w-4" />
								Add Task
							</Button>
						</a>
					</div>
				</Card.Header>
				<Card.Content>
					<div class="grid gap-6"></div>
				</Card.Content>
			</Card.Root>
			<TaskTable {tasks} />
		</div>
	</div>
</div>
