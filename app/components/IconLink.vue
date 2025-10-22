<template>
	<NuxtLink
		:href="href"
		class="text-theme-800 pl-2 pr-4 rounded-xl flex uppercase transition-colors"
		:target="external ? '_blank' : undefined"
		@click="(event: MouseEvent) => (external ? undefined : triggerNavigation(event))"
	>
		<slot name="icon">
			<Icon name="mdi:ship-wheel" size="24" />
		</slot>

		<span class="text-xl pl-2 h-6">
			<slot name="cta">Go</slot>
		</span>
	</NuxtLink>
</template>

<script setup lang="ts">
withDefaults(
	defineProps<{
		href?: string;
		external?: boolean;
	}>(),
	{ href: '/', external: false },
);

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
