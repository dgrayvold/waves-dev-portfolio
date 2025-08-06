<template>
	<header
		id="header"
		ref="header"
		class="bg-theme-100 h-screen min-h-180 w-full relative overflow-hidden before:(bg-theme-100 content-empty inset-0 absolute -z-100)"
	>
		<canvas
			v-for="(_, index) in 4"
			:id="`background-${index}`"
			:key="index"
			ref="blavaCanvasElements"
			class="opacity-100 h-1/4 w-full bottom-0 absolute z-1 lg:h-1/3"
		/>

		<div class="mx-auto mt-8 p-2 rounded-xl max-w-192 md:(mt-16 p-4)">
			<h1
				class="text-5xl text-theme-850 leading-12 px-8 text-center lg:(text-6xl leading-16)"
			>
				Hi, I'm Daniel Grayvold
			</h1>

			<p class="text-3xl text-theme-800 px-8 text-center lg:text-4xl">
				I'm making waves in creative media &amp; tech
			</p>

			<nav class="text-theme-900 mt-14 px-4 flex justify-center">
				<button
					class="text-theme-800 pr-9 text-center hidden cursor-pointer transition-colors top-0 hover:text-theme-900 sm:block"
					aria-label="Go to main content"
					@click="() => emit('dive')"
				>
					<i
						id="dive-icon"
						class="i-mdi:anchor mx-auto h-28 w-28 block origin-center transform transition-all ease-out top-0 relative -translate-x-2 -rotate-45"
						:class="{
							'top-128': anchorDropped,
						}"
					/>

					<span
						class="text-2xl uppercase transition-all duration-300 top-0 relative"
						:class="[anchorDropped ? 'top-8 opacity-0' : '']"
					>
						Dive in
					</span>
				</button>

				<ul
					class="px-10 border-theme-800 gap-3 grid grid-rows-[repeat(3,1fr),auto] justify-start sm:border-l-2 lg:gap-2"
				>
					<li v-for="link in sectionLinks" :key="link.url">
						<IconLink :href="link.url" class="group" v-bind="$attrs">
							<template #icon>
								<i class="h-24px w-24px inline-block" :class="link.classes" />
							</template>
							<template #cta> {{ link.cta }} </template>
						</IconLink>
					</li>

					<li>
						<ul class="mt-2 pl-2.5 flex gap-6">
							<li v-for="link in externalLinks" :key="link.url">
								<a
									:href="link.url"
									target="_blank"
									class="group rounded h-6 w-6 inline-block transition-colors"
									:title="link.title"
								>
									<i
										class="text-theme-800 h-full w-full inline-block transition-colors focus:text-theme-950 group-hover:text-theme-950"
										:class="link.classes"
									/>
								</a>
							</li>
						</ul>
					</li>
				</ul>
			</nav>
		</div>
	</header>
</template>

<script setup lang="ts">
import { Blava } from 'blava';

const props = defineProps<{
	anchorDropped: boolean;

	active: boolean;
}>();

const emit = defineEmits(['aweigh', 'dive']);

const header = useTemplateRef('header');

/**
 * Links to internal sections
 */
const sectionLinks = ref([
	{
		url: '#about',
		cta: 'About',
		classes: 'i-iconoir:sea-waves group-hover:animate-float waves-icon',
	},
	{
		url: '#projects',
		cta: 'Projects',
		classes: 'i-icon-park-outline:sailboat-one group-hover:animate-boat sailboat-icon-thicker',
	},
	{
		url: '#contact',
		cta: 'Contact',
		classes: 'i-mdi:ship-wheel stroke-128 group-hover:animate-turn',
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
		url: 'https://grayvold.com',
		title: 'Check out my audio work',
		classes: 'i-fontisto-music-note',
	},
	{
		url: 'https://grayvold.com/photography',
		title: 'Gaze at my photography',
		classes: 'i-ant-design-camera-filled',
	},
]);

/**
 * The canvas elements for the blavas
 */
const blavaCanvasElements = useTemplateRef('blavaCanvasElements');

/**
 * The Blava instances making up the background waves
 */
const blavaInstances = ref<
	{
		play: () => void;
		pause: () => void;
	}[]
>([]);

watch(
	() => props.active,
	isActive => {
		blavaInstances.value.forEach(blava => blava[isActive ? 'play' : 'pause']());
	},
);

onMounted(() => {
	// Create blavas and manage animation based on visibility
	const shades = ['#072227', '#35858b', '#4fbdba', '#aefeff'];

	for (let index = 0; index < 4; index++) {
		const blava = new Blava(blavaCanvasElements.value![index], {
			gradient: { from: shades[index], to: shades[index] },
			movementSpeed: 0.0009,
		});

		blavaInstances.value.push(blava);
	}

	const observer = new IntersectionObserver(
		entries => {
			if (entries[0] && entries[0].intersectionRatio >= 0.5) {
				emit('aweigh');
			}
		},
		{
			threshold: [0, 0.5],
		},
	);

	observer.observe(header.value!);
});
</script>

<style scoped lang="postcss">
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
