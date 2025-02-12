<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';

	import { Badge } from '$lib/components/ui/badge/index.js';
	import {
		newAoiDataDescriptionSchema,
		newAoiDataGeometrySchema,
		newAoiDataNameSchema
	} from '#app/aoi/schema';
	import { Input } from '$lib/components/ui/input/index.ts';
	import type { FormInputEvent } from '$lib/components/ui/input/index.ts';
	import type { FormTextareaEvent } from '$lib/components/ui/textarea/index.ts';
	import * as turf from '@turf/turf';
	import { MAX_AREA_SKM, MIN_AREA_SKM } from '#app/aoi/constants';
	import toast from 'svelte-french-toast';
	import { env } from '$env/dynamic/public';

	type NewAoiDataType = {
		name: { value: string; valid: boolean; error: string };
		description: { value: string; valid: boolean; error: string };
		geoJson: { value: string; valid: boolean; error: string };
	};

	let newAoiData: NewAoiDataType = {
		name: { value: '', valid: false, error: '' },
		description: { value: '', valid: true, error: '' },
		geoJson: { value: '', valid: false, error: '' }
	};

	type ComputedNewAoiDataType = {
		surfaceArea: number | null;
		perimeter: number | null;
	};

	let computedNewAoiData: ComputedNewAoiDataType = {
		surfaceArea: null,
		perimeter: null
	};
	let isLoading = false;

	async function handleAoiSubmit() {
		isLoading = true;
		const zodResultName = newAoiDataNameSchema.safeParse(newAoiData.name.value);
		const zodResultDescription = newAoiDataDescriptionSchema.safeParse(
			newAoiData.description.value
		);
		const zodResultGeometry = newAoiDataGeometrySchema.safeParse(safeParseJsonGeometry());

		if (!zodResultName.success || !zodResultDescription.success || !zodResultGeometry.success) {
			toast.error('Invalid input data');
			isLoading = false;
			return;
		}

		try {
			const response = await fetch(env.PUBLIC_VITE_BASE_URL_API + '/api/aoi', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Connection: 'keep-alive'
				},
				body: JSON.stringify({
					name: newAoiData.name.value,
					description: newAoiData.description.value,
					geometry: JSON.parse(newAoiData.geoJson.value)
				}),
				credentials: 'include'
			});

			if (response.ok) {
				newAoiData = {
					name: { value: '', valid: false, error: '' },
					description: { value: '', valid: true, error: '' },
					geoJson: { value: '', valid: false, error: '' }
				};

				toast.success('AOI saved successfully');
			} else {
				console.error('An error occurred', response);
				toast.error('An error occurred. Please try again later.');
			}
		} catch (error) {
			console.error('An error occurred', error);
			toast.error('An error occurred. Please try again later.');
		} finally {
			isLoading = false;
		}
	}

	function handleNameChange(event: FormInputEvent<Event>) {
		const target = event.target as HTMLInputElement;
		const zodResult = newAoiDataNameSchema.safeParse(newAoiData.name.value);
		newAoiData.name.valid = zodResult.success;
		newAoiData.name.error = zodResult.error?.issues[0].message || 'invalid';
	}
	function handleDescriptionChange(event: FormTextareaEvent<Event>) {
		const target = event.target as HTMLTextAreaElement;

		const zodResult = newAoiDataDescriptionSchema.safeParse(newAoiData.description.value);
		newAoiData.description.valid = zodResult.success;
		newAoiData.description.error = zodResult.error?.issues[0].message || 'invalid';
	}

	function handleGeoJsonChange(event: FormTextareaEvent<Event>) {
		//checking against the schema (for improved error message)
		const target = event.target as HTMLTextAreaElement;
		var parsedJson = safeParseJsonGeometry() as unknown as any;
		const zodResult = newAoiDataGeometrySchema.safeParse(parsedJson);
		newAoiData.geoJson.valid = zodResult.success;
		if (!newAoiData.geoJson.valid) {
			newAoiData.geoJson.valid = false;
			newAoiData.geoJson.error =
				`${zodResult.error?.issues[0].path} - ${zodResult.error?.issues[0].message}` || 'invalid';
			console.log('zod Error', zodResult);
			return;
		}
		//parsing to Polygon)
		var polygon = turf.polygon(parsedJson.geometry.coordinates);
		if (!turf.booleanValid(polygon)) {
			newAoiData.geoJson.valid = false;
			newAoiData.geoJson.error = 'invalid GeoJSON';
			return;
		}

		//Result in square meters --> calculate area in square kilometers
		const surfaceArea = turf.area(polygon) / 1000000;
		if (surfaceArea > MAX_AREA_SKM) {
			newAoiData.geoJson.valid = false;
			newAoiData.geoJson.error = `Area too large: ${surfaceArea}km² - (max ${MAX_AREA_SKM}km²)`;
			return;
		}
		if (surfaceArea < MIN_AREA_SKM) {
			newAoiData.geoJson.valid = false;
			newAoiData.geoJson.error = `Area too small: ${surfaceArea}km² - (min ${MIN_AREA_SKM}km²)`;
			return;
		}
		newAoiData.geoJson.valid = true;
		computedNewAoiData = {
			surfaceArea: turf.round(surfaceArea, 2),
			perimeter: turf.round(turf.length(turf.polygonToLine(polygon), { units: 'kilometers' }), 2)
		};
	}
	function safeParseJsonGeometry(): undefined | Object {
		try {
			var parsedJson = JSON.parse(newAoiData.geoJson.value);
		} catch (error) {
			newAoiData.geoJson.valid = false;
			newAoiData.geoJson.error = 'invalid JSON';
			return;
		}
		return parsedJson;
	}
