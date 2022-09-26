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

<script>
import IconFishOne from '~icons/icon-park/fish-one';

import animation from '@/mixins/animation.js';

export default {
	mixins: [animation],
	components: {
		IconFishOne,
	},

	props: {
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
			 * The SVG path data of the icon to draw
			 */
			pathData: undefined,

			/**
			 * The size of the icon in use, usually taken from viewBox SVG attribute
			 */
			iconSize: 48,

			/**
			 * The offset each fish is drawn in the animation loop
			 */
			offset: 0,
		};
	},

	computed: {
		/**
		 * Measurements of the canvas for drawing
		 */
		canvasDimensions() {
			return {
				width: this.width,
				widthInPixels: `${this.width}px`,
				height: this.lines * 48,
				heightInPixels: `${this.lines * 48}px`,
			};
		},

		fishCount() {
			return Math.ceil(this.width / (2.25 * 16));
		},

		iconPath() {
			return this.$refs.icon.$el.querySelector('path').getAttribute('d');
		},
	},

	mounted() {
		this.c = this.$refs.fishCanvas;
		this.ctx = this.c.getContext('2d');
		this.pathData = new Path2D(this.iconPath);

		// Run at least once to make background visible even if not currently animated
		requestAnimationFrame(this.animate);
	},

	methods: {
		/**
		 * Smoothly scroll the fish in the background
		 */
		animate() {
			this.ctx.resetTransform();
			this.ctx.clearRect(
				0,
				0,
				this.canvasDimensions.width * 2,
				this.canvasDimensions.height * 2,
			);
			this.ctx.beginPath();
			this.ctx.fillStyle = getComputedStyle(this.c).color;

			for (let x = -1; x < this.fishCount; x++) {
				for (let y = 0; y < this.lines; y++) {
					const flip = y % 2 == 1;

					this.ctx.resetTransform();
					this.ctx.scale((flip ? -1 : 1) * 2, 2);
					this.ctx.translate(
						(flip ? -1 : 1) * x * this.iconSize + this.offset,
						y * this.iconSize,
					);
					this.ctx.fill(this.pathData);
				}
			}

			this.offset = this.offset == this.iconSize ? 0 : this.offset + 0.125;

			if (!this.playbackDisabled && this.playing) {
				requestAnimationFrame(this.animate);
			}
		},
	},
};
</script>

<style scoped lang="postcss">
canvas {
	/* Allow getComputedStyle on canvas to get color */
	@apply text-theme-800 opacity-25;

	width: v-bind('canvasDimensions.widthInPixels');
	height: v-bind('canvasDimensions.heightInPixels');
}
</style>
