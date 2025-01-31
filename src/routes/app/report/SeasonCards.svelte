<script lang="ts">
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';
	import OctagonAlert from 'lucide-svelte/icons/octagon-alert';
	import * as Card from '$lib/components/ui/card/index';
	import Chart from '$lib/components/chart/Chart.svelte';
	import type { ChartConfiguration } from 'chart.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import type { DashboardFetchData } from './types';
	import { authenticatedBackendFetch, getErrorCodeText } from '../utils';
	import toast from 'svelte-french-toast';
	import { onMount } from 'svelte';
	import type { SeasonAnalysisData } from './types';

	export let taskId: string;

	function getNdviSeasonDataChartConfig(labels: string[], data: number[]): ChartConfiguration {
		return {
			type: 'bar',
			data: {
				labels: labels,
				datasets: [
					{
						label: 'Monthly Average Biomass Coverage',
						data: data,
						fill: true,
						backgroundColor: '#4CAF50'
					}
				]
			},
			options: {
				responsive: true
			}
		};
	}
	let seasonAnalysis: DashboardFetchData<SeasonAnalysisData> = {
		status: 'loading',
		data: null
	};
	onMount(async () => {
		seasonAnalysis = await authenticatedBackendFetch<SeasonAnalysisData>(
			`report/season-analysis?taskId=${taskId}`,
			'GET'
		);
		if (seasonAnalysis.status === 'error') {
			toast.error(`Heatmap: ${getErrorCodeText(seasonAnalysis.errorCode)}`);
		}
	});
</script>

<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
	<!-- Season Graph -->
	<Card.Root class="flex flex-1 flex-col col-span-2 justify-between">
		<Card.Header>
			<Card.Title>Seasons Graph</Card.Title>
		</Card.Header>
		<Card.Content class="min-h-72 text-4xl font-bold">
			{#if seasonAnalysis.status === 'loading'}
				<LoaderCircle class="animate-spin" />
			{:else if seasonAnalysis.data && seasonAnalysis.status === 'success'}
				<Chart
					chartData={getNdviSeasonDataChartConfig(
						seasonAnalysis.data.monthly_average.month,
						seasonAnalysis.data.monthly_average.values
					)}
				/>
			{:else}
				<OctagonAlert />
			{/if}
		</Card.Content>
		<Card.Content class="text-muted-foreground text-xs">
			This chart visualizes the mean monthly green biomass coverage (NDVI scoring), indicating the
			average vegetation activity for each month across the observation period. The aggregation of
			NDVI measurements eliminates irregularities caused by annual variations, providing a clear
			depiction of long-term monthly vegetation trends.
		</Card.Content>
	</Card.Root>
	<!-- Season Text -->
	<Card.Root class="flex flex-1 flex-col col-span-2 justify-between">
		<Card.Header>
			<Card.Title>Season Recognition</Card.Title>
		</Card.Header>
		<Card.Content class="min-h-72 text-4xl font-bold">
			{#if seasonAnalysis.status === 'loading'}
				<LoaderCircle class="animate-spin" />
			{:else if seasonAnalysis.data && seasonAnalysis.status === 'success'}
				<div class="text-4xl">
					<span class="text-2xl text-muted-foreground">Recognized Seasons:</span>
					<Separator class="my-4"></Separator>
					<div class="font-bold align-middle">
						{#each seasonAnalysis.data.seasons as season, index}
							<span class="text-center">
								{season.season_start_description}
								-
								{season.season_end_description}
							</span>
						{/each}
					</div>
				</div>
			{:else}
				<OctagonAlert />
			{/if}
		</Card.Content>
		<Card.Content class="text-muted-foreground text-xs">
			Seasons are identified by weekly aggregated data, when vegetation activity stays above average
			for at least 6 weeks, with allowances for brief gaps. These dates provide insight into
			recurring vegetation cycles.
		</Card.Content>
	</Card.Root>
</div>
