<template>
	<header class="relative h-screen min-h-180 w-full overflow-hidden bg-theme-100">
		<canvas ref="background-0" id="background-0"></canvas>
		<canvas ref="background-1" id="background-1"></canvas>
		<canvas ref="background-2" id="background-2"></canvas>
		<canvas ref="background-3" id="background-3"></canvas>

		<div class="max-w-192 mx-auto mt-16 p-4 rounded-xl">
			<h1 class="leading-12 lg:leading-16 px-8" text="5xl lg:6xl center theme-850">
				Hi, I'm Daniel Grayvold
			</h1>
			<p class="text-center px-8" text="3xl lg:4xl theme-800">
				I'm making waves in creative media &amp; tech
			</p>

			<nav class="flex justify-center mt-14 px-4 text-theme-900">
				<button
					@click="triggerFirstSection"
					class="
						hidden
						sm:block
						top-0
						pr-9
						text-center
						transition-colors
						text-theme-800
						hover:text-theme-900
					"
				>
					<AnchorIcon
						id="dive-icon"
						class="
							relative
							w-28
							h-28
							top-0
							transform
							origin-center
							mx-auto
							-rotate-45
							-translate-x-2
							transition-all
							ease-out
							-z-[1]
						"
						:class="{
							'top-128': anchorDropped,
						}"
					/>
					<span
						class="relative top-0 text-2xl uppercase transition-all duration-300"
						:class="{
							'top-8': anchorDropped,
							'opacity-0': anchorDropped,
						}"
					>
						Dive in
					</span>
				</button>

				<ul
					class="
						grid grid-rows-4
						gap-2
						px-10
						justify-start
						sm:border-l-2
						border-theme-800
					"
				>
					<ButtonLink href="#about" class="group" v-bind="$attrs">
						<template #icon>
							<WavesIcon
								class="
									w-[24px]
									h-[24px]
									-mt-2
									-mr-2
									inline-block
									group-hover:animate-float
								"
							/>
						</template>
						<template #cta>About</template>
					</ButtonLink>

					<ButtonLink href="#projects" class="group" v-bind="$attrs">
						<template #icon>
							<SailboatIcon
								class="
									inline-block
									w-[24px]
									h-[24px]
									-mt-2
									-mr-2
									stroke-current stroke-4
									group-hover:animate-boat
								"
							/>
						</template>
						<template #cta>Projects</template>
					</ButtonLink>

					<ButtonLink href="#other" class="group" v-bind="$attrs">
						<template #icon>
							<LighthouseIcon
								class="
									inline-block
									w-[24px]
									h-[24px]
									-mt-2
									-mr-2
									group-hover:animate-lighthouse
								"
							/>
						</template>
						<template #cta>Other Works</template>
					</ButtonLink>

					<ButtonLink href="#contact" class="group" v-bind="$attrs">
						<template #icon>
							<ShipWheelIcon
								class="
									inline-block
									w-[24px]
									h-[24px]
									-mt-2
									-mr-2
									group-hover:animate-turn
								"
							/>
						</template>
						<template #cta>Contact</template>
					</ButtonLink>
				</ul>
			</nav>
		</div>
	</header>
</template>

<script>
import { Blava } from 'blava';
import ButtonLink from '@/components/ButtonLink.vue';
import WavesIcon from '@/components/Icons/WavesIcon.vue';
import SailboatIcon from '@/components/Icons/SailboatIcon.vue';
import ShipWheelIcon from '@/components/Icons/ShipWheelIcon.vue';
import AnchorIcon from '@/components/Icons/AnchorIcon.vue';
import LighthouseIcon from '@/components/Icons/LighthouseIcon.vue';

import animation from '@/mixins/animation.js';

export default {
	mixins: [animation],

	components: {
		ButtonLink,
		WavesIcon,
		SailboatIcon,
		ShipWheelIcon,
		AnchorIcon,
		LighthouseIcon,
	},

	props: {
		/**
		 * Whether the anchor icon should be in its initial or dropped position
		 */
		anchorDropped: {
			type: Boolean,
		},

		/**
		 * Whether playback should be possible (e.g. for reduced motion preference)
		 */
		playbackDisabled: {
			type: Boolean,
		},

		/**
		 * Whether the background is currently animated
		 */
		playing: {
			type: Boolean,
			default: true,
		},
	},

	data() {
		return {
			blavas: [],
		};
	},

	mounted() {
		// Create blavas and manage animation based on visibility
		const shades = ['#072227', '#35858b', '#4fbdba', '#aefeff'];
		const blavas = [];

		for (let x = 0; x < 4; x++) {
			const blava = new Blava(this.$refs[`background-${x}`], {
				gradient: { from: shades[x], to: shades[x] },
				movementSpeed: 0.0009,
			});

			blavas.push(blava);
		}

		this.blavas = blavas;

		const observer = new IntersectionObserver(
			entries => {
				if (entries[0].intersectionRatio >= 0.5) {
					this.$emit('aweigh');
				}
			},
			{
				threshold: [0, 0.5],
			},
		);

		observer.observe(this.$el);
	},

	methods: {
		/**
		 * Trigger waves playback from mixin
		 */
		animate() {
			this.toggleWavesAnimation(!this.playbackDisabled && this.playing);
		},

		toggleWavesAnimation(play) {
			this.blavas.forEach(blava => blava[play ? 'play' : 'pause']());
		},

		triggerFirstSection() {
			this.$emit('dive');
		},
	},

	watch: {
		/**
		 * Ensure animation pauses on playing = false after mixin call
		 *
		 * @param {Boolean} newValue The new value of the property
		 */
		playing(newValue) {
			if (!this.playing) {
				this.toggleWavesAnimation(false);
			}
		},
	},
};
</script>

<style scoped lang="postcss">
header {
	@apply relative;
}

header canvas {
	@apply absolute bottom-0 w-full h-1/8  lg:h-1/3 z-1 opacity-100;
}

header::before {
	content: '';
	z-index: -100;

	@apply absolute inset-0 bg-theme-100;
}

#background-2 {
	bottom: 2rem;
}

#background-1 {
	bottom: 3rem;
}

#background-0 {
	bottom: 4rem;
}

#dive-icon {
	transition: top 1.5s;
}
</style>
