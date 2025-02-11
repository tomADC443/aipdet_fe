<script lang="ts">
	import { Button } from '$lib/components/ui/button/index';
	import { selectedTask } from '#app/stores';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import TaskCards from './TaskCards.svelte';
	import SeasonCards from './SeasonCards.svelte';
	import InspectorCard from './InspectorCard.svelte';
	import SpatialDistributionHeatMapCard from './SpatialDistributionHeatMapCard.svelte';
	import GrowthRatesCard from './GrowthRatesCard.svelte';
</script>

{#if $selectedTask}
	<div class="flex flex-col auto-rows-max items-start gap-4 lg:gap-8">
		<h1 class="text-lg font-semibold md:text-2xl">Reports</h1>
		<Separator />

		<h2 class="col-span-4 ext-base font-semibold md:text-2xl">General Task Information</h2>
		<p class="text-muted-foreground">All further analysis are done on the raw data of this Task.</p>
		<TaskCards selectedTask={$selectedTask} />
		<Separator />
		<h2 class="col-span-4 ext-base font-semibold md:text-2xl">Inspector</h2>
		<p class="text-muted-foreground">
			The Inspector allows to see the recognition results of each successfully processed satellite
			image by day. Click on a date to inspect the data for this day. Click on a layer button to
			show/hide a layer.
		</p>
		<InspectorCard selectedTask={$selectedTask} />
		<Separator />
		<h2 class="col-span-4 ext-base font-semibold md:text-2xl">Seasons Analysis</h2>
		<p class="text-muted-foreground">
			The Season analysis recognizes cross-year vegetational patterns
		</p>
		<SeasonCards taskId={$selectedTask.id} />
		<Separator />
		<h2 class="col-span-4 ext-base font-semibold md:text-2xl">Growth Rate Patterns</h2>
		<p class="text-muted-foreground">
			The weekly growth rate analysis reveals vegetation changes, identifying periods of rapid
			growth and decline in the observed area.
		</p>
		<GrowthRatesCard taskId={$selectedTask.id} />
		<Separator />
		<h2 class="col-span-4 ext-base font-semibold md:text-2xl">Spatial Insights</h2>
		<p class="text-muted-foreground">
			The heatmap shows the aggregated spatial distribution of Green Surface Biomass (NDVI) over the
			observation period. Each 100m x 100m cell calculates an NDVI score, representing the
			normalized ratio of observed area to green surface biomass. This score indicates the
			likelihood of any area within the cell being fully covered by vegetation at any point.
		</p>
		<SpatialDistributionHeatMapCard taskId={$selectedTask.id} />
	</div>
{:else}
	<div class="flex items-center">
		<h1 class="text-lg font-semibold md:text-2xl">Reportings</h1>
	</div>
	<div class="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
		<div class="flex flex-col items-center gap-1 text-center">
			<h3 class="text-2xl font-bold tracking-tight">You have no Task selected</h3>
			<p class="text-muted-foreground text-sm">Select a Task to view the Reports here.</p>
			<a href="/app/task"> <Button class="mt-4">Go to Tasks</Button> </a>
		</div>
	</div>
{/if}
