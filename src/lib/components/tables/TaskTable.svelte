<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import type { Variant as BadgeVariant } from '$lib/components/ui/badge/index.js';
	import type { ButtonProps } from '$lib/components/ui/button/index.js';
	import { Button } from '../ui/button';
	import { selectedTask } from '#app/stores';
	import type { Task } from '#routes/app/task/types';
	function formatUnixTimestampToUTC(unixTimestamp: number): string {
		const date = new Date(unixTimestamp * 1000);
		return date.toISOString().split('T')[0];
	}
	export let tasks: Task[] = [];

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
	data-x-chunk-description="A table of recent tasks showing the following columns: Customer, Type, Status, Date, and Amount."
>
	<Card.Header class="px-7">
		<Card.Title>Your Processed Areas</Card.Title>
		<Card.Description>List of all of your areas.</Card.Description>
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
				{#each tasks as task}
					<Table.Row class="odd:bg-accent">
						<Table.Cell>
							<div class="font-medium">{task.name}</div>
						</Table.Cell>
						<Table.Cell>
							<Badge class="text-xs" variant={getBadgeVariant(task.status)}>{task.status}</Badge>
						</Table.Cell>
						<Table.Cell class="hidden md:table-cell"
							>{formatUnixTimestampToUTC(task.createdAt)}
						</Table.Cell>
						<Table.Cell class="hidden sm:table-cell"
							>{task.isPublic ? 'PUBLIC' : 'PRIVATE'}
						</Table.Cell>
						<Table.Cell>
							{#if $selectedTask && $selectedTask.id === task.id}
								<Button size="sm" variant="secondary">Selected</Button>
							{:else}
								<Button size="sm" variant="outline" on:click={handleSelectClick(task.id)}
									>Select</Button
								>
							{/if}
						</Table.Cell>
						<Table.Cell>
							<Button size="sm" variant={getDeleteButtonVariantByStatus(task.status)}>Delete</Button
							>
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</Card.Content>
</Card.Root>
