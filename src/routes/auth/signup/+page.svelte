<script lang="ts">
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import CircleAlert from 'lucide-svelte/icons/circle-alert';
	import * as Alert from '$lib/components/ui/alert';
	import { z } from 'zod';

	let apiError: string | null = null;
	let isLoading: boolean = false;
	const signupDataSchema = z.object({
		firstName: z.string().min(2).max(50),
		lastName: z.string().min(2).max(50),
		email: z.string().email(),
		password: z.string().min(8)
	});

	type SignupDataType = z.infer<typeof signupDataSchema>;

	let signupData: SignupDataType = {
		firstName: '',
		lastName: '',
		email: '',
		password: ''
	};

	let signupDataErrors = {
		firstName: '' as string | null,
		lastName: '' as string | null,
		email: '' as string | null,
		password: '' as string | null
	};
	function getInputValue(event: Event): string {
		return (event.target as HTMLInputElement)?.value || '';
	}

	function handleInputChange(field: keyof SignupDataType, value: string) {
		signupData[field] = value;

		const zodResult = signupDataSchema.safeParse(signupData);
		if (zodResult.success) {
			signupDataErrors[field] = null;
			return;
		}
		const issue = zodResult.error.issues.find((i) => i.path[0] === field);
		if (issue) {
			signupDataErrors[field] = issue.message || 'invalid';
		} else {
			signupDataErrors[field] = null;
		}
	}
	async function handleSubmit(event: Event) {
		event.preventDefault();
		const zodResult = signupDataSchema.safeParse(signupData);
		if (!zodResult.success) {
			const issues = zodResult.error.issues;
			issues.forEach((issue) => {
				const field = issue.path[0] as keyof SignupDataType;
				signupDataErrors[field] = String(issue.message);
			});
			return;
		}

		isLoading = true;
		apiError = null; // Clear previous errors before making the API call

		try {
			const apiResponse = await fetch(import.meta.env.VITE_BASE_URL_API + '/api/user/signup', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Connection: 'keep-alive'
				},
				body: JSON.stringify(signupData)
			});

			if (apiResponse.ok) {
				const responseData = await apiResponse.json();
				const userId = responseData.userId;
				window.location.href = '/auth/email-verification/?user=' + userId;
				return;
			}

			const error = await apiResponse.json();
			if (apiResponse.status === 400 && error.detail) {
				apiError = error.detail;
			} else {
				apiError = 'An unexpected error occurred.';
			}
		} catch (error) {
			console.error(error);
			apiError = 'An error occurred. Please try again later.';
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="min-h-screen w-full h-full lg:grid lg:grid-cols-2">
	<div class="flex items-center justify-center py-12">
		<form class="mx-auto grid w-[350px] gap-6">
			<div class="grid gap-2 text-center">
				<h1 class="text-3xl font-bold">Sign Up</h1>
				<p class="text-muted-foreground text-balance">
					Enter your information to create an account
				</p>
			</div>
			<div class="grid gap-4">
				<div class="grid grid-cols-2 gap-4">
					<div class="grid gap-2">
						<Label for="first-name">First name</Label>
						<Input
							id="first-name"
							placeholder="John"
							required
							on:input={(e) => handleInputChange('firstName', getInputValue(e))}
						/>
						{#if signupDataErrors.firstName}
							<span class="text-red-500 text-xs">{signupDataErrors.firstName}</span>
						{/if}
					</div>
					<div class="grid gap-2">
						<Label for="last-name">Last name</Label>
						<Input
							id="last-name"
							placeholder="Doe"
							required
							on:input={(e) => handleInputChange('lastName', getInputValue(e))}
						/>
						{#if signupDataErrors.lastName}
							<span class="text-red-500 text-xs">{signupDataErrors.lastName}</span>
						{/if}
					</div>
				</div>
				<div class="grid gap-2">
					<Label for="email">Email</Label>
					<Input
						id="email"
						type="email"
						placeholder="m@example.com"
						required
						on:input={(e) => handleInputChange('email', getInputValue(e))}
					/>

					{#if signupDataErrors.email}
						<span class="text-red-500 text-xs">{signupDataErrors.email}</span>
					{/if}
				</div>
				<div class="grid gap-2">
					<Label for="password">Password</Label>
					<Input
						id="password"
						type="password"
						required
						on:input={(e) => handleInputChange('password', getInputValue(e))}
					/>

					{#if signupDataErrors.password}
						<span class="text-red-500 text-xs">{signupDataErrors.password}</span>
					{/if}
				</div>
				{#if isLoading}
					<Button disabled class="w-full mt-6">
						<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
						Please wait
					</Button>
				{:else}
					<Button on:click={handleSubmit} type="submit" class="w-full mt-6"
						>Create an account</Button
					>
				{/if}
			</div>
			<div class="mt-4 text-center text-sm">
				Already have an account?
				<a href="/auth/login" class="underline"> Login </a>
			</div>
			{#if apiError}
				<Alert.Root variant="destructive">
					<CircleAlert class="h-4 w-4" />
					<Alert.Title>Error</Alert.Title>
					<Alert.Description>{apiError}</Alert.Description>
				</Alert.Root>
			{/if}
		</form>
	</div>
	<div class="hidden bg-muted lg:flex lg:basis-1/2">
		<img
			src="/src/lib/img/signup.png"
			alt="satellite landscape of a river"
			class="h-full min-h-full min-w-full w-full object-cover object-center dark:brightness-[0.7]"
		/>
	</div>
</div>
