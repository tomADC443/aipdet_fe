<script lang="ts">
	import Menu from 'lucide-svelte/icons/menu';
	import Leaf from 'lucide-svelte/icons/leaf';
	import Search from 'lucide-svelte/icons/search';
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button/index.js';
	import AccountButton from '$lib/components/navigation/AccountButton.svelte';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import { getNavFromPath } from '../utils';
	import { navItems } from '../constants';
	import NotLoggedInCardMobile from '../../cards/NotLoggedInCardMobile.svelte';
	import { isLoggedIn } from '#app/stores';
	import ThemeButton from '../ThemeButton.svelte';

	let route: string | undefined;
	$: route = getNavFromPath($page.url.pathname);
</script>

<header class="bg-muted/40 flex h-14 items-center gap-4 border-b px-4 lg:h-[60px] lg:px-6">
	<Sheet.Root>
		<Sheet.Trigger asChild let:builder>
			<Button variant="outline" size="icon" class="shrink-0 md:hidden" builders={[builder]}>
				<Menu class="h-5 w-5" />
				<span class="sr-only">Toggle navigation menu</span>
			</Button>
		</Sheet.Trigger>
		<Sheet.Content side="left" class="flex flex-col">
			<nav class="grid gap-2 text-lg font-medium">
				<a href="/" class="flex items-center gap-2 text-lg font-semibold">
					<Leaf class="h-6 w-6" />
					<span>SINT</span>
				</a>

				{#each navItems as { site, href, icon: Icon, label }}
					{#if site === route}
						<a
							{href}
							class="bg-muted text-foreground hover:text-foreground mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2"
						>
							<Icon class="h-5 w-5" />
							{label}
						</a>
					{:else}
						<a
							{href}
							class="text-muted-foreground hover:text-foreground mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2"
						>
							<Icon class="h-5 w-5" />
							{label}
						</a>
					{/if}
				{/each}
			</nav>
			{#if !$isLoggedIn}
				<div class="mt-auto">
					<NotLoggedInCardMobile />
				</div>
			{/if}
		</Sheet.Content>
	</Sheet.Root>
	<div class="w-full flex-1">
		<form>
			<div class="relative">
				<Search class="text-muted-foreground absolute left-2.5 top-2.5 h-4 w-4" />
				<Input
					type="search"
					placeholder="Search products..."
					class="bg-background w-full appearance-none pl-8 shadow-none md:w-2/3 lg:w-1/3"
				/>
			</div>
		</form>
	</div>
	<ThemeButton />
	{#if $isLoggedIn}
		<AccountButton />
	{/if}
</header>
