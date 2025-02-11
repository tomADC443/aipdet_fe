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
	let isLoading = false;
	let isProcessDone = false;
	// State for API error message
	let apiError: null | string = null;

	let email = '';
	let emailErrorMessage = '';

	const emailSchema = z.string().email();

	function handleEmailChange(event: Event) {
		const input = event.target as HTMLInputElement;
		const zodResult = emailSchema.safeParse(input.value);
		email = input.value;
		if (!zodResult.success) {
			emailErrorMessage = zodResult.error.issues[0].message;
		} else {
			emailErrorMessage = '';
		}
	}

	async function handleResetPasswordSubmit() {
		isLoading = true;

		// Clear previous errors
		apiError = null;
		const zodResult = emailSchema.safeParse(email);

		if (!zodResult.success) {
			isLoading = false;
			return;
		}
		try {
			const response = await fetch(env.PUBLIC_VITE_BASE_URL_API + '/api/user/reset-password', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Connection: 'keep-alive'
				},
				body: JSON.stringify({ email })
			});

			if (response.ok) {
				isProcessDone = true;
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
				<h1 class="text-3xl font-bold">
					{!isProcessDone ? 'Enter Your Email Address' : 'Password Reset Initiated'}
				</h1>
				<p class="text-muted-foreground text-balance">
					{!isProcessDone
						? 'Enter your email address below to reset your password. You will receive an email with instructions on how to reset your password.'
						: 'If this email address is associated with an account, you will receive an email with instructions to reset your password. You can close this page now.'}
				</p>
			</div>
			{#if !isProcessDone}
				<div class="grid gap-4">
					<div class="grid gap-2">
						<div class="flex items-center">
							<Label for="email">email</Label>
						</div>
						<Input id="email" type="text" on:input={handleEmailChange} required />
						{#if emailErrorMessage}
							<span class="text-red-500 text-xs">{emailErrorMessage}</span>
						{/if}
					</div>
					{#if isLoading}
						<Button disabled class="w-full mt-6">
							<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
							Please wait
						</Button>
					{:else}
						<Button type="button" class="w-full" on:click={handleResetPasswordSubmit}
							>Reset Password</Button
						>
					{/if}
				</div>
			{/if}
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
