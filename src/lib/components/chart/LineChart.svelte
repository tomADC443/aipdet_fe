<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import Chart from 'chart.js/auto';
	import type { ChartConfiguration } from 'chart.js/auto';

	let canvas: HTMLCanvasElement | null = null;
	let chart: Chart | null = null;

	// Expect the parent to provide the chart configuration as a prop
	export let chartData: ChartConfiguration;

	onMount(() => {
		if (canvas && chartData) {
			chart = new Chart(canvas, chartData);
		}
	});

	onDestroy(() => {
		if (chart) {
			chart.destroy();
		}
	});
</script>

<canvas bind:this={canvas}></canvas>
