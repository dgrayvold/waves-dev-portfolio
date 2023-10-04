<template>
	<a
		:href="href"
		@click="triggerNavigation"
		class="flex pl-2 pr-4 rounded-xl text-theme-800 uppercase transition-colors grid grid-cols-[24px,auto] items-center"
	>
		<slot name="icon">
			<ShipWheelIcon class="w-[24px] h-[24px]" />
		</slot>

		<span class="h-6 pl-2 text-xl">
			<slot name="cta">Go</slot>
		</span>
	</a>
</template>

<script setup>
import ShipWheelIcon from '~icons/mdi/ship-wheel';

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
 * @param {MouseEvent} event
 */
function triggerNavigation(event) {
	event.preventDefault();
	emit('navigate', event.currentTarget.href.match(/#(.+)/)[1]);
}
</script>

<style scoped lang="postcss">
a:hover * {
	@apply text-theme-900 border-theme-900;
}
</style>
