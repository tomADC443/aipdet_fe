<script lang="ts">
	export const ssr = false;
	import { Button } from '$lib/components/ui/button/index.js';
	import { login } from './service';

	async function handleLoginClick() {
		await login();
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
				<Button on:click={handleLoginClick} variant="outline" class="w-full">Log-in</Button>
				<Button variant="outline" class="w-full">Sign-up</Button>
			</div>
			<div class="mt-4 text-center text-sm">
				Don&apos;t have an account?
				<a href="##" class="underline"> Sign up </a>
			</div>
		</div>
	</div>
	<div class="bg-muted hidden lg:block">
		<img
			src="/src/lib/img/wh.jpg"
			alt="placeholder"
			width="1920"
			height="1080"
			class="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
		/>
	</div>
</div>
