<script>
	import { Separator } from '$lib/components/ui/separator';
	import CreateTask from '$lib/components/forms/CreateTask.svelte';
</script>

<div class="hidden space-y-6 p-10 pb-16 md:block">
	<div class="space-y-0.5">
		<h2 class="text-2xl font-bold tracking-tight">Add a new Task</h2>
		<p class="text-muted-foreground">
			Add a new Tasks. Public Tasks will be visible to other Users. Be aware that a public Task will
			make the selected AOI data public as well. <br />
			Be advised that tasks can take up to 5hrs to be processed.
		</p>
	</div>
	<Separator class="my-6" />
	<div class="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
		<CreateTask />
	</div>
</div>
