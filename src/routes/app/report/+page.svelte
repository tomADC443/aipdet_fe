<script lang="ts">
	import { Button } from '$lib/components/ui/button/index';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';
	import OctagonAlert from 'lucide-svelte/icons/octagon-alert';
	import * as Card from '$lib/components/ui/card/index';
	import Chart from '$lib/components/chart/Chart.svelte';
	import type { ChartConfiguration } from 'chart.js';
	import { onMount } from 'svelte';
	import { selectedTask } from '#app/stores';
	import toast from 'svelte-french-toast';
	import SpatialAnalysisMap from '$lib/components/map/SpatialAnalysisMap.svelte';
	import InspectorMap from '$lib/components/map/InspectorMap.svelte';
	import { calculateDateDifference } from './utils.ts';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import TaskCards from './TaskCards.svelte';
	import SeasonCards from './SeasonCards.svelte';
	import InspectorCard from './InspectorCard.svelte';

	type DashboardFetchData = {
		status: 'loading' | 'error' | 'success';
		data: any | null;
	};
	let totalImageCount: DashboardFetchData = {
		status: 'loading',
		data: null
	};
	let temporalRange: DashboardFetchData = {
		status: 'loading',
		data: null
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
		if ($selectedTask) {
			totalImageCount = await fetchTotalImageCount($selectedTask.id);
			temporalRange = await fetchTemporalRange($selectedTask.id);
			totalObservedArea = await fetchTotalObservedArea($selectedTask.id);
			ndviHeatMap = await fetchNdviHeatMap($selectedTask.id);
			ndviSeason = await fetchNdviSeasonData($selectedTask.id);
			availableDates = await fetchAvailableDates($selectedTask.id);
			// await fetchSpecificAOI($selectedTask.aoiId);
			// fetchNdviAreaData($selectedTask.id);
		}
	});

	async function fetchTotalImageCount(taskId: string): Promise<DashboardFetchData> {
		try {
			const response = await fetch(
				`${import.meta.env.VITE_BASE_URL_API}/api/report/number-total-distinct-images?taskId=${taskId}`,

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
					data: String(data.count)
				};
			} else {
				throw `Response not ok ${response}`;
			}
		} catch (error) {
			console.log(error);
			toast.error('Failed to load Image Count data. Try again Later.');
			return {
				status: 'error',
				data: null
			};
		}
	}
	async function fetchTemporalRange(taskId: string): Promise<DashboardFetchData> {
		try {
			const response = await fetch(
				`${import.meta.env.VITE_BASE_URL_API}/api/report/temporal-range?taskId=${taskId}`,

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
			toast.error('Failed to load Temporal Range. Try again Later.');
			return {
				status: 'error',
				data: null
			};
		}
	}
	async function fetchTotalObservedArea(taskId: string): Promise<DashboardFetchData> {
		try {
			const response = await fetch(
				`${import.meta.env.VITE_BASE_URL_API}/api/report/total-observed-area?taskId=${taskId}`,

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
					data: data.area
				};
			} else {
				throw `Response not ok ${response}`;
			}
		} catch (error) {
			console.log(error);
			toast.error('Failed to load Total Observed Area data. Try again Later.');
			return {
				status: 'error',
				data: null
			};
		}
	}
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

	// async function fetchNdviAreaData(taskId: string) {
	// 	try {
	// 		const response = await fetch(
	// 			`${import.meta.env.VITE_BASE_URL_API}/api/report/ndvi-area-data?taskId=${taskId}`,
	// 			{
	// 				method: 'GET',
	// 				credentials: 'include',
	// 				headers: {
	// 					'Content-Type': 'application/json',
	// 					Connection: 'keep-alive'
	// 				}
	// 			}
	// 		);
	// 		const data = (await response.json()) as NDVIAreaData;

	// 		if (response.ok && data) {
	// 			taskAoiStatus = 'success';

	// 			ndviAreaDataStatus = 'success';
	// 			ndviAreaData = data;

	// 			ndviAreaChartData = {
	// 				type: 'line',
	// 				data: {
	// 					labels: data.map((datapoint: NDVIDataPoint) => datapoint.date),
	// 					datasets: [
	// 						{
	// 							label: 'Example Data',
	// 							data: data.map((datapoint: NDVIDataPoint) => datapoint.value),
	// 							fill: false,
	// 							borderColor: 'rgb(75, 192, 192)'
	// 						}
	// 					]
	// 				},
	// 				options: {
	// 					responsive: true
	// 				}
	// 			};

	// 			return;
	// 		} else {
	// 			ndviAreaDataStatus = 'error';

	// 			toast.error('Failed to get Biomass area data. Try again Later.');
	// 			console.error('Biomass area data Response not ok:', response.body);
	// 		}
	// 	} catch (error) {
	// 		ndviAreaDataStatus = 'error';

	// 		toast.error('Failed to get Biomass area data. Try again Later.');
	// 		console.error('Failed to get Biomass area data', error);
	// 	}
	// }
</script>

{#if $selectedTask}
	<div class="flex flex-col auto-rows-max items-start gap-4 lg:gap-8">
		<h1 class="text-lg font-semibold md:text-2xl">Reports</h1>
		<Separator />

		<h2 class="col-span-4 ext-base font-semibold md:text-2xl">General Task Information</h2>
		<p class="text-muted-foreground">Here's a list of your tasks for this month!</p>
		<TaskCards selectedTask={$selectedTask} {totalImageCount} {temporalRange} {totalObservedArea} />
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
		<h2 class="col-span-4 ext-base font-semibold md:text-2xl">Inspector</h2>
		<p class="text-muted-foreground">Here's a list of your tasks for this month!</p>
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
