<script lang="ts">
	import * as Card from '$lib/components/ui/card/index';
	import type { GeoJSON } from 'geojson';
	import Map from '$lib/components/map/Map.svelte';
	import LineChart from '$lib/components/chart/LineChart.svelte';
	import type { ChartConfiguration } from 'chart.js';
	import { Progress } from '$lib/components/ui/progress/index';

	// Example GeoJSON data
	const geoData: GeoJSON = {
		type: 'FeatureCollection',
		features: [
			{
				type: 'Feature',
				geometry: {
					type: 'Point',
					coordinates: [-0.09, 51.505]
				},
				properties: {
					name: 'Marker 1'
				}
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

<div class="mx-auto grid flex-1 auto-rows-max gap-4">
	<div class="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
		<Card.Root
			data-x-chunk-name="dashboard-01-chunk-0"
			data-x-chunk-description="A card showing the total revenue in USD and the percentage difference from last month."
		>
			<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
				<Card.Title class="text-sm font-medium">Total Revenue</Card.Title>
				<!-- <DollarSign class="text-muted-foreground h-4 w-4" /> -->
			</Card.Header>
			<Card.Content>
				<div class="text-6xl font-bold">$45,231.89</div>
				<p class="text-muted-foreground text-xs">+20.1% from last month</p>
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
				<Map center={[51.505, -0.09]} zoom={13} {geoData} />
			</div>
		</Card.Header>
		<Card.Content>
			<div class="grid gap-6">
				<div class="grid gap-3"></div>
			</div>
		</Card.Content>
	</Card.Root>
</div>
