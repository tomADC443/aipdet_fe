<script lang="ts">
	import { Button } from '$lib/components/ui/button';

	const loginLink = `${import.meta.env.VITE_BASE_URL}/auth/login`;
	const signupLink = `${import.meta.env.VITE_BASE_URL}/auth/signup`;
</script>

<div class="flex justify-center lg:flex-row items-stretch w-full min-h-screen">
	<div class="flex flex-col justify-center items-center lg:basis-1/2 gap-2">
		<div class="flex flex-col items-center">
			<h1 class="text-3xl font-bold">Access</h1>
			<p class="text-muted-foreground text-balance">Log-in or Sign-up to access the app</p>
		</div>
		<div class="gap-4 min-w-80">
			<a href={loginLink}><Button class="w-full">Login</Button></a>
		</div>
		<div class="gap-4 min-w-80">
			<a href={signupLink}><Button class="w-full">Sign-up</Button></a>
		</div>
		<div class="mt-4 text-sm">You will be redirected to the Authentication Provider</div>
	</div>
	<div class="hidden bg-muted lg:flex lg:basis-1/2">
		<img
			src="/src/lib/img/authimg_small.jpg"
			alt="placeholder"
			class="h-full w-full object-cover object-center dark:brightness-[0.7]"
		/>
	</div>
</div>
