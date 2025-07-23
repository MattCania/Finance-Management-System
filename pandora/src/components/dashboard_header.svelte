<script lang="ts">
	import { page } from '$app/stores';
	import { faArrowRight, faBell, faGear, faMessage, faQuestion, faUser, faWrench } from '@fortawesome/free-solid-svg-icons';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { onMount } from 'svelte';
	
	$: currentPath = $page.url.pathname;
	
	let show_options = false
	let show_notifications = false

	let notification = false // Arbitrary value 
	
	let nav: any
	
	onMount(() => {
		console.log(currentPath)
		nav = [
			{
				label: "Dashboard",
				href: '/dashboard',
				active: currentPath === '/dashboard'
			},
			{
				label: "Transactions",
				href: '/dashboard/transactions',
				active: currentPath === '/dashboard/transactions'
			},
			{
				label: "Wallet",
				href: '/dashboard/wallet',
				active: currentPath === '/dashboard/wallet'
			},
		]
	})

	function toggle_notification () {
		show_notifications = !show_notifications
		show_options = false
	}

	function toggle_options () {
		show_options = !show_options
		show_notifications = false
	}

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
			<div class="relative">
				<button onclick={toggle_notification}
					class="text-center font-medium w-auto px-4 mx-1 py-2 hover:text-gray-600 transition-all duration-300 cursor-pointer">
					<FontAwesomeIcon icon={faBell}/>
				</button>
					{#if show_notifications}
					<div class="absolute flex flex-col justify-start items-center bg-zinc-800 w-80 min-h-64 top-12 right-4 rounded-lg overflow-hidden py-3"> 
						<div class="flex justify-between w-full items-center text-white px-6">
							<h1 >Notifications</h1>
							<a href="/settings/notifications">
								<FontAwesomeIcon icon={faGear}/>
							</a>
						</div>
						<hr class="text-lg text-white border-zinc-600 w-full my-2">
							{#if notification}
								<a href="/notification:id">Notification #123123</a>
							{:else if !notification} 
								<h1 class="text-white w-full font-semibold text-center m-auto">You Have No Notifications!</h1>
							{/if}
						<hr class="text-lg text-white border-zinc-600 w-full my-2">
					</div>
					{/if}
			</div>
			<div class="relative">
				<button onclick={toggle_options}
					class="text-center font-medium w-auto px-4 mx-1 py-2 hover:text-gray-600 transition-all duration-300 cursor-pointer">
					<FontAwesomeIcon icon={faGear}/>
				</button>
					{#if show_options}
					<div class="absolute flex flex-col justify-center items-center bg-zinc-800 w-48 top-12 right-4 rounded-lg overflow-hidden py-3"> 
						<hr class="text-lg text-white border-zinc-600 w-full my-2">
						<a class="flex text-white justify-start items-center pl-6 w-full h-8 hover:border-none hover:bg-white hover:text-zinc-800 transition-all duration-300" href="/profiles">
							<FontAwesomeIcon class="w-8 mr-2" icon={faUser}/>
							Profile
						</a>
						<hr class="text-lg text-white border-zinc-600 w-full my-2">
						<a class="flex text-white justify-start items-center pl-6 w-full h-8 hover:border-none hover:bg-white hover:text-zinc-800 transition-all duration-300" href="/settings">
							<FontAwesomeIcon class="w-8 mr-2" icon={faWrench}/>
							Settings
						</a>
						<a class="flex text-white justify-start items-center pl-6 w-full h-8 hover:border-none hover:bg-white hover:text-zinc-800 transition-all duration-300" href="/help">
							<FontAwesomeIcon class="w-8 mr-2" icon={faQuestion}/>
							Help
						</a>
						<a class="flex text-white justify-start items-center pl-6 w-full h-8 hover:border-none hover:bg-white hover:text-zinc-800 transition-all duration-300" href="/feedback">
							<FontAwesomeIcon class="w-8 mr-2" icon={faMessage}/>
							Feedback
						</a>
						<hr class="text-lg text-white border-zinc-600 w-full my-2">
						<button class="flex text-white justify-start items-center pl-6 w-full h-8 hover:border-none hover:bg-white hover:text-zinc-800 transition-all duration-300 cursor-pointer">
							<FontAwesomeIcon class="w-8 mr-2" icon={faArrowRight}/>
							Log Out
						</button>
						<hr class="text-lg text-white border-zinc-600 w-full my-2">
					</div>
					{/if}
			</div>
		</div>
	</nav>

</header>