<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { login, signup } from './service';

	async function handleLoginClick() {
		await login();
	}
	async function handleSingUpClick() {
		await signup();
	}
</script>

<div class="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
	<div class="flex items-center justify-center py-12">
		<div class="mx-auto grid w-[350px] gap-6">
			<div class="grid gap-2 text-center">
				<h1 class="text-3xl font-bold">Access</h1>
				<p class="text-muted-foreground text-balance">Log-in or Sign-up to access the app</p>
			</div>
			<div class="grid gap-4">
				<Button on:click={handleLoginClick} class="w-full">Log-in</Button>
			</div>
			<div class="grid gap-4">
				<Button on:click={handleSingUpClick} class="w-full">Sign-in</Button>
			</div>
			<div class="mt-4 text-center text-sm">
				You will be redirected to the Authentication Provider
			</div>
		</div>
	</div>
	<div class="bg-muted hidden lg:block">
		<img
			src="/src/lib/img/authimg.jpg"
			alt="placeholder"
			width="1920"
			height="1080"
			class="h-full w-full object-cover dark:brightness-[0.7]"
		/>
	</div>
</div>
