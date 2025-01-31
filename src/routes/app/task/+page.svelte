<script lang="ts">
	import TaskTable from '#routes/app/task/TaskTable.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import Plus from 'lucide-svelte/icons/plus';
	import PublicTaskTable from './PublicTaskTable.svelte';
</script>

<div class="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8 flex-wrap">
	<h1 class="text-lg font-semibold md:text-2xl">Tasks</h1>
	<Card.Root>
		<Card.Header>
			<div class=" flex flex-row justify-between items-center gap-4 pb-6">
				<div>
					<Card.Title class="pb-2">Create a Task</Card.Title>
					<Card.Description>
						By creating a Task you initiate the process of analyzing a specified Area of Interest.
						When the Task is completed you can see the results of the Analysis in the 'Reports'
						section.
					</Card.Description>
				</div>

				<a href="/app/task/create">
					<Button class="w-64">
						<Plus class="mr-2 h-4 w-4" />
						Add Task
					</Button></a
				>
			</div>
		</Card.Header>
	</Card.Root>
	<h1 class="text-lg font-semibold md:text-2xl">Your Tasks</h1>
	<TaskTable />
	<h1 class="text-lg font-semibold md:text-2xl">Public Tasks of other Users</h1>
	<PublicTaskTable />

	<!-- <TaskTable tasks={publicTasks} /> -->
</div>
