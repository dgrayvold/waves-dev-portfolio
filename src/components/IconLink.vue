<template>
	<a
		:href="href"
		@click="triggerNavigation"
		class="flex pl-2 pr-4 rounded-xl text-theme-800 uppercase transition-colors grid grid-cols-[24px,auto] items-center"
	>
		<slot name="icon">
			<i class="i-mdi-ship-wheel inline-block w-6 h-6" />
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
