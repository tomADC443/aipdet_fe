<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
</script>

<main class="relative w-full h-screen overflow-hidden">
	<!-- Background div for SVG -->
	<div class="absolute inset-0 bg-muted">
		<!-- Using Tailwind's utility classes to style the SVG as a background image -->

		<div
			class="h-full w-full bg-no-repeat bg-cover bg-center dark:brightness-[0.7]"
			style="background-image: url('/src/lib/img/landingBackground.svg');"
		></div>
		<a
			class="absolute right-2 bottom-2 opacity-20 text-xs"
			href="https://www.vecteezy.com/free-vector/background">Background Vectors by Vecteezy</a
		>
	</div>
	<div class="relative z-10 flex flex-col items-center justify-evenly h-full text-white">
		<h1 class=" text-4xl font-semibold">
			Real-Time Invasive Species Detection<br />for Water Resource Management
		</h1>

		<div>
			<a href="/auth" class="text-white no-underline"><Button>Let's Go!</Button></a>
		</div>
	</div>
</main>
