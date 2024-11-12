<script lang="ts">
	import Nav from '$lib/components/navigation/nav/Nav.svelte';
	import NavMobile from '$lib/components/navigation/nav/NavMobile.svelte';
	import { ModeWatcher } from 'mode-watcher';
</script>

<ModeWatcher />;
<div class="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
	<NavMobile />
	<div class="flex flex-col">
		<Nav />
		<main class="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
			<slot />
		</main>
	</div>
</div>
