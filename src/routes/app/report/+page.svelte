<script lang="ts">
	import { Button } from '$lib/components/ui/button/index';
	import type { ChartConfiguration } from 'chart.js';
	import { onMount } from 'svelte';
	import { selectedTask } from '#app/stores';
	import toast from 'svelte-french-toast';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import TaskCards from './TaskCards.svelte';
	import SeasonCards from './SeasonCards.svelte';
	import InspectorCard from './InspectorCard.svelte';
	import SpatialDistributionHeatMapCard from './SpatialDistributionHeatMapCard.svelte';
	import GrowthRatesCard from './GrowthRatesCard.svelte';
	import { authenticatedBackendFetch } from '../utils';

	type DashboardFetchData = {
		status: 'loading' | 'error' | 'success';
		data: any | null;
	};

	let totalObservedArea: DashboardFetchData = {
		status: 'loading',
		data: null
	};
	let ndviHeatMap: DashboardFetchData = {
		status: 'loading',
		data: null
	};
	let ndviSeason: DashboardFetchData = {
		status: 'loading',
		data: null
	};
	let availableDates: DashboardFetchData = {
		status: 'loading',
		data: null
	};
	let inspectorData: DashboardFetchData = {
		status: 'success',
		data: null
	};

	async function handleDateClick(dateString: string): Promise<void> {
		if (!$selectedTask) return;
		inspectorData = {
			status: 'loading',
			data: null
		};
		inspectorData = await fetchInspectorData($selectedTask.id, dateString);
	}

	function getNdviSeasonDataChartConfig(labels: string[], data: number[]): ChartConfiguration {
		return {
			type: 'bar',
			data: {
				labels: labels,
				datasets: [
					{
						label: 'Some Data here',
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

	onMount(async () => {
		const taskId = $selectedTask?.id;
		if (taskId) {
			ndviHeatMap = await authenticatedBackendFetch<DashboardFetchData>(
				`report/spatial-analysis?taskId=${taskId}`,
				'GET'
			);
			ndviSeason = await authenticatedBackendFetch<DashboardFetchData>(
				`report/season-analysis?taskId=${taskId}`,
				'GET'
			);
			availableDates = await authenticatedBackendFetch<DashboardFetchData>(
				`report/available-dates?taskId=${taskId}`,
				'GET'
			);
		}
	});

	async function fetchNdviHeatMap(taskId: string): Promise<DashboardFetchData> {
		try {
			const response = await fetch(
				`${import.meta.env.VITE_BASE_URL_API}/api/report/spatial-analysis?taskId=${taskId}`,

				{
					method: 'GET',
					credentials: 'include',
					headers: {
						'Content-Type': 'application/json',
						Connection: 'keep-alive'
					}
				}
			);
			const data = await response.json();
			if (response.ok) {
				return {
					status: 'success',
					data: data
				};
			} else {
				throw `Response not ok ${response}`;
			}
		} catch (error) {
			console.log(error);
			toast.error('Failed to load Biomass Heatmap data. Try again Later.');
			return {
				status: 'error',
				data: null
			};
		}
	}
	async function fetchNdviSeasonData(taskId: string): Promise<DashboardFetchData> {
		try {
			const response = await fetch(
				`${import.meta.env.VITE_BASE_URL_API}/api/report/season-analysis?taskId=${taskId}`,

				{
					method: 'GET',
					credentials: 'include',
					headers: {
						'Content-Type': 'application/json',
						Connection: 'keep-alive'
					}
				}
			);
			const data = await response.json();
			if (response.ok) {
				return {
					status: 'success',
					data: data
				};
			} else {
				throw `Response not ok ${response}`;
			}
		} catch (error) {
			console.log(error);
			toast.error('Failed to load NDVI Season Data. Try again Later.');
			return {
				status: 'error',
				data: null
			};
		}
	}
	async function fetchAvailableDates(taskId: string): Promise<DashboardFetchData> {
		try {
			const response = await fetch(
				`${import.meta.env.VITE_BASE_URL_API}/api/report/available-dates?taskId=${taskId}`,

				{
					method: 'GET',
					credentials: 'include',
					headers: {
						'Content-Type': 'application/json',
						Connection: 'keep-alive'
					}
				}
			);
			const data = await response.json();
			if (response.ok) {
				return {
					status: 'success',
					data: data
				};
			} else {
				throw `Response not ok ${response}`;
			}
		} catch (error) {
			console.log(error);
			toast.error('Failed to Inspector data. Try again Later.');
			return {
				status: 'error',
				data: null
			};
		}
	}
	async function fetchInspectorData(
		taskId: string,
		dateString: string
	): Promise<DashboardFetchData> {
		try {
			const response = await fetch(
				`${import.meta.env.VITE_BASE_URL_API}/api/report/analysis-record?taskId=${taskId}&&dateString=${dateString}`,

				{
					method: 'GET',
					credentials: 'include',
					headers: {
						'Content-Type': 'application/json',
						Connection: 'keep-alive'
					}
				}
			);
			const data = await response.json();
			if (response.ok) {
				return {
					status: 'success',
					data: data
				};
			} else {
				throw `Response not ok ${response}`;
			}
		} catch (error) {
			console.log(error);
			toast.error('Failed to load Inspector data. Try again Later.');
			return {
				status: 'error',
				data: null
			};
		}
	}
</script>

{#if $selectedTask}
	<div class="flex flex-col auto-rows-max items-start gap-4 lg:gap-8">
		<h1 class="text-lg font-semibold md:text-2xl">Reports</h1>
		<Separator />

		<h2 class="col-span-4 ext-base font-semibold md:text-2xl">General Task Information</h2>
		<p class="text-muted-foreground">Here's a list of your tasks for this month!</p>
		<TaskCards taskId={$selectedTask.id} selectedTask={$selectedTask} />
		<Separator />
		<h2 class="col-span-4 ext-base font-semibold md:text-2xl">Inspector</h2>
		<p class="text-muted-foreground">Here's a list of your tasks for this month!</p>
		<InspectorCard
			selectedTask={$selectedTask}
			{handleDateClick}
			{inspectorData}
			{availableDates}
		/>
		<Separator />
		<h2 class="col-span-4 ext-base font-semibold md:text-2xl">General Task Information</h2>
		<p class="text-muted-foreground">Here's a list of your tasks for this month!</p>
		<SeasonCards {ndviSeason} />
		<Separator />
		<h2 class="col-span-4 ext-base font-semibold md:text-2xl">Growth Rate Patterns</h2>
		<p class="text-muted-foreground">Some info here</p>
		<GrowthRatesCard {ndviSeason} />
		<Separator />
		<h2 class="col-span-4 ext-base font-semibold md:text-2xl">Spatial Insights</h2>
		<p class="text-muted-foreground">
			The heatmap shows the aggregated spatial distribution of Green Surface Biomass (NDVI) over the
			observation period. Each 100m x 100m cell calculates an NDVI score, representing the
			normalized ratio of observed area to green surface biomass. This score indicates the
			likelihood of any area within the cell being fully covered by vegetation at any point.
		</p>
		<SpatialDistributionHeatMapCard {ndviHeatMap} />
	</div>
{:else}
	<div class="flex items-center">
		<h1 class="text-lg font-semibold md:text-2xl">Reportings</h1>
	</div>
	<div
		data-x-chunk-name="dashboard-02-chunk-1"
		data-x-chunk-description="An empty state showing no products with a heading, description and a call to action to add a product."
		class="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm"
	>
		<div class="flex flex-col items-center gap-1 text-center">
			<h3 class="text-2xl font-bold tracking-tight">You have no Task selected</h3>
			<p class="text-muted-foreground text-sm">Select a Task to view the Reports here.</p>
			<a href="/app/task"> <Button class="mt-4">Go to Tasks</Button> </a>
		</div>
	</div>
{/if}
