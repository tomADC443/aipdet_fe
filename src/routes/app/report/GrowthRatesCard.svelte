<script lang="ts">
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';
	import OctagonAlert from 'lucide-svelte/icons/octagon-alert';
	import * as Card from '$lib/components/ui/card/index';
	import Chart from '$lib/components/chart/Chart.svelte';
	import type { ChartConfiguration } from 'chart.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { onMount } from 'svelte';
	import type { SeasonAnalysisData } from './types';
	import type { FetchData } from '#app/types';
	import { authenticatedBackendFetch, getErrorCodeText } from '../utils';
	import toast from 'svelte-french-toast';

	export let taskId: string;

	let growthRatesAnalysis: FetchData<SeasonAnalysisData> = {
		status: 'loading',
		data: null
	};
	onMount(async () => {
		growthRatesAnalysis = await authenticatedBackendFetch<SeasonAnalysisData>(
			`report/season-analysis?taskId=${taskId}`,
			'GET'
		);
		if (growthRatesAnalysis.status === 'error') {
			toast.error(`Heatmap: ${getErrorCodeText(growthRatesAnalysis.errorCode)}`);
		}
	});

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
			{#if growthRatesAnalysis.status === 'loading'}
				<LoaderCircle class="animate-spin" />
			{:else if growthRatesAnalysis.data && growthRatesAnalysis.status === 'success'}
				<Chart
					chartData={getGrowthRateLineChartConfig(
						growthRatesAnalysis.data.growthRates.weekly_changes.weeks.map(String),
						growthRatesAnalysis.data.growthRates.weekly_changes.values.map((item) => {
							if (item != null) {
								return Number(item);
							} else {
								return 0;
							}
						})
					)}
				/>
			{:else}
				<OctagonAlert />
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
			{#if growthRatesAnalysis.status === 'loading'}
				<LoaderCircle class="animate-spin" />
			{:else if growthRatesAnalysis.data && growthRatesAnalysis.status === 'success'}
				<div class="text-4xl">
					<span class="text-2xl text-muted-foreground">Recognized Seasons:</span>
					<Separator class="my-4"></Separator>
					<div class="font-bold align-middle">
						{#if growthRatesAnalysis.data.seasons.length > 0}
							{#each growthRatesAnalysis.data.seasons as season, index}
								<span class="text-center">
									{season.season_start_description}
									-
									{season.season_end_description}
								</span>
							{/each}
						{:else}
							<span class="text-center">No seasons recognized</span>
						{/if}
					</div>
				</div>
			{:else}
				<OctagonAlert />
			{/if}
		</Card.Content>
		<Card.Content class="text-muted-foreground text-xs">Some text here</Card.Content>
	</Card.Root>
</div>
