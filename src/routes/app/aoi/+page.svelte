<script lang="ts">
	import AoiTable from '$lib/components/tables/AOITable.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';

	import Plus from 'lucide-svelte/icons/plus';
</script>

<div class="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
	<div class="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
		<!-- <div class="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8"> -->
		<div class="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
			<Card.Root>
				<Card.Header>
					<Card.Title>Description</Card.Title>
					<Card.Description
						>Add the name and description of the new Area Of Interest (AOI).</Card.Description
					>
					<div class="ml-auto mr-4">
						<a href="/app/aoi/create">
							<Button>
								<Plus class="mr-2 h-4 w-4" />
								Add AOI
							</Button>
						</a>
					</div>
				</Card.Header>
				<Card.Content>
					<div class="grid gap-6"></div>
				</Card.Content>
			</Card.Root>
			<AoiTable />
		</div>
	</div>
</div>
