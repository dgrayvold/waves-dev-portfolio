<template>
	<canvas ref="canvas" :width="canvasDimensions.width" :height="canvasDimensions.height" />
</template>

<script lang="ts">
/**
 * A representation of a bubble shown on the animated background
 */
type Bubble = {
	/**
	 * The coordinates of the center of the bubble
	 */
	position: {
		x: number;
		y: number;
	};

	/**
	 * How quickly the bubble rises
	 */
	speed: number;

	/**
	 * How big the bubble is
	 */
	size: number;
};
</script>

<script setup lang="ts">
const props = withDefaults(
	defineProps<{
		/**
		 * The portrait image to reveal with the bubbles
		 */
		imageUrl?: string;

		/**
		 * The width of the container to set the canvas width with
		 */
		width?: number;

		active: boolean;
	}>(),
	{ imageUrl: '', width: 1000 },
);

const animationFrameId = useAnimationState(() => props.active, animate);

/**
 * The canvas element
 */
const canvas = useTemplateRef('canvas');

/**
 * The canvas context
 */
const ctx = ref<CanvasRenderingContext2D>();

/**
 * The portrait to reveal with bubbles
 */
const image = ref<HTMLImageElement>();

/**
 * The maximum amount of bubbles that should be visible at a time
 */
const count = ref(200);

/**
 * The bubble color
 */
const fillColor = ref('');

/**
 * The biggest random radius a bubble can be (before adding size modifier)
 */
const maxSize = ref(50);

/**
 * A minimum size always added to the bubble's size to ensure they aren't too small
 */
const sizeModifier = ref(10);

/**
 * The collection of bubbles currently rising in the background
 */
const bubbles = [] as Bubble[];

/**
 * The sizes and style declarations for the canvas
 */
const canvasDimensions = computed(() => {
	return {
		width: props.width * 2,
		widthInPixels: `${props.width}px`,
		height: 500 * 2,
		heightInPixels: `${500}px`,
	};
});

onMounted(async () => {
	image.value = await loadImage();
	ctx.value = canvas.value!.getContext('2d')!;

	fillColor.value = getComputedStyle(canvas.value!).color;

	for (let x = 0; x < count.value; x++) {
		bubbles.push(generateBubble());
	}
});

/**
 * Animate bubbles in the background
 */
function animate() {
	if (!ctx.value || !image.value) {
		return;
	}

	ctx.value.fillStyle = fillColor.value;

	ctx.value.globalCompositeOperation = 'source-over';

	ctx.value.clearRect(0, 0, canvasDimensions.value.width * 2, canvasDimensions.value.height * 2);

	ctx.value.globalCompositeOperation = 'destination-atop';
	ctx.value.globalAlpha = 1;

	ctx.value.drawImage(
		image.value,
		props.width >= 1024 ? 0 : props.width / 2 - 250,
		0,
		1000,
		1000,
	);

	ctx.value.globalAlpha = 0.9;

	// Replace bubbles that have passed visibility & adjust position based on speed
	for (let index = 0; index < bubbles.length; index++) {
		const bubble = bubbles[index];

		if (!bubble) {
			continue;
		}

		if (bubble.position.y < bubble.size * -2) {
			bubbles[index] = generateBubble();
		} else {
			bubble.position.y -= bubble.speed;
		}
	}

	ctx.value.beginPath();

	// Draw bubble
	bubbles.forEach(bubble => {
		ctx.value?.moveTo(bubble.position.x, bubble.position.y);
		ctx.value?.arc(
			Math.floor(bubble.position.x),
			Math.floor(bubble.position.y),
			Math.floor(bubble.size * 2),
			0,
			2 * Math.PI,
			false,
		);
	});

	ctx.value.fill();

	animationFrameId.value = requestAnimationFrame(animate);
}

/**
 * Generate a bubble to rise up in the background
 *
 * @return Object The bubble data
 */
function generateBubble(): Bubble {
	const size = Math.random() * maxSize.value + sizeModifier.value;

	return {
		position: {
			x: Math.random() * canvasDimensions.value.width,
			y: canvasDimensions.value.height + size + Math.random() * 1000,
		},
		speed: Math.random() * 5 + 2,
		size: size,
	};
}

/**
 * Get image data to draw on canvas
 */
function loadImage(): Promise<HTMLImageElement> {
	return new Promise(resolve => {
		const result = new Image();

		result.onload = () => resolve(result);

		result.src = props.imageUrl;
	});
}
</script>

<style lang="postcss" scoped>
canvas {
	/* Allow getComputedStyle on canvas to get color */
	@apply text-theme-850;

	width: v-bind('canvasDimensions.widthInPixels');
	height: v-bind('canvasDimensions.heightInPixels');
}
</style>
