<script>
	import { Button } from '$lib/components/ui/button/index';
	import * as Card from '$lib/components/ui/card/index';
	import spacex from '$lib/img/spacex.jpg';
	import ChevronDown from 'lucide-svelte/icons/chevron-down';
	const steps = [
		{
			number: 1,
			title: 'Sign Up',
			content: 'Create your account on the AIPDET platform to get started.'
		},
		{
			number: 2,
			title: 'Register Your Area',
			content: 'Use the AOI tab to register and define your area of interest for analysis.'
		},
		{
			number: 3,
			title: 'Create Tasks',
			content:
				"Start a task for your AOI in the 'Task' tab. While processing, explore public tasks from other users."
		},
		{
			number: 4,
			title: 'View Reports',
			content:
				"Access detailed analysis and insights for your completed tasks in the 'Reports' tab."
		}
	];
</script>

<div class="flex flex-col items-center min-h-screen bg-[hsl(var(--background))] dark">
	<!-- Header -->
	<header class="w-full p-4 bg-[hsl(var(--card))] shadow-md fixed top-0 z-50">
		<div class="container mx-auto flex items-center justify-between">
			<h1 class="text-xl font-bold text-[hsl(var(--primary))]">AipDet</h1>
			<nav>
				<a
					href="#how-it-works"
					class="px-4 text-[hsl(var(--foreground))] hover:text-[hsl(var(--primary))]"
					>How it works</a
				>
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

	<section
		id="how-it-works"
		class="container mx-auto py-12 min-h-screen flex flex-col justify-center"
	>
		<h3 class="text-3xl font-bold text-center text-[hsl(var(--foreground))] mb-8">How It Works</h3>
		<div class="flex flex-col gap-8">
			{#each steps as step}
				<div class="flex items-start gap-6 items-center">
					<div
						class="w-12 h-12 shrink-0 rounded-full bg-[hsl(var(--primary))] flex items-center justify-center"
					>
						<span class="text-xl font-bold text-[hsl(var(--primary-foreground))]">
							{step.number}
						</span>
					</div>
					<Card.Root class="bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] flex-1">
						<Card.Header>
							<Card.Title>{step.title}</Card.Title>
						</Card.Header>
						<Card.Content>
							<p class="text-[hsl(var(--muted-foreground))]">
								{step.content}
							</p>
						</Card.Content>
					</Card.Root>
				</div>
			{/each}
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
