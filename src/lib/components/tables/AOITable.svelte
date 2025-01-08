<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import type { AOI } from '#app/aoi/types';
	import toast from 'svelte-french-toast';
	import { onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button';

	import { Skeleton } from '$lib/components/ui/skeleton/index.js';
	import { formatUnixTimestampToLocalTime } from '#routes/app/utils';

	let aois: AOI[] = [];
	let status: 'loading' | 'success' | 'empty' | 'error' = 'loading';
	onMount(() => {
		fetchAois();
	});

	async function fetchAois() {
		status = 'loading';
		try {
			const response = await fetch(import.meta.env.VITE_BASE_URL_API + '/api/aois', {
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
					Connection: 'keep-alive'
				}
			});
			const data = await response.json();

			if (response.ok) {
				aois = data.aois;
				if (aois.length === 0) {
					status = 'empty';
				} else {
					status = 'success';
				}
				return;
			} else {
				status = 'error';
				toast.error('Failed to get AOIs. Try again Later.');
				console.error('Response not ok:', response.body);
			}
		} catch (error) {
			status = 'error';
			toast.error('Failed to get AOIs. Try again Later.');
			console.error('Error fetching AOIs:', error);
		}
	}

	async function handleAoiDelete(id: string) {
		try {
			const response = await fetch(import.meta.env.VITE_BASE_URL_API + '/api/aoi', {
				method: 'DELETE',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
					Connection: 'keep-alive'
				},
				body: JSON.stringify({ id })
			});

			if (response.ok) {
				aois = aois.filter((aoi) => aoi.id !== id);
				toast.success('AOI deleted successfully.');
				return;
			} else {
				toast.error('Failed to delete AOI. Try again Later.');
				console.error('Response not ok:', response.body);
			}
		} catch (error) {
			toast.error('Failed to delete AOI. Try again Later.');
			console.error('Error deleting AOIs:', error);
		}
	}
</script>

<!-- LOADING State -->
{#if status === 'loading'}
	<Card.Root>
		<Card.Header class="px-7">
			<Card.Title>Getting your AOIs...</Card.Title>
		</Card.Header>
		<Card.Content>
			<div class="flex flex-col gap-2">
				<Skeleton class="h-4 w-[500px]" />
				<Skeleton class="h-4 w-[500px]" />
				<Skeleton class="h-4 w-[500px]" />
			</div>
		</Card.Content>
	</Card.Root>

	<!-- Success State -->
{:else if status === 'success'}
	<Card.Root>
		<Card.Header class="px-7">
			<Card.Title>Your Areas of Interest</Card.Title>
			<Card.Description>List of all of your areas.</Card.Description>
		</Card.Header>
		<Card.Content>
			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.Head>ID</Table.Head>
						<Table.Head>Name</Table.Head>
						<Table.Head class="hidden sm:table-cell">Description</Table.Head>
						<Table.Head class="hidden md:table-cell">Created at</Table.Head>

						<Table.Head>Deletion</Table.Head>
					</Table.Row>
				</Table.Header>

				<Table.Body>
					{#each aois as aoi}
						<Table.Row>
							<Table.Cell>
								{aoi.id}
							</Table.Cell>
							<Table.Cell>
								{aoi.name}
							</Table.Cell>
							<Table.Cell>
								{aoi.description}
							</Table.Cell>
							<Table.Cell class="hidden md:table-cell">
								{formatUnixTimestampToLocalTime(aoi.createdAt)}
							</Table.Cell>
							<Table.Cell>
								<Button size="sm" variant="outline" on:click={() => handleAoiDelete(aoi.id)}
									>Delete</Button
								>
							</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		</Card.Content>
	</Card.Root>
	<!-- EMPTY state -->
{:else if status === 'empty'}
	<Card.Root>
		<Card.Header class="px-7">
			<Card.Title>Your Areas of Interest</Card.Title>
			<Card.Description>List of all of your areas.</Card.Description>
		</Card.Header>
		<Card.Content>
			<div class="text-center py-4">
				<h3 class="text-lg font-semibold">No Areas of Interest Found</h3>
				<p class="text-sm text-gray-500">
					You currently don’t have any processed areas. Start creating new areas to see them here.
				</p>
			</div>
		</Card.Content>
	</Card.Root>
	<!-- ERROR state -->
{:else if status === 'error'}
	<Card.Root>
		<Card.Header class="px-7"></Card.Header>
		<Card.Content>
			<div class="text-center py-4">
				<h3 class="text-lg font-semibold">No Areas of Interest Found</h3>
				<p class="text-sm text-gray-500">
					There was an error fetching your areas. Please try again later.
				</p>
			</div>
		</Card.Content>
	</Card.Root>
{/if}
