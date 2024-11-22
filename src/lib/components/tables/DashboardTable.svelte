<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import type { Variant as BadgeVariant } from '$lib/components/ui/badge/index.js';
	import type { ButtonProps } from '$lib/components/ui/button/index.js';
	import { updated } from '$app/stores';
	import { Button } from '../ui/button';
	import { selectedProcess } from '../../../routes/app/stores';
	function formatUnixTimestampToUTC(unixTimestamp: number): string {
		const date = new Date(unixTimestamp * 1000);
		return date.toISOString().split('T')[0];
	}

	const orders = [
		{
			id: '1',
			name: 'Guam Lake (Egypt)',
			status: 'Successful',
			createdAt: 1732038666,
			isPublic: false
		},
		{
			id: '2',
			name: 'Lake Tahahm (Tanzania)',
			status: 'Failed',
			createdAt: 1732038666,
			isPublic: true
		},
		{
			id: '3',
			name: 'Test Region',
			status: 'In Progress',
			createdAt: 1732038666,
			isPublic: true
		}
	];

	function getBadgeVariant(status: string): BadgeVariant {
		switch (status) {
			case 'Successful':
				return 'default';
			case 'Failed':
				return 'destructive';
			default:
				return 'outline';
		}
	}

	function getDeleteButtonVariantByStatus(status: string): ButtonProps['variant'] {
		switch (status) {
			default:
				return 'outline';
		}
	}
	function handleSelectClick(id: string) {
		return () => {
			console.log('Selected status:', id);
		};
	}
</script>

<Card.Root
	data-x-chunk-name="dashboard-05-chunk-3"
	data-x-chunk-description="A table of recent orders showing the following columns: Customer, Type, Status, Date, and Amount."
>
	<Card.Header class="px-7">
		<Card.Title>Your Processed Areas</Card.Title>
		<Card.Description>List of all of your processed areas.</Card.Description>
	</Card.Header>
	<Card.Content>
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head>Name</Table.Head>
					<Table.Head>Status</Table.Head>
					<Table.Head class="hidden sm:table-cell">Created</Table.Head>
					<Table.Head class="hidden md:table-cell">Scope</Table.Head>
					<Table.Head>Select</Table.Head>
					<Table.Head>Deletion</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each orders as order}
					<Table.Row class="odd:bg-accent">
						<Table.Cell>
							<div class="font-medium">{order.name}</div>
						</Table.Cell>
						<Table.Cell>
							<Badge class="text-xs" variant={getBadgeVariant(order.status)}>{order.status}</Badge>
						</Table.Cell>
						<Table.Cell class="hidden md:table-cell"
							>{formatUnixTimestampToUTC(order.createdAt)}
						</Table.Cell>
						<Table.Cell class="hidden sm:table-cell"
							>{order.isPublic ? 'PUBLIC' : 'PRIVATE'}
						</Table.Cell>
						<Table.Cell>
							{#if $selectedProcess && $selectedProcess.id === order.id}
								<Button size="sm" variant="secondary">Selected</Button>
							{:else}
								<Button size="sm" variant="outline" on:click={handleSelectClick(order.id)}
									>Select</Button
								>
							{/if}
						</Table.Cell>
						<Table.Cell>
							<Button size="sm" variant={getDeleteButtonVariantByStatus(order.status)}
								>Delete</Button
							>
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</Card.Content>
</Card.Root>
