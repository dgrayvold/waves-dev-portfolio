<template>
	<a
		:href="href"
		@click="triggerNavigation"
		class="pl-2 pr-4 rounded-xl text-theme-800 uppercase transition-colors"
	>
		<slot name="icon">
			<ShipWheelIcon class="inline-block w-[24px] h-[24px] -mt-2 -mr-2" />
		</slot>
		<span class="pl-4 text-xl"> <slot name="cta">Go</slot> </span>
	</a>
</template>

<script>
import ShipWheelIcon from '@/components/Icons/ShipWheelIcon.vue';

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
