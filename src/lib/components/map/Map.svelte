<script lang="ts">
	import { onMount } from 'svelte';
	import L from 'leaflet';
	import type { GeoJSON } from 'geojson';
	import { fly } from 'svelte/transition';

	export let geoData: GeoJSON | null = null;
	let map: L.Map;
	let geoLayer: L.GeoJSON | null = null;

	// Abstracted function to handle GeoJSON updates with animation
	function updateGeoJSON(map: L.Map, geoData: GeoJSON): L.GeoJSON {
		const layer = L.geoJSON(geoData).addTo(map);

		// Add animation options to fitBounds
		map.fitBounds(layer.getBounds(), {
			animate: true,
			duration: 1.5, // Duration in seconds
			easeLinearity: 0.25,
			padding: [50, 50] // Optional padding around bounds
		});

		return layer;
	}

	// Reactive statement for geoData changes
	$: if (map && geoData) {
		if (geoLayer) {
			geoLayer.remove();
		}
		geoLayer = updateGeoJSON(map, geoData);
	}

	onMount(() => {
		map = L.map('map').setView([0, 0], 2);

		L.tileLayer('https://tile.jawg.io/jawg-dark/{z}/{x}/{y}{r}.png?access-token={accessToken}', {
			attribution:
				'<a href="https://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
			minZoom: 0,
			maxZoom: 22,
			accessToken: 'iZcdPCK8RIEe0pfME1sGkuIpZayzY0NpPcKswxMi81YuMzbHpJ6T5Yaf3UkgFqpm'
		}).addTo(map);

		if (geoData) {
			geoLayer = updateGeoJSON(map, geoData);
		}

		return () => {
			if (geoLayer) {
				geoLayer.remove();
			}
			map.remove();
		};
	});
</script>

<div id="map" class="w-full h-96"></div>
