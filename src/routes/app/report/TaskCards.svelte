<script lang="ts">
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';
	import OctagonAlert from 'lucide-svelte/icons/octagon-alert';
	import type { DashboardFetchData } from './types';
	import * as Card from '$lib/components/ui/card/index';

	import type { Task } from '#routes/app/task/types';
	import { calculateDateDifference } from './utils';

	export let selectedTask: Task;
	export let totalImageCount: DashboardFetchData;
	export let temporalRange: DashboardFetchData;
	export let totalObservedArea: DashboardFetchData;
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
	<Card.Root class="flex flex-col justify-between">
		<Card.Header>
			<Card.Title>Temporal Range</Card.Title>
		</Card.Header>
		<Card.Content class="text-4xl font-bold">
			{#if temporalRange.status === 'loading'}
				<LoaderCircle class="animate-spin" />
			{:else if temporalRange.status === 'error'}
				<OctagonAlert />
			{:else}
				<div class="pb-2">
					{calculateDateDifference(temporalRange.data.fromDate, temporalRange.data.toDate).years} Years
				</div>
				<div class="overline">
					{calculateDateDifference(temporalRange.data.fromDate, temporalRange.data.toDate).months}
					Months
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
	<Card.Root class="flex flex-col justify-between">
		<Card.Header>
			<Card.Title>Total Observed Area</Card.Title>
		</Card.Header>
		<Card.Content class="text-4xl font-bold">
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
</div>
