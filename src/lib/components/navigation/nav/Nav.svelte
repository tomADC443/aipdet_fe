<script lang="ts">
	import Bell from 'lucide-svelte/icons/bell';
	import Leaf from 'lucide-svelte/icons/leaf';

	import { page } from '$app/stores';
	import NotLoggedInCard from '$lib/components/cards/NotLoggedInCardMobile.svelte';

	import { Button } from '$lib/components/ui/button/index.js';
	import { getNavFromPath } from '../utils';
	import { navItems } from '../constants';
	import { isLoggedIn } from '#app/stores';

	let route: string | undefined;
	$: route = getNavFromPath($page.url.pathname);
</script>

<div class="bg-muted/95 hidden border-r md:block sticky top-0 h-screen">
	<div class="flex h-full max-h-screen flex-col gap-2">
		<div class="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
			<a href="/" class="flex items-center gap-2 font-semibold">
				<Leaf class="h-6 w-6" />
				<span class="">AIPDET</span>
			</a>
		</div>
		<div class="flex-1">
			<nav class="grid items-start px-2 text-sm font-medium lg:px-4">
				{#each navItems as { site, href, icon: Icon, label }}
					{#if site === route}
						<a
							{href}
							class="bg-muted text-primary hover:text-primary flex items-center gap-3 rounded-lg px-3 py-2 transition-all"
						>
							<Icon class="h-5 w-5" />
							{label}
						</a>
					{:else}
						<a
							{href}
							class="text-muted-foreground hover:text-primary flex items-center gap-3 rounded-lg px-3 py-2 transition-all"
						>
							<Icon class="h-5 w-5" />
							{label}
						</a>
					{/if}
				{/each}
			</nav>
		</div>
		{#if !$isLoggedIn}
			<div class="mt-auto p-4">
				<NotLoggedInCard />
			</div>
		{/if}
	</div>
</div>
