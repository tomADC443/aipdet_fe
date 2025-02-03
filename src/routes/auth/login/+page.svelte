<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { goto } from '$app/navigation'; // For navigation
	import CircleAlert from 'lucide-svelte/icons/circle-alert';
	import * as Alert from '$lib/components/ui/alert';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';
	import { z } from 'zod';

	// State for API error message
	let apiError: null | string = null;
	let isLoading = false;

	let emailErrorMessage = '';
	const emailSchema = z.string().email();
	let email = '';
	let password = '';

	function handleEmailInput(event: Event) {
		const input = event.target as HTMLInputElement;
		const zodResult = emailSchema.safeParse(input.value);
		email = input.value;
		if (!zodResult.success) {
			emailErrorMessage = zodResult.error.issues[0].message;
		} else {
			emailErrorMessage = '';
		}
	}

	// Login handler
	async function handleLogin() {
		isLoading = true;
		// Clear previous errors
		apiError = null;

		const zodResult = emailSchema.safeParse(email);

		if (!zodResult.success) {
			isLoading = false;
			return;
		}
		try {
			const response = await fetch(import.meta.env.VITE_BASE_URL_API + '/api/user/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Connection: 'keep-alive'
				},
				body: JSON.stringify({ email, password }),
				credentials: 'include'
			});

			if (response.ok) {
				const payload = await response.json();
				localStorage.setItem('loginExpires', String(payload.expires));
				localStorage.setItem('userEmail', String(payload.data.email));
				// Login successful
				goto('/app/aoi'); // Redirect user to the aoi
			} else {
				const error = await response.json();

				// Handle specific error messages
				if (error.detail === 'Email not verified.') {
					goto('/email-verification'); // Redirect to email verification page
				} else {
					apiError = error.detail || 'An unexpected error occurred.'; // Display other errors
				}
			}
		} catch (err) {
			// Handle network or unexpected errors
			apiError = 'Unable to connect to the server. Please try again later.';
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="w-full h-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
	<div class="flex items-center justify-center py-12">
		<div class="mx-auto grid w-[350px] gap-6">
			<div class="grid gap-2 text-center">
				<h1 class="text-3xl font-bold">Login</h1>
				<p class="text-muted-foreground text-balance">
					Enter your email below to login to your account
				</p>
			</div>
			<div class="grid gap-4">
				<div class="grid gap-2">
					<Label for="email">Email</Label>
					<Input
						id="email"
						type="email"
						placeholder="m@example.com"
						on:input={handleEmailInput}
						required
					/>
					{#if emailErrorMessage}
						<span class="text-red-500 text-xs">{emailErrorMessage}</span>
					{/if}
				</div>
				<div class="grid gap-2">
					<div class="flex items-center">
						<Label for="password">Password</Label>
						<a href="/auth/reset-password" class="ml-auto inline-block text-sm underline">
							Forgot your password?
						</a>
					</div>
					<Input id="password" type="password" bind:value={password} required />
				</div>
				{#if isLoading}
					<Button disabled class="w-full">
						<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
						Please wait
					</Button>
				{:else}
					<Button type="button" class="w-full" on:click={handleLogin}>Login</Button>
				{/if}
			</div>
			<div class="mt-4 text-center text-sm">
				Don&apos;t have an account?
				<a href="/auth/signup" class="underline"> Sign up </a>
			</div>
			{#if apiError}
				<Alert.Root variant="destructive">
					<CircleAlert class="h-4 w-4" />
					<Alert.Title>Error</Alert.Title>
					<Alert.Description>{apiError}</Alert.Description>
				</Alert.Root>
			{/if}
		</div>
	</div>
	<div class="hidden bg-muted lg:flex lg:basis-1/2">
		<img
			src="$lib/img/authimg_small.jpg"
			alt="satellite landscape of a river"
			class="h-full w-full object-cover object-center dark:brightness-[0.7]"
		/>
	</div>
</div>
