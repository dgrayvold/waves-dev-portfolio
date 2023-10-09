<template>
	<div>
		<IconFishOne ref="icon" class="hidden" />
		<canvas
			ref="fishCanvas"
			:width="canvasDimensions.width * 2"
			:height="canvasDimensions.height * 2"
		/>
	</div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import IconFishOne from '~icons/icon-park/fish-one';
import { useAnimation } from '@/composables/animation';

const { registerAnimationFunction } = useAnimation();

const props = defineProps({
	/**
	 * The number of lines of fish to generate
	 */
	lines: {
		type: Number,
		default: 5,
	},

	/**
	 * The width of the container (probably window) for calculating fish count
	 */
	width: {
		type: Number,
		default: 100,
	},
});

/**
 * The canvas
 */
const c = ref(undefined);

/**
 * The canvas context
 */
const ctx = ref(undefined);

/**
 * The SVG path data of the icon to draw
 */
const pathData = ref(undefined);

/**
 * The size of the icon in use, usually taken from viewBox SVG attribute
 */
const iconSize = ref(48);

/**
 * The offset each fish is drawn in the animation loop
 */
const offset = ref(0);

const icon = ref();

const fishCanvas = ref();

/**
 * Measurements of the canvas for drawing
 */
const canvasDimensions = computed(() => {
	return {
		width: props.width,
		widthInPixels: `${props.width}px`,
		height: props.lines * 48,
		heightInPixels: `${props.lines * 48}px`,
	};
});

/**
 * How many fish need to be visible to cover the full width of the animated area
 */
const fishCount = computed(() => {
	return Math.ceil(props.width / (2.25 * 16));
});

/**
 * SVG path data of the fish icon
 */
const iconPath = computed(() => {
	return icon.value.$el.querySelector('path').getAttribute('d');
});

window.x = animate;

/**
 * Smoothly scroll the fish in the background
 */
function animate() {
	ctx.value.resetTransform();
	ctx.value.clearRect(0, 0, canvasDimensions.value.width * 2, canvasDimensions.value.height * 2);
	ctx.value.beginPath();
	ctx.value.fillStyle = getComputedStyle(c.value).color;

	for (let x = -1; x < fishCount.value; x++) {
		for (let y = 0; y < props.lines; y++) {
			const flip = y % 2 == 1;

			ctx.value.resetTransform();
			ctx.value.scale((flip ? -1 : 1) * 2, 2);
			ctx.value.translate(
				(flip ? -1 : 1) * x * iconSize.value + offset.value,
				y * iconSize.value,
			);
			ctx.value.fill(pathData.value);
		}
	}

	offset.value = offset.value == iconSize.value ? 0 : offset.value + 0.125;
}

onMounted(() => {
	c.value = fishCanvas.value;
	ctx.value = c.value.getContext('2d');
	pathData.value = new Path2D(iconPath.value);

	registerAnimationFunction('projects', animate);
});
</script>

<style scoped lang="postcss">
canvas {
	/* Allow getComputedStyle on canvas to get color */
	@apply text-theme-800 opacity-25;

	width: v-bind('canvasDimensions.widthInPixels');
	height: v-bind('canvasDimensions.heightInPixels');
}
</style>
