<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<main class="flex flex-col justify-start items-center h-screen w-full">	
	{@render children()}
</main>
