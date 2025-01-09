<script lang="ts">
	import { Button } from '$lib/components/ui/button/index';
	import type { Feature, Polygon } from 'geojson';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';
	import * as Card from '$lib/components/ui/card/index';
	import Map from '$lib/components/map/Map.svelte';
	import LineChart from '$lib/components/chart/LineChart.svelte';
	import type { ChartConfiguration } from 'chart.js';
	import { onMount } from 'svelte';
	import { selectedTask } from '#app/stores';
	import toast from 'svelte-french-toast';
	import * as turf from '@turf/turf';
	import type { N } from 'vitest/dist/chunks/environment.CzISCQ7o.js';
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';
	import { any } from 'zod';
	import type { NDVIAreaData, NDVIDataPoint } from './types';

	let totalImagesCountStatus: 'loading' | 'error' | 'success' = 'loading';
	let totalImagesCountData: string | null = null;

	let taskAoiStatus: 'loading' | 'error' | 'success' = 'loading';
	let taskAoi: Feature<Polygon> | null = null;
	let taskAoiCenterPoint: [number, number] | null = null;

	let ndviAreaDataStatus: 'loading' | 'error' | 'success' = 'loading';
	let ndviAreaData: NDVIAreaData | null = null;
	let ndviAreaChartData: ChartConfiguration<'line', number[], string> | null = null;

	onMount(() => {
		if ($selectedTask) {
			fetchTotalImagesCount($selectedTask.id);
			fetchSpecificAOI($selectedTask.aoiId);
			fetchNdviAreaData($selectedTask.id);
		}
	});

	async function fetchTotalImagesCount(taskId: string) {
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
				totalImagesCountData = String(data.count);
				totalImagesCountStatus = 'success';
				return;
			} else {
				totalImagesCountData = 'Error';
				totalImagesCountStatus = 'error';

				toast.error('Failed to get Total Image Count . Try again Later.');
				console.error('Response not ok:', response.body);
			}
		} catch (error) {
			totalImagesCountData = 'Error';
			totalImagesCountStatus = 'error';

			toast.error('Failed to get Total Image Count. Try again Later.');
			console.error('Failed to get Total Image Count', error);
		}
	}

	async function fetchSpecificAOI(id: string) {
		try {
			const response = await fetch(`${import.meta.env.VITE_BASE_URL_API}/api/aoi?id=${id}`, {
				method: 'GET',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
					Connection: 'keep-alive'
				}
			});
			let data = await response.json();
			data = data.aoi;

			if (response.ok && data.geometry) {
				taskAoiStatus = 'success';
				// Type assertion for the polygon feature
				taskAoi = data.geometry as Feature<Polygon>;
				return;
			} else {
				taskAoiStatus = 'error';

				toast.error('Failed to get AOI. Try again Later.');
				console.error('AOI Response not ok:', response.body);
			}
		} catch (error) {
			taskAoiStatus = 'error';

			toast.error('Failed to get AOI Try again Later.');
			console.error('Failed to get AOI', error);
		}
	}

	async function fetchNdviAreaData(taskId: string) {
		try {
			const response = await fetch(
				`${import.meta.env.VITE_BASE_URL_API}/api/report/ndvi-area-data?taskId=${taskId}`,
				{
					method: 'GET',
					credentials: 'include',
					headers: {
						'Content-Type': 'application/json',
						Connection: 'keep-alive'
					}
				}
			);
			const data = (await response.json()) as NDVIAreaData;

			if (response.ok && data) {
				taskAoiStatus = 'success';

				ndviAreaDataStatus = 'success';
				ndviAreaData = data;

				ndviAreaChartData = {
					type: 'line',
					data: {
						labels: data.map((datapoint: NDVIDataPoint) => datapoint.date),
						datasets: [
							{
								label: 'Example Data',
								data: data.map((datapoint: NDVIDataPoint) => datapoint.value),
								fill: false,
								borderColor: 'rgb(75, 192, 192)'
							}
						]
					},
					options: {
						responsive: true
					}
				};

				return;
			} else {
				ndviAreaDataStatus = 'error';

				toast.error('Failed to get Biomass area data. Try again Later.');
				console.error('Biomass area data Response not ok:', response.body);
			}
		} catch (error) {
			ndviAreaDataStatus = 'error';

			toast.error('Failed to get Biomass area data. Try again Later.');
			console.error('Failed to get Biomass area data', error);
		}
	}
</script>

{#if $selectedTask}
	<div class="mx-auto grid flex-1 auto-rows-max gap-4">
		<div class="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
			<Card.Root>
				<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
					<Card.Title class="text-sm font-medium">Images Count</Card.Title>
					<!-- <DollarSign class="text-muted-foreground h-4 w-4" /> -->
				</Card.Header>
				<Card.Content>
					<div class="text-6xl font-bold">
						{#if totalImagesCountStatus === 'loading'}
							<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
						{:else}
							{totalImagesCountData}
						{/if}
					</div>
					<p class="text-muted-foreground text-xs">
						Number of analyzed Images with at least partial cloud-free surface reflectance data
					</p>
				</Card.Content>
			</Card.Root>

			<Card.Root class="">
				<Card.Header>
					<Card.Title>Line Chart</Card.Title>
					<Card.Description>Check out this line chart inside a card!</Card.Description>
					<div class="relative">
						{#if ndviAreaDataStatus == 'loading'}
							<LoaderCircle class="mr-2 h-full w-full animate-spin" />
						{:else if ndviAreaDataStatus == 'error' || !ndviAreaChartData}
							<p class="text-muted-foreground">Failed to get Biomass area data. Try again Later.</p>
						{:else}
							<!-- Tailwind CSS classes to control the chart's size -->
							<LineChart chartData={ndviAreaChartData} />
						{/if}
					</div>
				</Card.Header>
				<Card.Content>
					<div class="grid gap-6">
						<div class="grid gap-3"></div>
					</div>
				</Card.Content>
			</Card.Root>
		</div>
		<Card.Root class="">
			<Card.Header>
				<Card.Title>Line Chart</Card.Title>
				<Card.Description>Check out this line chart inside a card!</Card.Description>
				<div class="relative">
					{#if ndviAreaDataStatus == 'loading'}
						<LoaderCircle class="mr-2 h-full w-full animate-spin" />
					{:else if ndviAreaDataStatus == 'error' || !ndviAreaChartData}
						<p class="text-muted-foreground">Failed to get Biomass area data. Try again Later.</p>
					{:else}
						<!-- Tailwind CSS classes to control the chart's size -->
						<LineChart chartData={ndviAreaChartData} />
					{/if}
				</div>
			</Card.Header>
			<Card.Content>
				<div class="grid gap-6">
					<div class="grid gap-3"></div>
				</div>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header>
				<Card.Title>Area of Interest</Card.Title>
				<Card.Description>Shows the analysis area footprint</Card.Description>
				<div class="relative">
					<!-- Tailwind CSS classes to control the map's size -->
					{#if taskAoiStatus === 'loading'}
						<Skeleton class="w-full h-96" />
					{:else}
						<Map geoData={taskAoi} />
					{/if}
				</div>
			</Card.Header>
			<Card.Content>
				<div class="grid gap-6">
					<div class="grid gap-3"></div>
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
