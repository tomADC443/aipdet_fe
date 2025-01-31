<script lang="ts">
	import * as Table from '$lib/components/ui/table/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import type { Variant as BadgeVariant } from '$lib/components/ui/badge/index.js';
	import type { ButtonProps } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Button } from '$lib/components/ui/button/index.js';

	import { selectedTask } from '#app/stores';
	import type { Task } from '#routes/app/task/types';
	import toast from 'svelte-french-toast';
	import { TaskStatus } from '#routes/app/task/constants';
	import BanIcon from 'lucide-svelte/icons/ban';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';

	export let tasks: Task[] = [];
	export let handleDeleteClick;
	export let handleSelectClick;

	function formatUnixTimestampToUTC(unixTimestamp: number): string {
		const date = new Date(unixTimestamp * 1000);
		return date.toISOString().split('T')[0];
	}
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
</script>

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
				<Table.Cell class="hidden sm:table-cell">{task.isPublic ? 'PUBLIC' : 'PRIVATE'}</Table.Cell>
				<Table.Cell>
					{#if $selectedTask && $selectedTask.id === task.id}
						<Button size="sm" variant="secondary">Selected</Button>
					{:else if task.status === TaskStatus.Successful}
						<Button size="sm" variant="outline" on:click={() => handleSelectClick(task.id)}
							>Select</Button
						>
					{:else}
						<Tooltip.Root>
							<Tooltip.Trigger>
								<Button size="icon" variant="outline" disabled>
									<BanIcon />
								</Button>
							</Tooltip.Trigger>
							<Tooltip.Content>
								<p>Status needs to be "Successful"</p>
							</Tooltip.Content>
						</Tooltip.Root>
					{/if}
				</Table.Cell>
				<Table.Cell>
					<Button
						size="sm"
						on:click={() => handleDeleteClick(task.id)}
						variant={getDeleteButtonVariantByStatus(task.status)}>Delete</Button
					>
				</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>
