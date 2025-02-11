<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { goto } from '$app/navigation'; // For navigation
	import CircleAlert from 'lucide-svelte/icons/circle-alert';
	import * as Alert from '$lib/components/ui/alert';
	import { z } from 'zod';
	import { onMount } from 'svelte';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';
	import { env } from '$env/dynamic/public';
	import authImg from '$lib/img/authimg_small.jpg';

	let user: string | null = null;
	let token: string | null = null;
	let isLoading = false;

	onMount(() => {
		// Extract the query parameter from the URL
		const urlParams = new URLSearchParams(window.location.search);
		user = urlParams.get('user');
		token = urlParams.get('token');
		if (!user || !token) {
			goto('/');
		}
		isLoading = false;
	});

	// State for API error message
	let apiError: null | string = null;

	let password = '';
	let passwordErrorMessage = '';

	const passwordSchema = z.string().min(8, 'Password must be at least 8 characters long');

	function handlePasswordChange(event: Event) {
		const input = event.target as HTMLInputElement;
		const zodResult = passwordSchema.safeParse(input.value);
		password = input.value;
		if (!zodResult.success) {
			passwordErrorMessage = zodResult.error.issues[0].message;
		} else {
			passwordErrorMessage = '';
		}
	}

	async function handleNewPasswordSubmit() {
		isLoading = true;
		// Clear previous errors
		apiError = null;
		const zodResult = passwordSchema.safeParse(password);

		if (!zodResult.success) {
			isLoading = false;
			return;
		}
		try {
			const response = await fetch(env.PUBLIC_VITE_BASE_URL_API + '/api/user/set-new-password', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Connection: 'keep-alive'
				},
				body: JSON.stringify({ userId: user, password, token })
			});

			if (response.ok) {
				// Login successful
				goto('/auth/login'); // Redirect user to the dashboard or desired page
			} else {
				throw new Error('An unexpected error occurred.');
			}
		} catch (err) {
			// Handle network or unexpected errors
			apiError = 'Unable to reset your password. Please try again later.';
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="w-full h-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
	<div class="flex items-center justify-center py-12">
		<div class="mx-auto grid w-[350px] gap-6">
			<div class="grid gap-2 text-center">
				<h1 class="text-3xl font-bold">Set a new Password</h1>
				<p class="text-muted-foreground text-balance">
					Enter your new password below. You will be forwarded to login upon successful submission.
				</p>
			</div>
			<div class="grid gap-4">
				<div class="grid gap-2">
					<div class="flex items-center">
						<Label for="password">Password</Label>
					</div>
					<Input id="password" type="password" on:input={handlePasswordChange} required />
					{#if passwordErrorMessage}
						<span class="text-red-500 text-xs">{passwordErrorMessage}</span>
					{/if}
				</div>
				{#if isLoading}
					<Button disabled class="w-full mt-6">
						<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
						Please wait
					</Button>
				{:else}
					<Button type="button" class="w-full" on:click={handleNewPasswordSubmit}
						>Submit new Password</Button
					>
				{/if}
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
			src={authImg}
			alt="satellite landscape of a river"
			class="h-full w-full object-cover object-center dark:brightness-[0.7]"
		/>
	</div>
</div>
