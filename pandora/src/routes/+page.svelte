<script lang="ts">
	import Header from "../components/header.svelte";
</script>

<Header/>
<section id="bg-landing">
	<div class="flex flex-col w-1/3 h-1/4 my-4">
		<h1 class='w-auto mx-auto my-2 text-white text-5xl font-semibold'>Welcome to Pandora</h1>
		<h1 class='w-auto mx-auto my-2 text-white text-5xl font-semibold'>Financial Services</h1>
		<h1 class='w-auto mx-auto my-2 text-white text-lg font-light'>Helping You Tell Your Money Where to Go.</h1>
	</div>
	<div class="flex w-1/3 h-auto justify-center items-center gap-8 mb-10">
		<a class="w-1/2 text-center p-2 font-normal rounded-md bg-blue-900 text-white hover:bg-blue-600 hover:scale-105 hover:font-semibold transition-all duration-300" href="/services">Check Our Services</a>
		<a class="w-1/2 text-center p-2 font-normal rounded-md bg-blue-900 text-white hover:bg-blue-600 hover:scale-105 hover:font-semibold transition-all duration-300" href="/register">Register Now</a>
	</div>
</section>
