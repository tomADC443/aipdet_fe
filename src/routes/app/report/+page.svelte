<script lang="ts">
	import { Button } from '$lib/components/ui/button/index';
	import type { Feature, Polygon, Point, GeoJSON } from 'geojson';
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

	let totalImagesCountStatus: 'loading' | 'error' | 'success' = 'loading';
	let totalImagesCountData: string | null = null;

	let taskAoiStatus: 'loading' | 'error' | 'success' = 'loading';
	let taskAoi: Feature<Polygon> | null = null;
	let taskAoiCenterPoint: [number, number] | null = null;

	onMount(() => {
		if ($selectedTask) {
			fetchTotalImagesCount($selectedTask.id);
			fetchSpecificAOI($selectedTask.aoiId);
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
			const data = await response.json();
			if (response.ok && data.geometry) {
				// Type assertion for the polygon feature
				taskAoi = data.geometry as Feature<Polygon>;

				// Get center point - turf.centroid returns a Feature<Point>
				taskAoiCenterPoint = turf.centroid(taskAoi).geometry.coordinates as [number, number];

				taskAoiStatus = 'success';
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

	// Example GeoJSON data
	const geoData: GeoJSON = {
		type: 'FeatureCollection',
		features: [
			{
				type: 'Feature',
				properties: {},
				geometry: {
					coordinates: [
						[
							[27.840131174013294, -25.746724969592677],
							[27.8397789886304, -25.747801803360872],
							[27.836496251700083, -25.749407960944225],
							[27.826455054756124, -25.753324236173576],
							[27.822241527193317, -25.752486072711292],
							[27.814464321902015, -25.75391358882776],
							[27.81014598028828, -25.754727491412176],
							[27.804318317701934, -25.75952404898403],
							[27.808322213764914, -25.76272467684843],
							[27.812630070915432, -25.76125711021749],
							[27.818190456142283, -25.76179767701258],
							[27.820341764450962, -25.76301191811887],
							[27.823775734750363, -25.76380782644213],
							[27.824916242620272, -25.765244111376532],
							[27.825958159783013, -25.765395881058218],
							[27.826793560518276, -25.76646289293178],
							[27.827944959240615, -25.762371076171227],
							[27.833499326017723, -25.760136335414625],
							[27.838319994439132, -25.762621433035207],
							[27.840832706657807, -25.76200094376739],
							[27.842656449396827, -25.755503861410574],
							[27.845209689231496, -25.753678774324598],
							[27.845817603478935, -25.753094740532973],
							[27.849140868025273, -25.75225518692706],
							[27.849343506107232, -25.751780654002772],
							[27.85027564128484, -25.751817156602357],
							[27.85120777646236, -25.75269321563492],
							[27.853639433448848, -25.754518317867507],
							[27.85416629246251, -25.754408812524076],
							[27.855382120954147, -25.754445314315973],
							[27.858340636954296, -25.755832374107413],
							[27.86064158419697, -25.75992420619876],
							[27.862039424778956, -25.76160099171865],
							[27.864485405868464, -25.762050619251838],
							[27.864496559823266, -25.760377363969795],
							[27.863906754390968, -25.75449828109116],
							[27.855480400600527, -25.736713002281718],
							[27.855419464947403, -25.73733248225183],
							[27.855157641043377, -25.738423053279433],
							[27.854974834082753, -25.73939538615359],
							[27.85420008077722, -25.739858025615106],
							[27.85325993069813, -25.739983486853674],
							[27.85164948843243, -25.74133218680238],
							[27.850831209660896, -25.741073425789764],
							[27.850711440523128, -25.741546504118517],
							[27.848601701370598, -25.74250961470156],
							[27.848580173419975, -25.742755238970645],
							[27.847733407365666, -25.743110746881527],
							[27.847690351464422, -25.743304659838856],
							[27.847460721275866, -25.74352442750991],
							[27.84652066743587, -25.74361491994847],
							[27.844508523955994, -25.744333423178006],
							[27.844393708219656, -25.744844054697538],
							[27.843360366594027, -25.74518016538633],
							[27.843001567418753, -25.745005646493823],
							[27.842707352094294, -25.745218947327842],
							[27.842190681281437, -25.745283583868613],
							[27.84081289244685, -25.745949338191934],
							[27.840777012529884, -25.7463694724959],
							[27.840131174013294, -25.746724969592677]
						]
					],
					type: 'Polygon'
				},
				id: 0
			}
		]
	};

	const lineChartData: ChartConfiguration<'line', number[], string> = {
		type: 'line',
		data: {
			labels: ['January', 'February', 'March', 'April', 'May', 'June'],
			datasets: [
				{
					label: 'Example Data',
					data: [65, 59, 80, 81, 56, 55, 40],
					fill: false,
					borderColor: 'rgb(75, 192, 192)'
				}
			]
		},
		options: {
			responsive: true
		}
	};
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
						<!-- Tailwind CSS classes to control the chart's size -->
						<LineChart chartData={lineChartData} />
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
					<Card.Title>Line Chart</Card.Title>
					<Card.Description>Check out this line chart inside a card!</Card.Description>
					<div class="relative">
						<!-- Tailwind CSS classes to control the chart's size -->
						<LineChart chartData={lineChartData} />
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
					<Card.Title>Line Chart</Card.Title>
					<Card.Description>Check out this line chart inside a card!</Card.Description>
					<div class="relative">
						<!-- Tailwind CSS classes to control the chart's size -->
						<LineChart chartData={lineChartData} />
					</div>
				</Card.Header>
				<Card.Content>
					<div class="grid gap-6">
						<div class="grid gap-3"></div>
					</div>
				</Card.Content>
			</Card.Root>
		</div>
		<Card.Root>
			<Card.Header>
				<Card.Title>Interactive Map</Card.Title>
				<Card.Description>Check out this map inside a card!</Card.Description>
				<div class="relative">
					<!-- Tailwind CSS classes to control the map's size -->
					{#if taskAoiStatus === 'loading' || !taskAoiCenterPoint || !taskAoi}
						<Skeleton class="w-full h-96" />
					{:else}
						<Map center={taskAoiCenterPoint} zoom={13} {geoData} />
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
