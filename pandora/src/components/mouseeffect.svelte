<script lang="ts">
	import { onMount } from "svelte";
	let mouseX = 0;
	let mouseY = 0;
	let x = 0;
	let y = 0;
	
	const speed = 0.1;

	function mouseEffect(event: MouseEvent) {
		mouseX = event.clientX;
		mouseY = event.clientY;
		console.log(`X: ${x} | Y: ${y}`)
	}

	function animateFollower() {
		x += (mouseX - x) * speed;
		y += (mouseY - y) * speed;
		requestAnimationFrame(animateFollower);
	}

	onMount(() => {
		window.addEventListener('mousemove', mouseEffect);
		animateFollower();

		return () => {
			window.removeEventListener('mousemove', mouseEffect); 
		};
	});

</script>


<div
	class="mask"
	style="top: {y}px; left: {x}px;"
	role="presentation"
>
</div>

<style>
	
.mask {
	position:fixed;
	background-color: rgba(255, 255, 255, 0.416);
	display: flex;
	height: 4rem;
	width: 4rem;
	border-radius: 100%;
	transform: translate(-50%, -50%);
	z-index: 1;
	pointer-events: none;
}
</style>