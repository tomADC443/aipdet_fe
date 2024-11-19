<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import CircleUser from 'lucide-svelte/icons/circle-user';
	import { getUser, logout } from '../../../routes/auth/service';
	import { userPrefersMode } from 'mode-watcher';
	import type { User } from '@auth0/auth0-spa-js';
	import { onMount } from 'svelte';

	let user: User | undefined = undefined;
	onMount(() => {
		user = getUser();
	});
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder>
		<Button builders={[builder]} variant="secondary" size="icon" class="rounded-full">
			<CircleUser class="h-5 w-5" />
			<span class="sr-only">Toggle user menu</span>
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="end">
		<DropdownMenu.Label
			>{#if user?.name || user?.nickname}{user?.name || user?.nickname}{:else}My Account
			{/if}</DropdownMenu.Label
		>
		<DropdownMenu.Separator />
		<a href="mailto:tom@tpl.dev?subject=Support-Request:AIPDET"
			><DropdownMenu.Item>Support</DropdownMenu.Item></a
		>
		<DropdownMenu.Item on:click={logout}>Logout</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
