<script lang="ts">
	import { goto } from "$app/navigation";
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome'
      import { faEye, faEyeSlash, faExclamation, faHouse, faScrewdriverWrench, faAddressBook  } from '@fortawesome/free-solid-svg-icons';
	import type { AccountForm } from "../../data/types";

	let formValues = { email: "", password: "", address: "", country: "", birthday: "",
					 firstname: "", lastname: "", middlename: "", currency: "",
					income_period: "", income_amount: "", balance: ""}
	let show_password = false

	const nav = [
		{
			label: 'Home',
			href: '/home',
			icon: faHouse
		},
		{
			label: 'Services',
			href: '/home/services',
			icon: faScrewdriverWrench
		},
		{
			label: 'Contacts',
			href: '/home/contacts',
			icon: faAddressBook
		},
		{
			label: 'About',
			href: '/home/about',
			icon: faExclamation
		},
	]

	async function login() {
		const formData : AccountForm = {
			...formValues,
			balance: Number(formValues.balance),
			income_amount: Number(formValues.income_amount)
		}

		if (!formData.email || !formData.password) {
			console.error("Error Invalid Email or Password")
		}
		
		try {
			const response = await fetch('http://localhost:5000/account/create', {
				method: 'POST',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(formData)
			});

			if (!response.ok) {
				const resBody = await response.json();
				console.error('Error Register in:', resBody.error);
				return
			}

			const data = await response.json();
			const token = data.token 			//IGNORE

			goto('/login')
			
		} catch (error) {
			console.error('[Login error]', error);
		}
	}


</script>

<section class="flex flex-col justify-start items-center h-screen w-full bg-gradient-to-b from-zinc-800 to-zinc-900">	
	<section class="flex justify-between w-2/3 h-3/4 m-auto shadow-2xl shadow-black">
	
		<div class="flex flex-col w-1/10 px-10 h-full justify-around items-center bg-gradient-to-b from-zinc-900 to-zinc-950 rounded-l-xl">
			{#each nav as items} 	
				<a class="flex h-16 w-16 flex-col justify-center items-center text-white bg-gradient-to-b from-zinc-900 to-zinc-950 font-semibold rounded-lg shadow-2xl/100 hover:shadow-white hover:shadow-md hover:font-medium transition-all duration-250"
					href={items.href}>
					<FontAwesomeIcon class='flex w-16 h-16 text-2xl' icon={items.icon}/>
				</a>
			{/each}
		</div>

		<form class="flex justify-center items-center w-full h-full bg-white rounded-r-xl">

			<div class="flex flex-col w-1/2 h-full justify-center items-center">
				<h1 class="text-3xl font-medium my-4">
					Welcome to Pandora
				</h1>
				<input 
					class="w-2/3 rounded-lg outline-0 bg-gray-100 border-1 border-gray-300 my-2"
					type="text"
					name="firstname"
					placeholder="First name"
					bind:value={formValues.firstname}>
				<input 
					class="w-2/3 rounded-lg outline-0 bg-gray-100 border-1 border-gray-300 my-2"
					type="text"
					name="middlename"
					placeholder="Middle name (optional)"
					bind:value={formValues.middlename}>
				<input 
					class="w-2/3 rounded-lg outline-0 bg-gray-100 border-1 border-gray-300 my-2"
					type="text"
					name="lastname"
					placeholder="Last name"
					bind:value={formValues.lastname}>
				<div class="flex flex-col w-2/3 relative my-2">
					<label class="font-medium mx-1" for="birthday">Birthday:</label>
					<input 
					class="w-full rounded-lg outline-0 bg-gray-100 border-1 border-gray-300"
					type="date"
					name="birthday"
					bind:value={formValues.birthday}>
				</div>
					<input 
					class="w-2/3 rounded-lg outline-0 bg-gray-100 border-1 border-gray-300 my-2"
					type="text"
					name="country"
					placeholder="Country"
					bind:value={formValues.country}>
				<input 
					class="w-2/3 rounded-lg outline-0 bg-gray-100 border-1 border-gray-300 my-2"
					type="text"
					name="address"
					placeholder="Address"
					bind:value={formValues.address}>
				
			</div>

			<div class="flex flex-col w-1/2 h-full justify-center items-center">
				<input 
					class="w-2/3 rounded-lg outline-0 bg-gray-100 border-1 border-gray-300 my-2"
					type="text"
					name="income_amount"
					placeholder="Income Amount"
					bind:value={formValues.income_amount}>
				<input 
					class="w-2/3 rounded-lg outline-0 bg-gray-100 border-1 border-gray-300 my-2"
					type="text"
					name="income_period"
					placeholder="Income Period"
					bind:value={formValues.income_period}>
				<input 
					class="w-2/3 rounded-lg outline-0 bg-gray-100 border-1 border-gray-300 my-2"
					type="text"
					name="balance"
					placeholder="Initial Balance"
					bind:value={formValues.balance}>
				<input 
					class="w-2/3 rounded-lg outline-0 bg-gray-100 border-1 border-gray-300 my-2"
					type="text"
					name="currency"
					placeholder="Currency"
					bind:value={formValues.currency}>
				<input 
					class="w-2/3 rounded-lg outline-0 bg-gray-100 border-1 border-gray-300 my-2"
					type="text"
					name="email"
					placeholder="Enter your email"
					bind:value={formValues.email}>
				<div class="flex w-2/3 relative my-2">
					<input 
						name="password"
						class="w-full rounded-lg outline-0 bg-gray-100 border-1 border-gray-300"
						type={show_password ? 'text' : 'password'}
						placeholder="Enter your password"
						bind:value={formValues.password}>
					<button onclick={() => show_password = !show_password} type='button' class="absolute h-8 w-8 right-2 rounded-full p-1 cursor-pointer top-[50%] translate-y-[-50%]">
						{#if show_password}
							<FontAwesomeIcon icon={faEye} />
						{:else}
							<FontAwesomeIcon icon={faEyeSlash} />
						{/if}
					</button>
				</div>
				<div class="flex flex-col w-2/3 justify-center items-center my-1">
					<input
						class="flex w-full h-12 justify-center items-center text-white font-semibold bg-zinc-950 rounded-xl hover:bg-zinc-900 hover:text-gray-200 active:bg-white active:text-black hover:shadow-md hover:shadow-black transition-all duration-250 cursor-pointer my-4"
						type="submit"
						onclick={login}
						value="Register">
					<a 
						class="flex text-black hover:underline hover:text-gray-800 transition-all duration-250" href="/login">Already have an Account?</a>
				</div>	
			</div>
			

			
		</form>	
	</section>
</section>