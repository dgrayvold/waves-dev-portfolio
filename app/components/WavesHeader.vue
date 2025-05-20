<template>
	<header
		id="header"
		ref="header"
		class="relative h-screen min-h-180 w-full overflow-hidden bg-theme-100 before:(absolute inset-0 bg-theme-100 content-empty -z-100)"
	>
		<canvas
			v-for="(_, index) in 4"
			:id="`background-${index}`"
			:key="index"
			ref="blavaCanvasElements"
			class="absolute bottom-0 z-1 h-1/4 w-full opacity-100 lg:h-1/3"
		/>

		<div class="mx-auto mt-8 max-w-192 rounded-xl p-2 md:(mt-16 p-4)">
			<h1
				class="px-8 text-center text-5xl text-theme-850 leading-12 lg:(text-6xl leading-16)"
			>
				Hi, I'm Daniel Grayvold
			</h1>

			<p class="px-8 text-center text-3xl text-theme-800 lg:text-4xl">
				I'm making waves in creative media &amp; tech
			</p>

			<nav class="mt-14 flex justify-center px-4 text-theme-900">
				<button
					class="top-0 hidden pr-9 text-center text-theme-800 transition-colors sm:block hover:text-theme-900"
					aria-label="Go to main content"
					@click="() => emit('dive')"
				>
					<i
						id="dive-icon"
						class="i-mdi-anchor relative top-0 mx-auto block h-28 w-28 origin-center transform transition-all ease-out -translate-x-2 -rotate-45"
						:class="{
							'top-128': anchorDropped,
						}"
					/>

					<span
						class="relative top-0 text-2xl uppercase transition-all duration-300"
						:class="[anchorDropped ? 'top-8 opacity-0' : '']"
					>
						Dive in
					</span>
				</button>

				<ul
					class="grid grid-rows-[repeat(3,1fr),auto] justify-start gap-3 border-theme-800 px-10 lg:gap-2 sm:border-l-2"
				>
					<li v-for="link in sectionLinks" :key="link.url">
						<IconLink :href="link.url" class="group" v-bind="$attrs">
							<template #icon>
								<i class="inline-block h-24px w-24px" :class="link.classes" />
							</template>
							<template #cta> {{ link.cta }} </template>
						</IconLink>
					</li>

					<li>
						<ul class="mt-2 flex gap-6 pl-2.5">
							<li v-for="link in externalLinks" :key="link.url">
								<a
									:href="link.url"
									target="_blank"
									class="group inline-block h-6 w-6 rounded transition-colors"
									:title="link.title"
								>
									<i
										class="inline-block h-full w-full text-theme-800 transition-colors focus:text-theme-950 group-hover:text-theme-950"
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
