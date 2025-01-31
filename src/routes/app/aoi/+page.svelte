<script lang="ts">
	import AoiTable from '$lib/components/tables/AOITable.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Button } from '$lib/components/ui/button';
	import Plus from 'lucide-svelte/icons/plus';
</script>

<div class="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
	<h1 class="text-lg font-semibold md:text-2xl">Areas of Interest (AOIs)</h1>
	<Card.Root>
		<Card.Header>
			<div class="flex flex-row justify-between items-center gap-4 pb-6">
				<div>
					<Card.Title class="pb-2">Create an Area of Interest</Card.Title>
					<Card.Description
						>In order to perform tasks you first need to register your target area. You can run
						multiple tasks on the same area.</Card.Description
					>
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
	<AoiTable />
</div>
