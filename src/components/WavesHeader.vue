<template>
	<header ref="root" class="relative h-screen min-h-180 w-full overflow-hidden bg-theme-100">
		<canvas
			v-for="(_, index) in 4"
			:key="index"
			ref="blavaCanvasElements"
			:id="`background-${index}`"
		/>

		<div class="max-w-192 mx-auto mt-16 p-4 rounded-xl">
			<h1 class="leading-12 lg:leading-16 px-8" text="5xl lg:6xl center theme-850">
				Hi, I'm Daniel Grayvold
			</h1>
			<p class="text-center px-8" text="3xl lg:4xl theme-800">
				I'm making waves in creative media &amp; tech
			</p>

			<nav class="flex justify-center mt-14 px-4 text-theme-900">
				<button
					@click="() => emit('dive')"
					class="hidden sm:block top-0 pr-9 text-center transition-colors text-theme-800 hover:text-theme-900"
				>
					<i
						id="dive-icon"
						class="i-mdi-anchor block relative w-28 h-28 top-0 transform origin-center mx-auto -rotate-45 -translate-x-2 transition-all ease-out"
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
					class="grid grid-rows-[repeat(3,1fr),auto] gap-3 -mt-4 lg:gap-2 px-10 justify-start sm:border-l-2 border-theme-800"
				>
					<IconLink
						v-for="link in sectionLinks"
						:key="link.url"
						:href="link.url"
						class="group"
						v-bind="$attrs"
					>
						<template #icon>
							<i class="inline-block w-24px h-24px" :class="link.classes" />
						</template>
						<template #cta> {{ link.cta }} </template>
					</IconLink>

					<div class="flex gap-6 pl-2.5 mt-2">
						<a
							v-for="link in externalLinks"
							:key="link.url"
							:href="link.url"
							target="_blank"
							class="inline-block group w-6 h-6 rounded transition-colors"
							:title="link.title"
						>
							<i
								class="inline-block w-full h-full text-theme-800 transition-colors group-hover:text-theme-950 focus:text-theme-950"
								:class="link.classes"
							/>
						</a>
					</div>
				</ul>
			</nav>
		</div>
	</header>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Blava } from 'blava';
import IconLink from '@/components/IconLink.vue';
import { useAnimation } from '@/composables/animation';

defineProps({
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
});

const emit = defineEmits(['aweigh', 'dive']);

const { registerAnimationFunction } = useAnimation();

/**
 * The header HTML element
 */
const root = ref();

/**
 * Links to internal sections
 */
const sectionLinks = ref([
	{
		url: '#about',
		cta: 'About',
		classes: 'i-iconoir-sea-waves group-hover:animate-float waves-icon',
	},
	{
		url: '#projects',
		cta: 'Projects',
		classes: 'i-icon-park-outline-sailboat-one group-hover:animate-boat sailboat-icon-thicker',
	},
	{
		url: '#contact',
		cta: 'Contact',
		classes: 'i-mdi-ship-wheel stroke-128 group-hover:animate-turn',
	},
]);

/**
 * Links to external sites
 */
const externalLinks = ref([
	{
		url: 'https://github.com/dgrayvold',
		title: 'View my GitHub profile',
		classes: 'i-akar-icons-github-fill',
	},
	{
		url: 'https://dgrayvold.com',
		title: 'Check out my audio work',
		classes: 'i-fontisto-music-note',
	},
	{
		url: 'https://dgrayvold.com/photography',
		title: 'Gaze at my photography',
		classes: 'i-ant-design-camera-filled',
	},
]);

/**
 * The canvas elements for the blavas
 */
const blavaCanvasElements = ref([]);

/**
 * The Blava instances making up the background waves
 */
const blavaInstances = ref<
	{
		play: () => void;
		pause: () => void;
	}[]
>([]);

registerAnimationFunction('header', animate);

onMounted(() => {
	// Create blavas and manage animation based on visibility
	const shades = ['#072227', '#35858b', '#4fbdba', '#aefeff'];

	for (let index = 0; index < 4; index++) {
		const blava = new Blava(blavaCanvasElements.value[index], {
			gradient: { from: shades[index], to: shades[index] },
			movementSpeed: 0.0009,
		});

		blavaInstances.value.push(blava);
	}

	const observer = new IntersectionObserver(
		entries => {
			if (entries[0].intersectionRatio >= 0.5) {
				emit('aweigh');
			}
		},
		{
			threshold: [0, 0.5],
		},
	);

	observer.observe(root.value);
});

/**
 * Handle waves animation playback state
 *
 * @param isPlaying Whether animation is active
 */
function animate(isPlaying?: boolean) {
	blavaInstances.value.forEach(blava => blava[isPlaying ? 'play' : 'pause']());
}
</script>

<style scoped lang="postcss">
header {
	@apply relative;
}

header canvas {
	@apply absolute bottom-0 w-full h-1/4  lg:h-1/3 z-1 opacity-100;
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
