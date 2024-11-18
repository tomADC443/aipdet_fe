<script lang="ts">
	import { Button } from '$lib/components/ui/button/index';

	export let title: string;
</script>

<div class="flex items-center">
	<h1 class="text-lg font-semibold md:text-2xl">{title}</h1>
</div>
<div
	data-x-chunk-name="dashboard-02-chunk-1"
	data-x-chunk-description="An empty state showing no products with a heading, description and a call to action to add a product."
	class="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm"
>
	<div class="flex flex-col items-center gap-1 text-center">
		<h3 class="text-2xl font-bold tracking-tight">You are not logged in</h3>
		<p class="text-muted-foreground text-sm">Please login first to view this feature.</p>
		<a href="/auth"><Button class="mt-4">Log-in now</Button></a>
		<a href="/"><Button class="mt-4">Go to Homepage</Button></a>
	</div>
</div>
