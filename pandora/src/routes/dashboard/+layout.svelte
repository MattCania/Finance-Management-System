<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	let { children } = $props();
	
	onMount( async () => {
		try {
			const response = await fetch("http://localhost:5000/auth/session", {
				method: "GET", 
				credentials: "include", 
				headers: {
				"Content-Type": "application/json"
			}})

			if (!response.ok) {
				console.log(response)
				throw new Error("Session Not Found!")
			}

			console.log("User is logged")

		} catch (error) {
			console.error(error)
			goto('/') 	
		}
	})
	
	async function logout () {
		try {
			const response = await fetch("http://localhost:5000/auth/logout", {
				method: "POST", 
				credentials: "include", 
			})
			
			if (!response.ok) {
				console.log(response)
				throw new Error("Log out failure")
			}

			console.log("User is logged out")
			goto('/') 	

		} catch (error) {
			console.error(error)
		}
	}

	


</script>

<header class="flex w-full h-12 justify-center items-center gap-16 bg-zinc-950">
	<a 
		class="text-white w-auto px-4 border-white border-1 rounded-lg" 
		href="/dashboard">
		Dashboard
	</a>
	<a 
		class="text-white w-auto px-4 border-white border-1 rounded-lg" 
		href="/dashboard/profile">
		Profile
	</a>
	<a 
		class="text-white w-auto px-4 border-white border-1 rounded-lg" 
		href="/dashboard/wallet">
		Wallet
	</a>
	<a 
		class="text-white w-auto px-4 border-white border-1 rounded-lg" 
		href="/dashboard/transactions">
		Transactions
	</a>
	<button
	onclick={logout}
		class="text-white w-auto px-4 border-white border-1 rounded-lg" 
	>
		Log Out
	</button>
	
</header>
{@render children()}