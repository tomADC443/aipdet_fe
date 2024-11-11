<script lang="ts">
	import Bell from 'lucide-svelte/icons/bell';
	import Leaf from 'lucide-svelte/icons/leaf';

	import { page } from '$app/stores';

	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { getNavFromPath } from '../utils';
	import { navItems } from '../constants';

	let route: string | undefined;
	$: route = getNavFromPath($page.url.pathname);
</script>

<div class="bg-muted/40 hidden border-r md:block">
	<div class="flex h-full max-h-screen flex-col gap-2">
		<div class="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
			<a href="/" class="flex items-center gap-2 font-semibold">
				<Leaf class="h-6 w-6" />
				<span class="">SINT</span>
			</a>
			<Button variant="outline" size="icon" class="ml-auto h-8 w-8">
				<Bell class="h-4 w-4" />
				<span class="sr-only">Toggle notifications</span>
			</Button>
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
		<div class="mt-auto p-4">
			<Card.Root>
				<Card.Header class="p-2 pt-0 md:p-4">
					<Card.Title>Upgrade to Pro</Card.Title>
					<Card.Description>
						Unlock all features and get unlimited access to our support team.
					</Card.Description>
				</Card.Header>
				<Card.Content class="p-2 pt-0 md:p-4 md:pt-0">
					<Button size="sm" class="w-full">Upgrade</Button>
				</Card.Content>
			</Card.Root>
		</div>
	</div>
</div>
