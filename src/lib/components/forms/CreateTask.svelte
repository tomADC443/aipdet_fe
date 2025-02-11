<script lang="ts">
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import CircleAlert from 'lucide-svelte/icons/circle-alert';
	import * as Alert from '$lib/components/ui/alert';
	import { z } from 'zod';
	import { onMount } from 'svelte';
	import toast from 'svelte-french-toast';
	import * as Select from '$lib/components/ui/select';
	import type { AOI } from '#routes/app/aoi/types';
	import * as RadioGroup from '$lib/components/ui/radio-group';
	import type { Selected } from 'bits-ui';
	import { env } from '$env/dynamic/public';
	let isLoading = false;
	let apiError: string | null = null;
	let aois: AOI[] = [];
	let aoiFetchStatus: 'loading' | 'error' | 'success' | 'empty' = 'loading';
	async function fetchAois() {
		try {
			const response = await fetch(env.PUBLIC_VITE_BASE_URL_API + '/api/aois', {
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
					aoiFetchStatus = 'empty';
					toast.error('You need to crate at least one AOI first.');
				} else {
					aoiFetchStatus = 'success';
				}
				return;
			} else {
				aoiFetchStatus = 'error';
				toast.error('Failed to get AOIs. Try again Later.');
				console.error('Response not ok:', response.body);
			}
		} catch (error) {
			aoiFetchStatus = 'error';
			toast.error('Failed to get AOIs. Try again Later.');
			console.error('Error fetching AOIs:', error);
		}
	}

	let newTaskData: NewTaskDataType = {
		name: '',
		aoiId: '',
		isPublic: false
	};

	const newTaskDataSchema = z.object({
		name: z.string().min(2).max(50),
		aoiId: z.string().min(2).max(100),
		isPublic: z.boolean()
	});
	let newTaskDataErrors = {
		name: '' as string | null,
		aoiId: '' as string | null,
		isPublic: '' as string | null
	};

	onMount(() => {
		fetchAois();
	});
	function handleSelectChange(v: Selected<unknown> | undefined) {
		if (v) {
			let value = v.value as string;
			newTaskData.aoiId = value;
		} else {
			newTaskData.aoiId = '';
			return;
		}
		newTaskData.aoiId = v.value as string;
		const zodResult = newTaskDataSchema.safeParse(newTaskData.aoiId);
		if (zodResult.success) {
			newTaskDataErrors.aoiId = null;
			return;
		}
		const issue = zodResult.error.issues.find((i) => i.path[0] === 'aoiId');
		if (issue) {
			newTaskDataErrors.aoiId = issue.message || 'invalid';
		}
	}

	async function handleSubmit(event: Event) {
		event.preventDefault();
		const zodResult = newTaskDataSchema.safeParse(newTaskData);
		if (!zodResult.success) {
			const issues = zodResult.error.issues;
			issues.forEach((issue) => {
				const field = issue.path[0] as keyof NewTaskDataType;
				newTaskDataErrors[field] = String(issue.message);
			});
			return;
		}
		isLoading = true;
		apiError = null; // Clear previous errors before making the API call

		try {
			const apiResponse = await fetch(env.PUBLIC_VITE_BASE_URL_API + '/api/task', {
				method: 'POST',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
					Connection: 'keep-alive'
				},
				body: JSON.stringify(newTaskData)
			});

			if (apiResponse.ok) {
				const responseData = await apiResponse.json();
				const userId = responseData.userId;
				newTaskData = {
					name: '',
					aoiId: '',
					isPublic: false
				};
				newTaskDataErrors = {
					name: null,
					aoiId: null,
					isPublic: null
				};
				toast.success('Task created successfully.');
				isLoading = false;
				return;
			} else {
				console.error('Response not ok:', apiResponse.body);
				toast.error('Failed to create Task. Try again Later.');
				apiError = 'Failed to create Task. Try again Later.';
			}
		} catch (error) {
			console.error(error);
			toast.error('Failed to create Task. Try again Later.');
			apiError = 'Failed to create Task. Try again Later.';
		} finally {
			isLoading = false;
		}
	}

	type NewTaskDataType = z.infer<typeof newTaskDataSchema>;

	function handleInputChange(field: keyof NewTaskDataType, value: string) {
		const zodResult = newTaskDataSchema.safeParse(newTaskData);
		if (zodResult.success) {
			newTaskDataErrors[field] = null;
			return;
		}
		const issue = zodResult.error.issues.find((i) => i.path[0] === field);
		if (issue) {
			newTaskDataErrors[field] = issue.message || 'invalid';
		} else {
			newTaskDataErrors[field] = null;
		}
	}
	function getInputValue(event: Event): string {
		return (event.target as HTMLInputElement)?.value || '';
	}
	function handleRadioChange(e: string) {
		if (e === 'public') {
			newTaskData.isPublic = true;
			return;
		} else {
			newTaskData.isPublic = false;
			return;
		}
	}
</script>

<div class="w-full h-full lg:grid lg:grid-cols-2">
	<div class="flex items-center justify-center py-12">
		<form class="mx-auto grid w-[350px] gap-6">
			<div class="grid gap-4">
				<div class="grid gap-2">
					<div class="grid gap-2">
						<Label for="name">Name</Label>
						<Input
							id="name"
							placeholder="My New Task"
							required
							bind:value={newTaskData.name}
							on:input={(e) => handleInputChange('name', getInputValue(e))}
						/>
						{#if newTaskDataErrors.name}
							<span class="text-red-500 text-xs">{newTaskDataErrors.name}</span>
						{/if}
					</div>
				</div>
				<div class="grid gap-2">
					<Label for="AOI">Area of Interest (AOI)</Label>
					<Select.Root onSelectedChange={(v) => handleSelectChange(v)}>
						<Select.Trigger class="w-[180px]">
							<Select.Value placeholder="Select an AOI" />
						</Select.Trigger>
						<Select.Content>
							{#each aois as aoi}
								<Select.Item value={aoi.id}>{aoi.name}</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>

					{#if newTaskDataErrors.aoiId}
						<span class="text-red-500 text-xs">{newTaskDataErrors.aoiId}</span>
					{/if}
				</div>
				<div class="grid gap-2">
					<Label for="isPublic">Scope</Label>
					<RadioGroup.Root value="private" onValueChange={(e) => handleRadioChange(e)}>
						<div class="flex items-center space-x-2">
							<RadioGroup.Item value="private" id="private" />
							<Label for="private">Private</Label>
						</div>
						<div class="flex items-center space-x-2">
							<RadioGroup.Item value="public" id="public" />
							<Label for="public">Public</Label>
						</div>
					</RadioGroup.Root>

					{#if newTaskDataErrors.isPublic}
						<span class="text-red-500 text-xs">{newTaskDataErrors.isPublic}</span>
					{/if}
				</div>
				{#if isLoading}
					<Button disabled class="w-full mt-6">
						<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
						Please wait
					</Button>
				{:else}
					<Button on:click={handleSubmit} type="submit" class="w-full mt-6">Create Task</Button>
				{/if}
			</div>

			{#if apiError}
				<Alert.Root variant="destructive">
					<CircleAlert class="h-4 w-4" />
					<Alert.Title>Error</Alert.Title>
					<Alert.Description>{apiError}</Alert.Description>
				</Alert.Root>
			{/if}
		</form>
	</div>
</div>
