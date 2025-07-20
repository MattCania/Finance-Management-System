<script lang="ts">
	let {children} = $props()
</script>

<section
	class="flex flex-col w-full h-full"
>
	{@render children()}
</section>
