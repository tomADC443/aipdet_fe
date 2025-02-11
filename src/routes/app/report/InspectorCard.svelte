<script lang="ts">
	import { Button } from '$lib/components/ui/button/index';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';
	import OctagonAlert from 'lucide-svelte/icons/octagon-alert';
	import * as Card from '$lib/components/ui/card/index';
	import InspectorMap from '$lib/components/map/InspectorMap.svelte';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import type { FetchData } from '#app/types';
	import type { Task } from '#routes/app/task/types';
	import { onMount } from 'svelte';
	import type { GeoJSON } from 'geojson';
	import { authenticatedBackendFetch, getErrorCodeText } from '../utils';
	import toast from 'svelte-french-toast';

	export let selectedTask: Task;

	let selectedDateString = 'None';
	$: selectedDateString =
		inspectorData && inspectorData.data ? inspectorData.data.dateString : 'None';
	let showObservedLayer = true;
	let showNdviLayer = true;
	let showWhcLayer = true;

	type AnalysisRecordData = {
		observed_areas: GeoJSON[];
		ndvi_areas: GeoJSON[];
		whc_areas: GeoJSON[];
		dateString: string;
	};
	let inspectorData: FetchData<AnalysisRecordData> = {
		status: 'success',
		data: null
	};

	type AvailableDatesData = {
		dates: string[]; // ISO date strings (date values)
	};
	let availableDates: FetchData<AvailableDatesData> = {
		status: 'loading',
		data: null
	};

	async function handleDateClick(dateString: string): Promise<void> {
		inspectorData = {
			status: 'loading',
			data: null
		};
		inspectorData = await authenticatedBackendFetch<AnalysisRecordData>(
			`report/analysis-record?taskId=${selectedTask.id}&&dateString=${dateString}`,
			'GET'
		);

		if (inspectorData.status === 'error') {
			toast.error(`Inspector Map: ${getErrorCodeText(inspectorData.errorCode)}`);
		}
		return;
	}

	onMount(async () => {
		availableDates = await authenticatedBackendFetch<AvailableDatesData>(
			`report/available-dates?taskId=${selectedTask.id}`,
			'GET'
		);
		if (availableDates.status === 'error') {
			toast.error(`Available Dates: ${getErrorCodeText(availableDates.errorCode)}`);
		}
	});
</script>

<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-7 gap-4 w-full z-0">
	<Card.Root class="col-span-6 flex flex-col justify-between h-[800px]">
		<Card.Header class="flex flex-row justify-between items-center">
			<Card.Title>Date Selected: {selectedDateString}</Card.Title>
			<div>
				<Button
					class={`
						${showObservedLayer ? 'bg-[hsl(var(--primary))]/40' : 'bg-gray-200 text-gray-500 opacity-50'}
					  `}
					variant="ghost"
					on:click={() => (showObservedLayer = !showObservedLayer)}
					>Observed Area
				</Button>

				<Button
					class={`
						${showNdviLayer ? 'bg-[hsl(var(--biomass))]/40' : 'bg-gray-200 text-gray-500 opacity-50'}
					  `}
					variant="ghost"
					on:click={() => (showNdviLayer = !showNdviLayer)}>Biomass</Button
				>

				<Button
					class={`
						${showWhcLayer ? 'bg-[hsl(var(--waterHyacinth))]/40' : 'bg-gray-200 text-gray-500 opacity-50'}
					  `}
					variant="ghost"
					on:click={() => (showWhcLayer = !showWhcLayer)}>Water Hyacinth</Button
				>
			</div>
		</Card.Header>
		<Card.Content class="text-4xl font-bold h-full">
			<InspectorMap
				{showObservedLayer}
				{showNdviLayer}
				{showWhcLayer}
				aoiData={{
					name: selectedTask.aoi.name,
					geometry: selectedTask.aoi.geometry
				}}
				recordData={inspectorData.status ? inspectorData.data : null}
			/>
		</Card.Content>

		<Card.Content class="text-muted-foreground text-xs"
			>Some days might only display very small areas</Card.Content
		>
	</Card.Root>

	<div class="col-span-1 justify-items-center rounded-md border h-full p-4 max-h-[800px]">
		<h4 class="text-center mb-4 text-base font-medium leading-none">Available Dates</h4>
		<ScrollArea class="h-[calc(100%-2rem)]">
			{#if availableDates.status === 'loading'}
				<LoaderCircle class="animate-spin h-full" />
			{:else if availableDates.data && availableDates.status === 'success'}
				{#each availableDates.data.dates as availableDate}
					<div class="flex flex-col items-center w-full text-sm font-mono">
						<Button
							class="w-full"
							disabled={inspectorData.status === 'loading'}
							variant="ghost"
							on:click={() => handleDateClick(availableDate.substring(0, 10))}
						>
							{availableDate.substring(0, 10)}
						</Button>
						<Separator class="my-2 w-full" />
					</div>
				{/each}
			{:else}
				<OctagonAlert />
			{/if}
		</ScrollArea>
	</div>
</div>
