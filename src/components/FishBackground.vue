<template>
	<div>
		<canvas
			ref="fishCanvas"
			:width="canvasDimensions.width * 2"
			:height="canvasDimensions.height * 2"
		/>
	</div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useAnimation } from '@/composables/animation';

const { registerAnimationFunction } = useAnimation();

const props = withDefaults(
	defineProps<{
		/**
		 * The number of lines of fish to generate
		 */
		lines?: number;

		/**
		 * The width of the container (probably window) for calculating fish count
		 */
		width?: number;
	}>(),
	{ lines: 5, width: 100 },
);

/**
 * The canvas to display the animated background on
 */
const fishCanvas = ref<HTMLCanvasElement>();

/**
 * The canvas context
 */
const ctx = ref<CanvasRenderingContext2D>();

/**
 * The SVG path data of the icon to draw (icon-park:fish-one)
 */
const pathData = ref<Path2D>(
	new Path2D(
		'M44 24C42.7848 28.6903 36.038 32.4667 33 32.9997C30.5696 38.9691 24.038 39.5327 21 38.9997L25 32.9997C20.5443 32.5733 15.0253 27.9544 13 26.0001C10.3861 28.8504 6.19409 31.0805 4 31.9688C7.64557 24.2939 5.51899 17.3097 4 15.0001C6.83544 15.0001 11.1435 18.2235 13 20.0001C15.0253 17.8681 21.962 14.8879 25 13.9997L21 8.99979C28.6962 8.147 32.1561 11.868 33 14C40.6962 15.7056 43.6624 21.6904 44 24Z',
	),
);

/**
 * The size of the icon in use, usually taken from viewBox SVG attribute
 */
const iconSize = ref(48);

/**
 * The offset each fish is drawn in the animation loop
 */
const offset = ref(0);

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
 * Smoothly scroll the fish in the background
 */
function animate() {
	if (!fishCanvas.value || !ctx.value || !pathData.value) {
		return;
	}

	ctx.value.resetTransform();
	ctx.value.clearRect(0, 0, canvasDimensions.value.width * 2, canvasDimensions.value.height * 2);
	ctx.value.beginPath();
	ctx.value.fillStyle = getComputedStyle(fishCanvas.value).color;

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
	ctx.value = fishCanvas.value?.getContext('2d') ?? undefined;

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