</script>

<div class="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
	<div class="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
		<!-- <div class="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8"> -->
		<form class="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
			<Card.Root>
				<Card.Header>
					<Card.Title>General</Card.Title>
					<Card.Description
						>Add the name and description of the new Area Of Interest (AOI).</Card.Description
					>
				</Card.Header>
				<Card.Content>
					<div class="grid gap-6">
						<div class="grid gap-3">
							<div class="flex justify-between items-center">
								<Label for="name">Name</Label>
								{#if newAoiData.name.valid}
									<Badge variant="default">valid</Badge>
								{:else}
									<Badge variant="destructive">{newAoiData.name.error || 'required'}</Badge>
								{/if}
							</div>
							<Input
								on:input={handleNameChange}
								bind:value={newAoiData.name.value}
								id="name"
								type="text"
								class="w-full"
								placeholder="Add a name here..."
							/>
						</div>
						<div class="grid gap-3">
							<div class="flex justify-between items-center">
								<Label for="description">Description</Label>
								{#if newAoiData.description.valid}
									<Badge variant="default">valid (not required)</Badge>
								{:else}
									<Badge variant="destructive">{newAoiData.description.error || 'invalid'}</Badge>
								{/if}
							</div>

							<Textarea
								on:input={handleDescriptionChange}
								id="description"
								placeholder="Add a description here..."
								class="min-h-32"
								bind:value={newAoiData.description.value}
							/>
						</div>
					</div>
				</Card.Content>
			</Card.Root>
			<Card.Root>
				<Card.Header>
					<Card.Title>Location</Card.Title>
					<Card.Description
						>Use this section to specify the location of the area. Use a GeoJSON Polygon Feature to
						specify the target area. Only use the standard WGS84 longitude, latitude coordinates.
						Websites like <a
							href="https://geojson.io/"
							target="_blank"
							rel="noopener"
							class="text-primary">geojson.io</a
						>
						can help you create the GeoJson Polygon. <br /> Remember to only insert one Feature not
						a FeatureCollection.<br />
						AOIs should not exceed {MAX_AREA_SKM}km² and should be at least be {MIN_AREA_SKM} km² big.
					</Card.Description>
				</Card.Header>
				<Card.Content>
					<div class="grid gap-6">
						<div class="grid gap-3">
							<div class="flex justify-between items-center">
								<Label for="geoJson">GeoJSON Feature</Label>
								{#if newAoiData.geoJson.valid}
									<Badge variant="default">valid</Badge>
								{:else}
									<Badge variant="destructive">{newAoiData.geoJson.error || 'required'}</Badge>
								{/if}
							</div>
							<Textarea
								class="min-h-56"
								id="description"
								placeholder={` { "type":Feature", "proerties": ... `}
								on:input={handleGeoJsonChange}
								bind:value={newAoiData.geoJson.value}
							></Textarea>
						</div>
					</div>
				</Card.Content>
			</Card.Root>
		</form>

		<div class="grid auto-rows-max items-start gap-4 lg:gap-8">
			<Card.Root>
				<Card.Header>
					<Card.Title>Overview</Card.Title>
					<Card.Description>Summary of your new AOI.</Card.Description>
				</Card.Header>
				<Card.Content>
					<div class="grid gap-6">
						<ul class="grid gap-3">
							<li class="flex items-center justify-between">
								<span class="text-muted-foreground">Name</span>
								<span>{newAoiData.name.valid ? newAoiData.name.value : ''}</span>
							</li>
							<li class="flex items-center justify-between">
								<span class="text-muted-foreground">Description</span>
								<span
									>{newAoiData.description.value
										? newAoiData.description.value.substring(0, 12) + '...'
										: ''}</span
								>
							</li>
							<li class="flex items-center justify-between">
								<span class="text-muted-foreground">Area</span>
								<span
									>{newAoiData.geoJson.valid
										? String(computedNewAoiData.surfaceArea) + ' km²'
										: ''}</span
								>
							</li>
							<li class="flex items-center justify-between">
								<span class="text-muted-foreground"> Perimeter </span>
								<span
									>{newAoiData.geoJson.valid ? String(computedNewAoiData.perimeter) + ' km' : ''}
								</span>
							</li>
						</ul>
					</div>
				</Card.Content>
			</Card.Root>
			<div class="grid">
				{#if isLoading}
					<Button disabled class="">
						<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
						Please wait
					</Button>
				{:else}
					<Button on:click={handleAoiSubmit}>Save AOI</Button>
				{/if}
			</div>
		</div>
	</div>
</div>
