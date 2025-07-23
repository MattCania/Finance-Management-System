<script lang="ts">
	import DashboardHeader from '../../components/dashboard_header.svelte';
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

<DashboardHeader/>
{@render children()}