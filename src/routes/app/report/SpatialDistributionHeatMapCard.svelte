<script lang="ts">
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';
	import OctagonAlert from 'lucide-svelte/icons/octagon-alert';
	import * as Card from '$lib/components/ui/card/index';
	import SpatialAnalysisMap from '$lib/components/map/SpatialAnalysisMap.svelte';
	import type { DashboardFetchData, FeaturedLayer } from './types.ts';
	import { Button } from '$lib/components/ui/button/index';
	import { onMount } from 'svelte';
	import type { FeatureCollection } from 'geojson';
	import { authenticatedBackendFetch, getErrorCodeText } from '../utils';
	import toast from 'svelte-french-toast';

	export let taskId: string;

	type NdviHeatMapData = FeatureCollection;
	let ndviHeatMap: DashboardFetchData<NdviHeatMapData> = {
		status: 'loading',
		data: null
	};

	onMount(async () => {
		ndviHeatMap = await authenticatedBackendFetch<NdviHeatMapData>(
			`report/spatial-analysis?taskId=${taskId}`,
			'GET'
		);
		if (ndviHeatMap.status === 'error') {
			toast.error(`Heatmap: ${getErrorCodeText(ndviHeatMap.errorCode)}`);
		}
	});
	let featuredLayer: FeaturedLayer = 'NDVI';
</script>

<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-8 gap-4 w-full z-0">
	<Card.Root class="col-span-8 flex flex-col justify-between h-[800px]">
		<Card.Header class="flex flex-row justify-between items-center">
			<Card.Title>Spatial Distribution Heatmap</Card.Title>
			<div>
				<Button
					variant={featuredLayer == 'NDVI' ? 'default' : 'outline'}
					on:click={() => (featuredLayer = 'NDVI')}>Biomass</Button
				>

				<Button
					variant={featuredLayer == 'WHC' ? 'default' : 'outline'}
					on:click={() => (featuredLayer = 'WHC')}>Water Hyacinth</Button
				>
			</div>
		</Card.Header>
		<Card.Content class="text-4xl font-bold h-full w-full">
			{#if ndviHeatMap.status === 'loading'}
				<LoaderCircle class="animate-spin w-full h-full" />
			{:else if ndviHeatMap.data && ndviHeatMap.status === 'success'}
				<SpatialAnalysisMap geoData={ndviHeatMap.data} {featuredLayer} />
			{:else}
				<OctagonAlert />
			{/if}
		</Card.Content>

		<Card.Content class="text-muted-foreground text-xs">Some description here</Card.Content>
	</Card.Root>
</div>
