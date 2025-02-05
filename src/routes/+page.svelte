<script>
	import { Button } from '$lib/components/ui/button/index';
	import * as Card from '$lib/components/ui/card/index';
	import spacex from '$lib/img/spacex.jpg';
	import ChevronDown from 'lucide-svelte/icons/chevron-down';
</script>

<div class="flex flex-col items-center min-h-screen bg-[hsl(var(--background))] dark">
	<!-- Header -->
	<header class="w-full p-4 bg-[hsl(var(--card))] shadow-md fixed top-0 z-50">
		<div class="container mx-auto flex items-center justify-between">
			<h1 class="text-xl font-bold text-[hsl(var(--primary))]">AipDet</h1>
			<nav>
				<a
					href="#features"
					class="px-4 text-[hsl(var(--foreground))] hover:text-[hsl(var(--primary))]">Features</a
				>
				<a
					href="#contact"
					class="px-4 text-[hsl(var(--foreground))] hover:text-[hsl(var(--primary))]">Contact</a
				>
				<a
					href="/auth/login"
					class="px-4 text-[hsl(var(--foreground))] hover:text-[hsl(var(--primary))]">Login</a
				>
				<a
					href="/auth/signup"
					class="px-4 text-[hsl(var(--foreground))] hover:text-[hsl(var(--primary))]">Signup</a
				>
			</nav>
		</div>
	</header>
	<!-- Hero Section -->
	<!-- Hero Section -->
	<section
		class="relative flex flex-col items-center justify-center min-h-screen text-center w-full bg-cover bg-center"
		style="background-image: url({spacex}); background-size: cover; background-position: center;"
	>
		<div class="absolute inset-0 w-full h-full bg-[rgba(0,0,0,0.5)]"></div>
		<div
			class="absolute z-10 bg-[hsl(var(--card))]/60 px-10 py-14 rounded-xl backdrop-blur-md"
			style="backdrop-filter: blur(4px);"
		>
			<h2 class="text-4xl font-extrabold text-[hsl(var(--primary))] mb-4">
				Unlock Insights From Space
			</h2>
			<p class="text-lg text-[hsl(var(--foreground))] mb-6">
				Insights You Can Trust for Sustainable Freshwater Management
			</p>
			<a href="/auth"><Button variant="default" size="lg">Get Started!</Button></a>
		</div>
		<div class="absolute bottom-10 flex justify-center w-full">
			<ChevronDown class="text-[hsl(var(--primary))] w-8 h-8 animate-bounce" />
		</div>
	</section>

	<!-- Features Section -->
	<section id="features" class="container mx-auto py-12 min-h-screen flex flex-col justify-center">
		<h3 class="text-3xl font-bold text-center text-[hsl(var(--foreground))] mb-8">Features</h3>
		<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
			<Card.Root class="bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))]">
				<Card.Header>
					<Card.Title>Comprehensive Analysis Tools</Card.Title>
				</Card.Header>
				<Card.Content>
					<p>
						Our platform delivers temporal and spatial assessments using indices like NDVI, allowing
						you to gain valuable insights into vegetation health and growth patterns.
					</p>
				</Card.Content>
			</Card.Root>
			<Card.Root class="bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))]">
				<Card.Header>
					<Card.Title>Hotspot Detection</Card.Title>
				</Card.Header>
				<Card.Content>
					<p>
						Identify areas with concentrated green surface biomass for targeted management of Water
						Hyacinth infestations.
					</p>
				</Card.Content>
			</Card.Root>
			<Card.Root class="bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))]">
				<Card.Header>
					<Card.Title>Interactive Mapping and Dashboards</Card.Title>
				</Card.Header>
				<Card.Content>
					<p>
						Visualize spatial insights on interactive maps and monitor results in an intuitive
						dashboard designed for actionable insights.
					</p>
				</Card.Content>
			</Card.Root>
			<Card.Root class="bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))]">
				<Card.Header>
					<Card.Title>Growth Trends and Seasonal Insights</Card.Title>
				</Card.Header>
				<Card.Content>
					<p>
						Track changes in surface area, growth rates, and vegetation distribution over time with
						season analytics.
					</p>
				</Card.Content>
			</Card.Root>
			<Card.Root class="bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))]">
				<Card.Header>
					<Card.Title>Powered by Satellite Data</Card.Title>
				</Card.Header>
				<Card.Content>
					<p>
						Leverage the high-resolution, multi-spectral imagery from ESA’s Sentinel-2 mission for
						accurate and reliable results.
					</p>
				</Card.Content>
			</Card.Root>
		</div>
	</section>

	<!-- Contact Section -->
	<section id="contact" class="py-12 min-h-screen flex flex-col justify-center">
		<div class="container mx-auto text-center">
			<h3 class="text-3xl font-bold text-[hsl(var(--foreground))] mb-6">Contact Us</h3>
			<p class="text-[hsl(var(--muted-foreground))] mb-4">
				Have questions or want to learn more? Reach out to us!
			</p>
			<a href="mailto:tom@tpl.dev"> <Button variant="default">Email Us</Button></a>
		</div>
	</section>

	<!-- Footer -->
	<footer class="w-full bg-[hsl(var(--card))] shadow-inner py-4">
		<div class="container mx-auto text-center">
			<p class="text-sm text-[hsl(var(--muted-foreground))]">
				&copy; 2025 AipDet. All rights reserved.
			</p>
		</div>
	</footer>
</div>
