<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { auth0, login, signup } from './service';

	async function handleLoginClick() {
		await login();
	}
	async function handleSingUpClick() {
		await signup();
	}
</script>

<div class="flex justify-center lg:flex-row items-stretch w-full min-h-screen">
	<div class="flex flex-col justify-center items-center lg:basis-1/2 gap-2">
		<div class="flex flex-col items-center">
			<h1 class="text-3xl font-bold">Access</h1>
			<p class="text-muted-foreground text-balance">Log-in or Sign-up to access the app</p>
		</div>
		<div class="gap-4 min-w-80">
			<Button on:click={handleLoginClick} class="w-full">Log-in</Button>
		</div>
		<div class="gap-4 min-w-80">
			<Button on:click={handleSingUpClick} class="w-full">Sign-in</Button>
		</div>
		<div class="mt-4 text-sm">You will be redirected to the Authentication Provider</div>
	</div>
	<div class="hidden bg-muted lg:flex lg:basis-1/2">
		<img
			src="/src/lib/img/authimg.jpg"
			alt="placeholder"
			class="h-full w-full object-cover object-center dark:brightness-[0.7]"
		/>
	</div>
</div>
