<script lang="ts">
	import { Button } from '$lib/components/ui/button/index';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';
	import OctagonAlert from 'lucide-svelte/icons/octagon-alert';
	import * as Card from '$lib/components/ui/card/index';
	import Chart from '$lib/components/chart/Chart.svelte';
	import type { ChartConfiguration } from 'chart.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import type { DashboardFetchData } from './types';

	export let ndviSeason: DashboardFetchData;

	function getGrowthRateLineChartConfig(labels: string[], data: number[]): ChartConfiguration {
		return {
			type: 'line',
			data: {
				labels: labels,
				datasets: [
					{
						label: 'Average Year Growth Rates in Calendar Weeks',
						data: data,
						fill: false,
						backgroundColor: '#4CAF50'
					}
				]
			},
			options: {
				responsive: true
			}
		};
	}
</script>

<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
	<!-- Season Graph -->
	<Card.Root class="flex flex-1 flex-col col-span-3 justify-between">
		<Card.Header>
			<Card.Title>Seasons Graph</Card.Title>
		</Card.Header>
		<Card.Content class="min-h-72 w-full text-4xl font-bold">
			{#if ndviSeason.status === 'loading'}
				<LoaderCircle class="animate-spin" />
			{:else if ndviSeason.status === 'error'}
				<OctagonAlert />
			{:else}
				<Chart
					chartData={getGrowthRateLineChartConfig(
						ndviSeason.data.growthRates.weekly_changes.weeks,
						ndviSeason.data.growthRates.weekly_changes.values
					)}
				/>
			{/if}
		</Card.Content>
		<Card.Content class="text-muted-foreground text-xs">SOME text here</Card.Content>
	</Card.Root>
	<!-- Season Text -->
	<Card.Root class="flex flex-1 flex-col col-span-1 justify-between">
		<Card.Header>
			<Card.Title>Season Recognition</Card.Title>
		</Card.Header>
		<Card.Content class="min-h-72 w-full text-4xl font-bold">
			{#if ndviSeason.status === 'loading'}
				<LoaderCircle class="animate-spin" />
			{:else if ndviSeason.status === 'error'}
				<OctagonAlert />
			{:else}
				<div class="text-4xl">
					<span class="text-2xl text-muted-foreground">Recognized Seasons:</span>
					<Separator class="my-4"></Separator>
					<div class="font-bold align-middle">
						{#each ndviSeason.data.seasons as season, index}
							<span class="text-center">
								{season.season_start_description}
								-
								{season.season_end_description}
							</span>
						{/each}
					</div>
				</div>
			{/if}
		</Card.Content>
		<Card.Content class="text-muted-foreground text-xs">Some text here</Card.Content>
	</Card.Root>
</div>
