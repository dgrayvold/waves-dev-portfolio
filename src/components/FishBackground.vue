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

export default {
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

			pathData: undefined,

			/**
			 * Whether playback should be possible (e.g. for reduced motion preference)
			 */
			playbackDisabled: false,

			/**
			 * Whether the background should currently be moving
			 */
			playing: true,

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

	mounted() {
		this.c = this.$refs.fishCanvas;
		this.ctx = this.c.getContext('2d');
		this.pathData = new Path2D(this.iconPath);

		requestAnimationFrame(this.animate);

		// Set playback based on motion preference
		if (matchMedia('(prefers-reduced-motion: reduced)').matches) {
			this.playbackDisabled = true;
			this.playing = false;
			this.offset = this.iconSize / 2;
		}

		// Set up playback based on visibility
		window.addEventListener(
			'visibilitychange',
			function () {
				document.hidden && !this.playbackDisabled ? this.play() : this.pause();
			}.bind(this),
		);

		const observer = new IntersectionObserver(
			entries => {
				entries[0].isIntersecting && !this.playbackDisabled ? this.play() : this.pause();
			},
			{
				threshold: [0, 0.1, 0.5],
			},
		);
		observer.observe(this.$refs.fishCanvas);
	},

	computed: {
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

			this.playing ? requestAnimationFrame(this.animate) : null;
		},

		/**
		 * Start playback of the background
		 */
		play() {
			if (this.playbackDisabled) {
				return;
			}

			const alreadyPlaying = this.playing == true;
			this.playing = true;

			if (!alreadyPlaying) {
				requestAnimationFrame(this.animate);
			}
		},

		/**
		 * Pause playback of the background
		 */
		pause() {
			this.playing = false;
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
