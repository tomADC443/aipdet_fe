<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Not Logged in</Card.Title>
		<Card.Description>Unlock all features and process your areas of interest.</Card.Description>
	</Card.Header>
	<Card.Content>
		<a href="/auth"> <Button size="sm" class="w-full">Log-in</Button></a>
	</Card.Content>
</Card.Root>
