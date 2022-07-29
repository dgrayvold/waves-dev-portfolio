<template>
	<header class="relative h-200 w-full overflow-hidden">
		<canvas ref="background-0" id="background-0"></canvas>
		<canvas ref="background-1" id="background-1"></canvas>
		<canvas ref="background-2" id="background-2"></canvas>
		<canvas ref="background-3" id="background-3"></canvas>

		<div id="cutout" class="w-192 mx-auto mt-16 p-4 rounded-xl">
			<h1 class="leading-16 px-8 text-center" text="6xl theme-850">
				Hi, I'm Daniel
			</h1>
			<p class="text-center px-8" text="4xl theme-800">
				I'm making waves in creative media &amp; tech
			</p>

			<nav class="grid md:flex gap-4 lg:gap-8 justify-center mt-14 px-4">
				<ButtonLink href="#about">
					<template #icon>
						<WavesIcon
							class="w-[24px] h-[24px] -mt-2 -mr-2 inline-block"
						/>
					</template>
					<template #cta>About</template>
				</ButtonLink>

				<ButtonLink>
					<template #icon>
						<SailboatIcon
							class="
								inline-block
								w-[24px]
								h-[24px]
								-mt-2
								stroke-current stroke-4
							"
						/>
					</template>
					<template #cta>Projects</template>
				</ButtonLink>

				<ButtonLink>
					<template #cta>Skills</template>
				</ButtonLink>

				<ButtonLink>
					<template #icon>
						<svg
							class="inline-block w-[24px] h-[24px] -mt-2"
							viewBox="0 0 24 24"
						>
							<path
								fill="currentColor"
								d="M8,10V8H9V4H8V3L12,1L16,3V4H15V8H16V10H14.74L8.44,13.64L9,10H8M13,8V4H11V8H13M7,23L7.04,22.76L16.15,17.5L16.67,20.88L13,23H7M8.05,16.17L15.31,12L15.83,15.37L7.43,20.22L8.05,16.17Z"
							/>
						</svg>
					</template>
					<template #cta>Contact</template>
				</ButtonLink>
			</nav>
		</div>
	</header>
</template>

<script>
import { Blava } from 'blava';
import ButtonLink from '@/components/ButtonLink.vue';
import WavesIcon from '@/components/Icons/WavesIcon.vue';
import SailboatIcon from '@/components/Icons/SailboatIcon.vue';

export default {
	components: { ButtonLink, WavesIcon, SailboatIcon },

	mounted() {
		// Create blavas and manage animation based on visibility
		const shades = ['#072227', '#35858b', '#4fbdba', '#aefeff'];
		const blavas = [];

		for (let x = 0; x < 4; x++) {
			const blava = new Blava(this.$refs[`background-${x}`], {
				gradient: shades[x],
			});

			blavas.push(blava);
		}

		window.addEventListener('visibilitychange', function () {
			blavas.forEach(blava =>
				document.hidden ? blava.pause() : blava.play(),
			);
		});

		const observer = new IntersectionObserver(
			entries => {
				blavas.forEach(blava =>
					blava[entries[0].isIntersecting ? 'play' : 'pause'](),
				);
			},
			{
				threshold: [0, 1],
			},
		);

		observer.observe(this.$el);
	},
};
</script>

<style scoped lang="postcss">
header canvas {
	@apply absolute sm:w-[200vw] lg:w-full h-full -z-1 opacity-90 transform rotate-180;
}

#cutout {
	/* @apply bg-theme-100; */

	/* box-shadow: 0 0 5px -2px black inset; */
}
</style>
