<script lang="ts">
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';
	import OctagonAlert from 'lucide-svelte/icons/octagon-alert';
	import type { DashboardFetchData } from './types';
	import * as Card from '$lib/components/ui/card/index';
	import type { Task } from '#routes/app/task/types';
	import { calculateDateDifference } from './utils';
	import { onMount } from 'svelte';
	import { authenticatedBackendFetch, getErrorCodeText } from '../utils';
	import toast from 'svelte-french-toast';

	export let selectedTask: Task;

	type TotalImageCountData = { count: number };
	let totalImageCount: DashboardFetchData<TotalImageCountData> = {
		status: 'loading',
		data: null
	};

	type TemporalRangeData = { fromDate: number; toDate: number };
	let temporalRange: DashboardFetchData<TemporalRangeData> = {
		status: 'loading',
		data: null
	};

	type TotalObservedAreaData = { area: number };
	let totalObservedArea: DashboardFetchData<TotalObservedAreaData> = {
		status: 'loading',
		data: null
	};

	onMount(async () => {
		totalImageCount = await authenticatedBackendFetch<TotalImageCountData>(
			`report/number-total-distinct-images?taskId=${selectedTask.id}`,
			'GET'
		);
		if (totalImageCount.status === 'error') {
			toast.error(`Image Count: ${getErrorCodeText(totalImageCount.errorCode)}`);
		}

		temporalRange = await authenticatedBackendFetch<TemporalRangeData>(
			`report/temporal-range?taskId=${selectedTask.id}`,
			'GET'
		);
		if (temporalRange.status === 'error') {
			toast.error(`Temporal Range: ${getErrorCodeText(temporalRange.errorCode)}`);
		}

		totalObservedArea = await authenticatedBackendFetch<TotalObservedAreaData>(
			`report/total-observed-area?taskId=${selectedTask.id}`,
			'GET'
		);
		if (totalObservedArea.status === 'error') {
			toast.error(`Observation Area: ${getErrorCodeText(totalObservedArea.errorCode)}`);
		}
	});
</script>

<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
	<!-- TASK -->
	<Card.Root class="flex flex-col justify-between">
		<Card.Header>
			<Card.Title>Name</Card.Title>
		</Card.Header>
		<Card.Content class="text-4xl font-bold">
			{selectedTask.name}
		</Card.Content>
		<Card.Content class="text-muted-foreground text-xs">
			Created {new Date(selectedTask.createdAt * 1000).toDateString()}
		</Card.Content>
	</Card.Root>

	<!-- IMAGE COUNT -->
	<Card.Root class="flex flex-col justify-between">
		<Card.Header>
			<Card.Title>Image Count</Card.Title>
		</Card.Header>
		<Card.Content class="text-4xl font-bold">
			{#if totalImageCount.status === 'loading'}
				<LoaderCircle class="animate-spin" />
			{:else if totalImageCount.data && totalImageCount.status === 'success'}
				{totalImageCount.data.count}
			{:else}
				<OctagonAlert />
			{/if}
		</Card.Content>
		<Card.Content class="text-muted-foreground text-xs">
			Number of analyzed Images with at least partial cloud-free surface reflectance data
		</Card.Content>
	</Card.Root>

	<!-- Temporal Range -->
	<Card.Root class="flex flex-col justify-between">
		<Card.Header>
			<Card.Title>Temporal Range</Card.Title>
		</Card.Header>
		<Card.Content class="text-4xl font-bold">
			{#if temporalRange.status === 'loading'}
				<LoaderCircle class="animate-spin" />
			{:else if temporalRange.data && temporalRange.status === 'success'}
				<div class="pb-2">
					{calculateDateDifference(
						String(temporalRange.data.fromDate),
						String(temporalRange.data.toDate)
					).years} Years
				</div>
				<div class="overline">
					{calculateDateDifference(
						String(temporalRange.data.fromDate),
						String(temporalRange.data.toDate)
					).months}
					Months
				</div>
			{:else}
				<OctagonAlert />
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
	<Card.Root class="flex flex-col justify-between">
		<Card.Header>
			<Card.Title>Total Observed Area</Card.Title>
		</Card.Header>
		<Card.Content class="text-4xl font-bold">
			{#if totalObservedArea.status === 'loading'}
				<LoaderCircle class="animate-spin" />
			{:else if totalObservedArea.data && totalObservedArea.status === 'success'}
				{totalObservedArea.data.area} km²
			{:else}
				<OctagonAlert />
			{/if}
		</Card.Content>
		<Card.Content class="text-muted-foreground text-xs">
			The sum of processed clean-reflectance area over the entire temporal range
		</Card.Content>
	</Card.Root>
</div>
