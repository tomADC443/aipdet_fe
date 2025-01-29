<script lang="ts">
	import { onMount } from 'svelte';
	import L from 'leaflet';
	import type { GeoJSON } from 'geojson';
	import type { FeaturedLayer } from '#routes/app/report/types';

	export let geoData: GeoJSON;
	export let featuredLayer: FeaturedLayer = 'NDVI';
	let gridLayer: L.GeoJSON | null = null;
	let map: L.Map;

	$: if (map && featuredLayer) {
		console.log('Updating layer');
		updateLayer();
	}

	function updateLayer() {
		if (gridLayer) {
			gridLayer.remove();
		}
		if (map) {
			gridLayer = L.geoJSON(geoData, {
				style: (feature) => {
					// Get value from properties to determine color

					const ndviValue = feature?.properties?.ndvi_score;
					const whcValue = feature?.properties?.whc_score;
					const value = featuredLayer === 'NDVI' ? ndviValue : whcValue;
					return {
						fillColor: getColor(value),
						fillOpacity: 0.8,
						opacity: 0.5,
						stroke: true,
						weight: 0.4
					};
				},
				onEachFeature: (feature, layer) => {
					layer.bindTooltip(
						`Full coverage occurrence probability : ${Number((featuredLayer === 'NDVI' ? feature?.properties?.ndvi_score : feature?.properties?.whc_score) * 100).toFixed(2) || 'N/A'} %`
					);
				}
			}).addTo(map);
		}
	}

	onMount(() => {
		map = L.map('heatmap-map').setView([0, 0], 2);

		L.tileLayer('https://tile.jawg.io/jawg-dark/{z}/{x}/{y}{r}.png?access-token={accessToken}', {
			attribution:
				'<a href="https://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
			minZoom: 0,
			maxZoom: 22,
			accessToken: 'iZcdPCK8RIEe0pfME1sGkuIpZayzY0NpPcKswxMi81YuMzbHpJ6T5Yaf3UkgFqpm'
		}).addTo(map);
		updateLayer();
		map.fitBounds(gridLayer!.getBounds());

		return () => {
			if (gridLayer) {
				gridLayer.remove();
			}
			map.remove();
		};
	});

	function getColor(value: number) {
		return value >= 1.0
			? '#570101'
			: value >= 0.7
				? '#CC0000'
				: value >= 0.4
					? '#FF0000'
					: value >= 0.2
						? '#FF3300'
						: value >= 0.2
							? '#FF6600'
							: value >= 0.1
								? '#FF9900'
								: value >= 0.05
									? '#facf23'
									: '#f7f76f';
	}
	function getWHCColor(value: number) {
		return value > 0.5
			? '#800027'
			: value > 0.3
				? '#BF0039'
				: value > 0.2
					? '#DF0043'
					: value > 0.15
						? '#EF0048'
						: value > 0.1
							? '#FF004D'
							: value > 0.05
								? '#FF4073'
								: value > 0.03
									? '#FF8099'
									: '#FFBFBF';
	}
</script>

<div id="heatmap-map" class="rounded-lg border shadow-sm w-full h-full"></div>
