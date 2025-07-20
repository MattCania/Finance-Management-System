<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	
	$: currentPath = $page.url.pathname;
	
	let nav: any
	
	onMount(() => {
		console.log(currentPath)
		nav = [
			{
				label: "Home",
				href: '/',
				active: currentPath === '/'
			},
			// {
			// 	label: "Services",
			// 	href: '/services',
			// 	active: currentPath === '/services'
			// },
			{
				label: "Contacts",
				href: '/contacts',
				active: currentPath === '/contacts'
			},
			{
				label: "About",
				href: '/about',
				active: currentPath === '/about'
			},
		]
	})

</script>

<header
	class="flex w-full h-14 justify-center items-center gap-4 bg-white"
>

	<nav
		class="flex w-3/4 justify-between items-center"
	>

		<div class="flex">

			<a class="font-semibold text-xl italic" href="/">Pandora</a>
		</div>

		<div
			class="flex"
		>
			{#each nav as item}
				<a class={`${item.active ? 'text-gray-800 underline' : 'text-black'} text-center font-medium w-auto px-4 mx-1 py-2 hover:underline hover:text-gray-600 transition-all duration-300`} href={item.href}>{item.label}</a>
			{/each}	
			<a class="text-center font-medium w-auto px-6 mx-1 py-2 bg-zinc-800 shadow-sm shadow-black text-white rounded-lg hover:bg-gray-200 hover:text-black transition-all duration-300" href="/login">Login</a>
		</div>


	</nav>

</header>