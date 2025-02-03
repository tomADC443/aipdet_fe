<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import CircleUser from 'lucide-svelte/icons/circle-user';
	import { goto } from '$app/navigation';
	import { authenticatedBackendFetch } from '#routes/app/utils';
	import toast from 'svelte-french-toast';
	import type { FetchData } from '#routes/app/types';

	let userEmail = localStorage.getItem('userEmail');

	async function handleLogout() {
		let result: FetchData<null> = {
			status: 'loading',
			data: null
		};
		result = await authenticatedBackendFetch<null>('user/logout', 'POST');
		if (result.status === 'success') {
			toast.success(`Logout successful`);
			goto('/');
		} else {
			toast.error(`Logout failed`);
		}
	}
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder>
		<Button builders={[builder]} variant="secondary" size="icon" class="rounded-full">
			<CircleUser class="h-5 w-5" />
			<span class="sr-only">Toggle user menu</span>
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="end">
		<DropdownMenu.Label>My Account</DropdownMenu.Label>
		{#if userEmail}
			<DropdownMenu.Label>{userEmail}</DropdownMenu.Label>
		{/if}

		<DropdownMenu.Separator />
		<a href="mailto:tom@tpl.dev?subject=Support-Request:AIPDET"
			><DropdownMenu.Item>Support</DropdownMenu.Item></a
		>
		<DropdownMenu.Item
			on:click={() => {
				localStorage.removeItem('userEmail');
				localStorage.removeItem('loginExpires');
				handleLogout();
			}}>Logout</DropdownMenu.Item
		>
	</DropdownMenu.Content>
</DropdownMenu.Root>
