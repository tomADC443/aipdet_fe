<script lang="ts">
	import { Button } from '$lib/components/ui/button/index';
	import type { Feature, Polygon } from 'geojson';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';
	import OctagonAlert from 'lucide-svelte/icons/octagon-alert';
	import * as Card from '$lib/components/ui/card/index';
	import Map from '$lib/components/map/Map.svelte';
	import Chart from '$lib/components/chart/Chart.svelte';
	import type { ChartConfiguration } from 'chart.js';
	import { onMount } from 'svelte';
	import { selectedTask } from '#app/stores';
	import toast from 'svelte-french-toast';
	import type { NDVIAreaData, NDVIDataPoint } from './types';
	import SpatialAnalysisMap from '$lib/components/map/SpatialAnalysisMap.svelte';
	import InspectorMap from '$lib/components/map/InspectorMap.svelte';
	import { calculateDateDifference } from './utils.ts';
	import Label from '$lib/components/ui/label/label.svelte';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';

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

	async function handleDateClick(dateString: string) {
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
	<div class="mx-auto grid flex-1 auto-rows-max gap-4">
		<Card.Root>
			<Card.Header>
				<Card.Title>General INFO</Card.Title>
				<Card.Description>Check out this line chart inside a card!</Card.Description>
			</Card.Header>
			<Card.Content class="flex flex-row gap-4">
				<!-- TASK -->
				<Card.Root class="flex flex-1 flex-col justify-between">
					<Card.Header>
						<Card.Title>Task</Card.Title>
					</Card.Header>
					<Card.Content class="text-5xl font-bold">
						{$selectedTask.name}
					</Card.Content>
					<Card.Content class="text-muted-foreground text-xs">
						Created {new Date($selectedTask.createdAt * 1000).toDateString()}
					</Card.Content>
				</Card.Root>
				<!-- IMAGE COUNT -->
				<Card.Root class="flex flex-1 flex-col justify-between">
					<Card.Header>
						<Card.Title>Image Count</Card.Title>
					</Card.Header>
					<Card.Content class="text-5xl font-bold">
						{#if totalImageCount.status === 'loading'}
							<LoaderCircle class="animate-spin" />
						{:else if totalImageCount.status === 'error'}
							<OctagonAlert />
						{:else}
							{totalImageCount.data}
						{/if}
					</Card.Content>
					<Card.Content class="text-muted-foreground text-xs">
						Number of analyzed Images with at least partial cloud-free surface reflectance data
					</Card.Content>
				</Card.Root>
				<!-- Temporal Range -->
				<Card.Root class="flex flex-1 flex-col justify-between">
					<Card.Header>
						<Card.Title>Temporal Range</Card.Title>
					</Card.Header>
					<Card.Content class="text-5xl font-bold">
						{#if temporalRange.status === 'loading'}
							<LoaderCircle class="animate-spin" />
						{:else if temporalRange.status === 'error'}
							<OctagonAlert />
						{:else}
							<div class="pb-2">
								{calculateDateDifference(temporalRange.data.fromDate, temporalRange.data.toDate)
									.years} Years
							</div>
							<div class="overline">
								{calculateDateDifference(temporalRange.data.fromDate, temporalRange.data.toDate)
									.months} Months
							</div>
						{/if}
					</Card.Content>
					<Card.Content class="text-muted-foreground text-xs">
						Difference between the earliest
						{temporalRange.data ? `(${temporalRange.data.fromDate})` : ''}
						and latest
						{temporalRange.data ? `(${temporalRange.data.toDate})` : ''}
						date of the analyzed images.
					</Card.Content>
				</Card.Root>
				<!-- Total Observed Area -->
				<Card.Root class="flex flex-1 flex-col justify-between">
					<Card.Header>
						<Card.Title>Total Observed Area</Card.Title>
					</Card.Header>
					<Card.Content class="text-5xl font-bold">
						{#if totalObservedArea.status === 'loading'}
							<LoaderCircle class="animate-spin" />
						{:else if totalObservedArea.status === 'error'}
							<OctagonAlert />
						{:else}
							{totalObservedArea.data} km²
						{/if}
					</Card.Content>
					<Card.Content class="text-muted-foreground text-xs">
						The sum of processed clean-reflectance area over the entire temporal range
					</Card.Content>
				</Card.Root>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header>
				<Card.Title>Seasonal Report</Card.Title>
				<Card.Description>Check out this line chart inside a card!</Card.Description>
			</Card.Header>
			<Card.Content class="flex flex-row gap-4">
				<!-- Season Graph -->
				<Card.Root class="flex flex-1 flex-col justify-between">
					<Card.Header>
						<Card.Title>Seasons Graph</Card.Title>
					</Card.Header>
					<Card.Content class="text-5xl font-bold">
						{#if ndviSeason.status === 'loading'}
							<LoaderCircle class="animate-spin" />
						{:else if ndviSeason.status === 'error'}
							<OctagonAlert />
						{:else}
							<Chart
								chartData={getNdviSeasonDataChartConfig(
									ndviSeason.data.monthly_average.month,
									ndviSeason.data.monthly_average.values
								)}
							/>
						{/if}
					</Card.Content>
					<Card.Content class="text-muted-foreground text-xs">
						This chart visualizes the mean monthly green biomass coverage (NDVI scoring), indicating
						the average vegetation activity for each month across the observation period. The
						aggregation of NDVI measurements eliminates irregularities caused by annual variations,
						providing a clear depiction of long-term monthly vegetation trends.
					</Card.Content>
				</Card.Root>
				<!-- Season Text -->
				<Card.Root class="flex flex-1 flex-col justify-between">
					<Card.Header>
						<Card.Title>Season Recognition</Card.Title>
					</Card.Header>
					<Card.Content class="text-5xl font-bold">
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
					<Card.Content class="text-muted-foreground text-xs">
						Seasons are identified by weekly aggregated data, when vegetation activity stays above
						average for at least 6 weeks, with allowances for brief gaps. These dates provide
						insight into recurring vegetation cycles.
					</Card.Content>
				</Card.Root>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header>
				<Card.Title>Something</Card.Title>
				<Card.Description>Check out this line chart inside a card!</Card.Description>
			</Card.Header>
			<Card.Content class="flex flex-row gap-4">
				<!-- Green Surface Biomass Heatmap -->
				<Card.Root class="flex flex-1 flex-col justify-between">
					<Card.Header>
						<Card.Title>Green Surface Biomass Heatmap</Card.Title>
					</Card.Header>
					<Card.Content class="text-5xl font-bold">
						{#if ndviHeatMap.status === 'loading'}
							<LoaderCircle class="animate-spin" />
						{:else if ndviHeatMap.status === 'error'}
							<OctagonAlert />
						{:else}
							<SpatialAnalysisMap geoData={ndviHeatMap.data} />
						{/if}
					</Card.Content>
					<Card.Content class="text-muted-foreground text-xs">
						The heatmap shows the aggregated spatial distribution of Green Surface Biomass (NDVI)
						over the observation period. Each 100m x 100m cell calculates an NDVI score,
						representing the normalized ratio of observed area to green surface biomass. This score
						indicates the likelihood of any area within the cell being fully covered by vegetation
						at any point.
					</Card.Content>
				</Card.Root>
				<!-- IMAGE COUNT -->
				<Card.Root class="flex flex-1 flex-col justify-between">
					<Card.Header>
						<Card.Title>Image Count</Card.Title>
					</Card.Header>
					<Card.Content class="text-5xl font-bold">
						{#if totalImageCount.status === 'loading'}
							<LoaderCircle class="animate-spin" />
						{:else if totalImageCount.status === 'error'}
							<OctagonAlert />
						{:else}
							{totalImageCount.data}
						{/if}
					</Card.Content>
					<Card.Content class="text-muted-foreground text-xs">
						Number of analyzed Images with at least partial cloud-free surface reflectance data
					</Card.Content>
				</Card.Root>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header>
				<Card.Title>Inspector</Card.Title>
				<Card.Description>Check out this line chart inside a card!</Card.Description>
			</Card.Header>
			<Card.Content class="flex flex-row gap-4">
				<!-- MAP -->
				<Card.Root class="flex basis-5/6 flex-grow flex-col justify-between h-[600px]">
					<div class="text-5xl font-bold h-full rounded-md border">
						<InspectorMap
							aoiData={{
								name: $selectedTask.aoi.name,
								geometry: $selectedTask.aoi.geometry
							}}
							recordData={inspectorData.data}
						/>
					</div>
				</Card.Root>
				<!-- IMAGE COUNT SMALL-->
				<div class="flex basis-1/6 flex-grow flex-col justify-between h-[600px]">
					<div class="justify-items-center rounded-md border h-full p-4">
						<h4 class="text-center mb-4 text-base font-medium leading-none">Available Dates</h4>
						<ScrollArea class="h-[calc(100%-2rem)]">
							{#if availableDates.status === 'loading'}
								<LoaderCircle class="animate-spin h-full" />
							{:else if availableDates.status === 'error'}
								<OctagonAlert />
							{:else}
								{#each availableDates.data as availableDate}
									<div class="flex flex-col items-center w-full text-sm font-mono">
										<Button
											class="w-full"
											disabled={inspectorData.status === 'loading'}
											variant="ghost"
											on:click={() => handleDateClick(availableDate)}
										>
											{availableDate}
										</Button>
										<Separator class="my-2 w-full" />
									</div>
								{/each}
							{/if}
						</ScrollArea>
					</div>
				</div>
			</Card.Content>
		</Card.Root>
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
