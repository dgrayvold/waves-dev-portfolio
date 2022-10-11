<template>
	<a
		:href="href"
		@click="triggerNavigation"
		class="pl-2 pr-4 rounded-xl text-theme-800 uppercase transition-colors grid grid-cols-[24px,auto] items-center"
	>
		<slot name="icon">
			<ShipWheelIcon class="inline-block w-[24px] h-[24px]" />
		</slot>
		<span class="inline-block h-6 pl-2 text-xl"> <slot name="cta">Go</slot> </span>
	</a>
</template>

<script>
import ShipWheelIcon from '~icons/mdi/ship-wheel.vue';

export default {
	components: {
		ShipWheelIcon,
	},

	props: {
		href: {
			type: String,
			default: '/',
		},
	},

	emits: ['navigate'],

	methods: {
		triggerNavigation(event) {
			event.preventDefault();
			this.$emit('navigate', event.currentTarget.href.match(/#(.+)/)[1]);
		},
	},
};
</script>

<style scoped lang="postcss">
a:hover * {
	@apply text-theme-900 border-theme-900;
}
</style>
