<script lang="ts">
	import Header from '../../components/header.svelte'
	let { children } = $props();
</script>

<main class="flex flex-col justify-start items-center h-screen w-full">	
	<Header/>
	{@render children()}
</main>
