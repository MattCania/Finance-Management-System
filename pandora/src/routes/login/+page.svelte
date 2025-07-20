<script lang="ts">
	import { goto } from "$app/navigation";
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome'
    import { faEye, faEyeSlash, faExclamation, faHouse, faScrewdriverWrench, faAddressBook  } from '@fortawesome/free-solid-svg-icons';

	let formData = { email: "", password: "" }
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

		if (!formData.email || !formData.password) {
			console.error("Error Invalid Email or Password")
		}

		try {
			const response = await fetch('http://localhost:5000/auth/login', {
				method: 'POST',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(formData)
			});

			if (!response.ok) {
				const resBody = await response.json();
				console.error('Error Logging in:', resBody);
				return
			}

			const data = await response.json();
			const token = data.token 			//IGNORE (Is not used due to server cookies setting)

			goto('/dashboard')
			
		} catch (error) {
			console.error('[Login error]', error);
		}
	}


</script>

<section class="flex flex-col justify-start items-center h-screen w-full bg-gradient-to-b from-zinc-800 to-zinc-900">	
	<section class="flex justify-between w-1/2 h-2/3 m-auto shadow-2xl shadow-black">
	
		<div class="flex flex-col w-2/5 h-full bg-gradient-to-b from-zinc-900 to-zinc-950 rounded-l-xl py-6">
			
			<a href="/" class="mx-auto my-6 h-12 p-1 px-4 text-white text-3xl italic font-medium">Pandora</a>
			
			<div class="grid grid-cols-2 gap-4 place-items-center mx-4">
				{#each nav as items} 
					<a class="flex h-32 w-32 flex-col justify-center items-center text-white bg-gradient-to-b from-zinc-900 to-zinc-950 font-semibold rounded-lg shadow-2xl/100 hover:shadow-white hover:shadow-md hover:font-medium transition-all duration-250"
						href={items.href}>
						<FontAwesomeIcon class='text-4xl my-2' icon={items.icon}/>
						{items.label}
					</a>
				{/each}
			</div>
			<h1 class="mx-auto my-4 text-center w-3/4 text-white">Download our app now at <a class='underline font-medium hover:text-gray-100' href="/">www.doesntexistyet.com</a></h1>

		</div>

		<form class="flex flex-col justify-center items-center w-3/5 h-full bg-white rounded-r-xl">

			<h1 class="w-2/3 text-center text-3xl font-medium my-4">
				Welcome to Pandora
			</h1>

			<input 
				class="w-2/3 rounded-lg outline-0 bg-gray-100 border-1 border-gray-300 my-2"
				type="text"
				name="email"
				placeholder="Enter your email"
				bind:value={formData.email}>
			<div class="flex w-2/3 relative">
				<input 
					name="password"
					class="w-full rounded-lg outline-0 bg-gray-100 border-1 border-gray-300 my-2"
					type={show_password ? 'text' : 'password'}
					placeholder="Enter your password"
					bind:value={formData.password}>
				<button onclick={() => show_password = !show_password} type='button' class="absolute h-8 w-8 right-2 rounded-full p-1 cursor-pointer top-[50%] translate-y-[-50%]">
					{#if show_password}
						<FontAwesomeIcon icon={faEye} />
					{:else}
						<FontAwesomeIcon icon={faEyeSlash} />
					{/if}
				</button>

			</div>
			<input
				class="flex w-2/3 h-12 justify-center items-center text-white font-semibold bg-zinc-950 rounded-xl hover:bg-zinc-900 hover:text-gray-200 active:bg-white active:text-black hover:shadow-md hover:shadow-black transition-all duration-250 cursor-pointer my-4"
				type="submit"
				onclick={login}
				value="Login">
			<div class="flex w-2/3 justify-between items-center my-1">
				<a class='text-center text-sm hover:text-blue-500 hover:underline' href="/forgot-password">Forgot Password?</a>
				<a class='text-center text-sm font-medium text-blue-800 hover:text-blue-500 hover:underline' href="/register">Create an Account</a>
			</div>	
			
		</form>	
	</section>
</section>