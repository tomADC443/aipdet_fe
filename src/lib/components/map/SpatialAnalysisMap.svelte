<script lang="ts">
	import { onMount } from 'svelte';
	import L from 'leaflet';
	import type { GeoJSON } from 'geojson';

	export let geoData: GeoJSON;
	let map: L.Map;

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
					fillOpacity: 0.8,
					opacity: 0,
					stroke: false
				};
			},
			onEachFeature: (feature, layer) => {
				const score = feature.properties.ndvi_score as number;
				layer.bindTooltip(`NDVI Score: ${Number(score * 100).toFixed(2) || 'N/A'}`);
			}
		}).addTo(map);
		map.fitBounds(layer.getBounds());
		return () => {
			if (layer) {
				layer.remove();
			}
			map.remove();
		};
	});

	function getColor(value: number) {
		return value > 0.5
			? '#001A00'
			: value > 0.3
				? '#003300'
				: value > 0.2
					? '#004D00'
					: value > 0.15
						? '#006600'
						: value > 0.1
							? '#008000'
							: value > 0.05
								? '#339933'
								: value > 0.03
									? '#66B366'
									: '#99CC99';
	}
</script>

<div id="map" class="w-full h-full"></div>
