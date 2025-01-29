<script lang="ts">
	import { Button } from '$lib/components/ui/button/index';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';
	import OctagonAlert from 'lucide-svelte/icons/octagon-alert';
	import * as Card from '$lib/components/ui/card/index';

	import InspectorMap from '$lib/components/map/InspectorMap.svelte';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import type { DashboardFetchData } from './types';
	import type { Task } from '#routes/app/task/types';
	import { COLOR } from './constants';

	export let selectedTask: Task;
	export let inspectorData: DashboardFetchData;
	export let availableDates: DashboardFetchData;
	export let handleDateClick: (dateString: string) => Promise<void>;

	let selectedDateString = 'None';
	$: selectedDateString =
		inspectorData && inspectorData.data ? inspectorData.data.dateString : 'None';
	let showObservedLayer = true;
	let showNdviLayer = true;
	let showWhcLayer = true;
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
				recordData={inspectorData.data}
			/>
		</Card.Content>

		<Card.Content class="text-muted-foreground text-xs">Some description here</Card.Content>
	</Card.Root>

	<div class="col-span-1 justify-items-center rounded-md border h-full p-4 max-h-[800px]">
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
