<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import CircleUser from 'lucide-svelte/icons/circle-user';
	import { userPrefersMode } from 'mode-watcher';
	import { onMount } from 'svelte';

	onMount(() => {});
</script>

<!-- 
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
		<DropdownMenu.Item on:click={())}>Logout</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root> -->
