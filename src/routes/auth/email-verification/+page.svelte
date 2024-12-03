<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';
	import { onMount } from 'svelte';

	let userId: string | null = null;

	onMount(() => {
		// Extract the query parameter from the URL
		const urlParams = new URLSearchParams(window.location.search);
		userId = urlParams.get('user');
	});
</script>

<div class="h-screen flex flex-col items-center justify-center gap-1 text-center">
	<h3 class="text-2xl font-bold tracking-tight">Please verify your email address</h3>
	<p class="text-muted-foreground text-sm">
		After you signed up we sent you an email to verify your email address. Please follow the
		instructions in that email to verify your email address and then proceed to Login.
		<br />
		For support reach out to: <a href="mailto:tom@tpl.dev'">tom@tpl.dev</a>
	</p>
</div>
