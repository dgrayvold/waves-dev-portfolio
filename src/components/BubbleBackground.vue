<template>
	<canvas ref="canvas" :width="canvasDimensions.width" :height="canvasDimensions.height" />
</template>

<script>
import animation from '@/mixins/animation.js';

export default {
	mixins: [animation],

	props: {
		/**
		 * The portrait image to reveal with the bubbles
		 */
		imageUrl: {
			type: String,
		},

		/**
		 * The width of the container to set the canvas width with
		 */
		width: {
			type: Number,
			default: 1000,
		},
	},

	data() {
		return {
			/**
			 * The canvas
			 */
			c: undefined,

			/**
			 * The canvas context
			 */
			ctx: undefined,

			/**
			 * The portrait to reveal with bubbles
			 */
			image: undefined,

			/**
			 * The collection of bubbles currently rising in the background
			 */
			bubbles: [],

			count: 200,

			/**
			 * The bubble color
			 */
			fillColor: undefined,

			/**
			 * The biggest random radius a bubble can be (before adding size modifier)
			 */
			maxSize: 30,

			/**
			 * A minimum size always added to the bubble's size to ensure they aren't too small
			 */
			sizeModifier: 10,
		};
	},

	computed: {
		/**
		 * The sizes and style declarations for the canvas
		 */
		canvasDimensions() {
			return {
				width: this.width * 2,
				widthInPixels: `${this.width}px`,
				height: 500 * 2,
				heightInPixels: `${500}px`,
			};
		},
	},

	async mounted() {
		this.image = await this.loadImage();
		this.c = this.$refs.canvas;
		this.ctx = this.c.getContext('2d');

		this.fillColor = getComputedStyle(this.c).color;

		for (let x = 0; x < this.count; x++) {
			this.bubbles.push(this.generateBubble());
		}

		if (this.animationFrameRequestId !== null) {
			cancelAnimationFrame(this.animationFrameRequestId);
		}

		this.animationFrameRequestId = requestAnimationFrame(this.animate);
	},

	methods: {
		/**
		 * Animate bubbles in the background
		 */
		animate() {
			if (this.animationFrameRequestId !== null) {
				cancelAnimationFrame(this.animationFrameRequestId);
			}

			this.ctx.fillStyle = this.fillColor;

			this.ctx.globalCompositeOperation = 'source-over';

			this.ctx.clearRect(
				0,
				0,
				this.canvasDimensions.width * 2,
				this.canvasDimensions.height * 2,
			);

			this.ctx.globalCompositeOperation = 'destination-atop';
			this.ctx.globalAlpha = 1;
			this.ctx.drawImage(
				this.image,
				this.width >= 1024 ? 0 : this.width / 2 - 250,
				0,
				1000,
				1000,
			);

			this.ctx.globalAlpha = 0.9;

			// Replace bubbles that have passed visibility & adjust position based on speed
			for (let index = 0; index < this.bubbles.length; index++) {
				const bubble = this.bubbles[index];

				if (bubble.position.y < bubble.size * -2) {
					this.bubbles[index] = this.generateBubble();
				} else {
					bubble.position.y -= bubble.speed;
				}
			}

			this.ctx.beginPath();

			// Draw bubble
			this.bubbles.forEach(bubble => {
				this.ctx.moveTo(bubble.position.x, bubble.position.y);
				this.ctx.arc(
					bubble.position.x,
					bubble.position.y,
					bubble.size * 2,
					0,
					2 * Math.PI,
					false,
				);
			});

			this.ctx.fill();

			if (!this.playbackDisabled && this.playing) {
				this.animationFrameRequestId = requestAnimationFrame(this.animate);
			}
		},

		/**
		 * Generate a bubble to rise up in the background
		 *
		 * @return Object The bubble data
		 */
		generateBubble() {
			const size = Math.random() * this.maxSize + this.sizeModifier;

			return {
				position: {
					x: Math.random() * this.canvasDimensions.width,
					y: this.canvasDimensions.height + size + Math.random() * 1000,
				},
				speed: Math.random() * 5 + 2,
				size: size,
			};
		},

		/**
		 * Get image data to draw on canvas
		 */
		loadImage() {
			return new Promise(resolve => {
				const result = new Image();

				result.onload = resolve(result);

				result.src = this.imageUrl;
			});
		},
	},
};
</script>

<style lang="postcss" scoped>
canvas {
	/* Allow getComputedStyle on canvas to get color */
	@apply text-theme-850;

	width: v-bind('canvasDimensions.widthInPixels');
	height: v-bind('canvasDimensions.heightInPixels');

	@apply absolute top-0;
}
</style>
