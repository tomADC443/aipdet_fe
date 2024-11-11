<script lang="ts">
	import { onMount } from 'svelte';
	import L from 'leaflet';
	import type { GeoJSON } from 'geojson';

	export let center: [number, number] = [51.505, -0.09]; // Default center
	export let zoom: number = 13; // Default zoom level
	export let geoData: GeoJSON | null = null; // Optional GeoJSON data

	let map: L.Map;

	onMount(() => {
		// Initialize the map
		map = L.map('map').setView(center, zoom);

		// Add OpenStreetMap tiles as base layer
		L.tileLayer('https://tile.jawg.io/jawg-dark/{z}/{x}/{y}{r}.png?access-token={accessToken}', {
			attribution:
				'<a href="https://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
			minZoom: 0,
			maxZoom: 22,
			accessToken: 'iZcdPCK8RIEe0pfME1sGkuIpZayzY0NpPcKswxMi81YuMzbHpJ6T5Yaf3UkgFqpm'
		}).addTo(map);

		// If GeoJSON data is passed, add it to the map
		if (geoData) {
			L.geoJSON(geoData).addTo(map);
		}
	});
</script>

<!-- Map container styled using Tailwind CSS -->
<div id="map" class="w-full h-96"></div>
