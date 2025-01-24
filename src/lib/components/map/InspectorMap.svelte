<script lang="ts">
	import { onMount } from 'svelte';
	import L from 'leaflet';
	import type { GeoJSON } from 'geojson';
	import { COLOR } from '#routes/app/report/constants';

	type inspectorAoiData = {
		name: string;
		geometry: GeoJSON;
	};

	type inspectorRecordData = {
		observed_areas: GeoJSON[];
		ndvi_areas: GeoJSON[];
		whc_areas: GeoJSON[];
	} | null;

	export let aoiData: inspectorAoiData;
	export let recordData: inspectorRecordData;

	let map: L.Map;
	let observedLayer: L.GeoJSON | null = null;
	let ndviLayer: L.GeoJSON | null = null;
	let whcLayer: L.GeoJSON | null = null;

	// Function to update layers
	function updateLayers() {
		// Remove existing layers
		if (observedLayer) {
			observedLayer.remove();
			observedLayer = null;
		}
		if (ndviLayer) {
			ndviLayer.remove();
			ndviLayer = null;
		}
		if (whcLayer) {
			whcLayer.remove();
			whcLayer = null;
		}

		// Add new layers if recordData exists
		if (recordData && map) {
			observedLayer = L.geoJSON(recordData.observed_areas, {
				style: {
					fillColor: COLOR.brightGreenPrimary,
					fillOpacity: 0.1,
					opacity: 0,
					stroke: false
				}
			}).addTo(map);

			ndviLayer = L.geoJSON(recordData.ndvi_areas, {
				style: {
					fillColor: COLOR.ndvi,
					fillOpacity: 0.3,
					opacity: 0,
					stroke: false
				}
			}).addTo(map);

			whcLayer = L.geoJSON(recordData.whc_areas, {
				style: {
					fillColor: COLOR.waterHyacinth,
					fillOpacity: 0.3,
					opacity: 0,
					stroke: false
				}
			}).addTo(map);
		}
	}

	// Watch for changes in recordData
	$: if (map && recordData !== undefined) {
		updateLayers();
	}

	onMount(() => {
		map = L.map('map').setView([0, 0], 2);

		L.tileLayer('https://tile.jawg.io/jawg-light/{z}/{x}/{y}{r}.png?access-token={accessToken}', {
			attribution:
				'<a href="https://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
			minZoom: 0,
			maxZoom: 22,
			accessToken: 'iZcdPCK8RIEe0pfME1sGkuIpZayzY0NpPcKswxMi81YuMzbHpJ6T5Yaf3UkgFqpm'
		}).addTo(map);

		const aoiLayer = L.geoJSON(aoiData.geometry, {
			style: {
				fill: false,
				color: COLOR.brightGreenPrimary,
				weight: 2,
				stroke: true
			}
		}).addTo(map);

		map.fitBounds(aoiLayer.getBounds());

		// Initial layer setup
		updateLayers();

		return () => {
			if (observedLayer) observedLayer.remove();
			if (ndviLayer) ndviLayer.remove();
			if (whcLayer) whcLayer.remove();
			map.remove();
		};
	});
</script>

<div id="map" class="w-full h-96"></div>
