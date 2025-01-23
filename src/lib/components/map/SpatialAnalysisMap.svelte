<script lang="ts">
	import { onMount } from 'svelte';
	import L from 'leaflet';
	import type { GeoJSON } from 'geojson';

	export let geoData: GeoJSON;
	let map: L.Map;
	let geoLayer: L.GeoJSON | null = null;

	onMount(() => {
		map = L.map('map').setView([0, 0], 2);

		L.tileLayer('https://tile.jawg.io/jawg-dark/{z}/{x}/{y}{r}.png?access-token={accessToken}', {
			attribution:
				'<a href="https://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
			minZoom: 0,
			maxZoom: 22,
			accessToken: 'iZcdPCK8RIEe0pfME1sGkuIpZayzY0NpPcKswxMi81YuMzbHpJ6T5Yaf3UkgFqpm'
		}).addTo(map);

		const layer = L.geoJSON(geoData, {
			style: (feature) => {
				// Get value from properties to determine color
				const value = feature?.properties?.ndvi_score;

				return {
					fillColor: getColor(value), // Function to map value to color
					fillOpacity: 0.5,
					opacity: 0,
					stroke: false
				};
			},
			onEachFeature: (feature, layer) => {
				const score = feature.properties?.ndvi_score;
				layer.bindTooltip(`NDVI Score: ${score?.toFixed(2) || 'N/A'}`);
			}
		}).addTo(map);
		map.fitBounds(layer.getBounds());
	});

	function getColor(value: number) {
		// Example color scale
		return value > 0.5
			? '#1E123E'
			: value > 0.3
				? '#3c247d'
				: value > 0.2
					? '#7748f9'
					: value > 0.15
						? '#9976FB'
						: value > 0.1
							? '#C0abfc'
							: value > 0.05
								? '#E2dBff'
								: value > 0.03
									? '#F3F0FF'
									: '#FFFFFF';
	}
</script>

<div id="map" class="w-full h-96"></div>
