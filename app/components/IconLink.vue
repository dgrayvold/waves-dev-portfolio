<template>
	<a
		:href="href"
		class="flex rounded-xl pl-2 pr-4 text-theme-800 uppercase transition-colors"
		@click="triggerNavigation"
	>
		<slot name="icon">
			<i class="i-mdi:ship-wheel inline-block h-6 w-6" />
		</slot>

		<span class="h-6 pl-2 text-xl">
			<slot name="cta">Go</slot>
		</span>
	</a>
</template>

<script setup lang="ts">
defineProps({
	href: {
		type: String,
		default: '/',
	},
});

const emit = defineEmits(['navigate']);

/**
 * Scroll to associated section on the page
 *
 * @param event
 */
function triggerNavigation(event: MouseEvent) {
	event.preventDefault();
	emit('navigate', (event.currentTarget as HTMLAnchorElement)?.href?.match(/#(.+)/)?.[1]);
}
</script>

<style scoped lang="postcss">
a:hover * {
	@apply text-theme-900 border-theme-900;
}
</style>
