<template>
	<WavesHeader
		id="header"
		ref="header"
		@dive="diveIn"
		@aweigh="anchorDropped = false"
		@navigate="scrollToSection"
		:anchor-dropped="anchorDropped"
	/>

	<main ref="main" :class="textClass">
		<section id="about">
			<BubbleBackground
				:width="backgroundWidth"
				image-url="https://cdn.grayvold.me/file/grayvold-me-cdn/developer/images/daniel.png"
				class="mt-8 lg:mt-0 lg:absolute left-0 top-0"
			/>

			<div
				id="about-text"
				class="relative max-w-128 mx-auto lg:ml-auto lg:mr-8 px-4 pt-0 pb-2 lg:bg-theme-800 lg:text-theme-100 z-10 min-h-[500px]"
			>
				<i
					class="i-iconoir-sea-waves waves-icon block w-8 h-8 pt-12 mb-0 -ml-0.5 text-theme-900 lg:text-theme-100"
				/>

				<h2 class="mb-4">Who I am</h2>

				<p>
					A
					<a
						href="https://dgrayvold.com"
						alt="Check out my audio work"
						class="text-highlight"
					>
						composer, sound designer, and musician
					</a>
					who followed the currents to find the endless potential of tech in storytelling
					and communication.
				</p>
				<p>
					I took up development to create innovative art sailing on the ebb and flow of
					life in an ocean of digital content.
				</p>
				<p>
					Now I rise with the tides to make a more engaging world through web and
					automation technology as the senior developer at
					<a
						class="text-highlight"
						href="https://greatnews.life"
						rel="noopener noreferrer nofollow"
					>
						GreatNews.Life.
					</a>
				</p>
			</div>
		</section>

		<section id="projects">
			<i
				class="i-icon-park-outline-sailboat-one sailboat-icon block mb-2 mx-12 w-10 h-10 !stroke-theme-700 col-span-2"
			/>
			<h2 class="mx-12 col-span-2 mb-8">What I've made</h2>

			<FishBackground :width="backgroundWidth" :lines="12" class="absolute -mt-8 lg:mt-6" />

			<ProjectsList
				:projects="projects"
				:active-project="activeProject"
				@select="setActiveProject"
			/>
		</section>

		<section id="contact" class="relative text-center pb-32 overflow-hidden min-h-screen">
			<i class="i-mdi-ship-wheel block w-10 h-10 mt-32 mb-8 mx-auto text-theme-700" />

			<h2>
				<span>Let's set sail together</span>
			</h2>

			<ContactForm element-classes="bg-theme-950" />

			<i
				class="i-mdi-anchor absolute h-64 w-64 text-theme-850 -bottom-16 right-8 transform -rotate-30 -z-1"
			/>
		</section>
	</main>

	<div class="fixed inset-0 -z-10 transition-colors duration-700" :class="backgroundClass" />
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import BubbleBackground from '@/components/BubbleBackground.vue';
import FishBackground from '@/components/FishBackground.vue';
import WavesHeader from '@/components/WavesHeader.vue';
import ProjectsList from '@/components/ProjectsList.vue';
import ContactForm from '@/components/ContactForm.vue';
import { debounce } from 'lodash-es';

import type { Project } from '@/types/types';

import { useAnimation } from '@/composables/animation';
import { useUi } from '@/composables/ui';

const { setActiveSection, setPlaybackDisabled } = useAnimation();
const { smoothScroll } = useUi();

/**
 * Whether the anchor icon in the header is visible or dropped into the sea
 */
const anchorDropped = ref(false);

/**
 * The list of projects to show off
 */
const projects = ref<Project[]>([]);

/**
 * The currently displayed project
 */
const activeProject = ref();

/**
 * The app header element
 */
const header = ref<InstanceType<typeof WavesHeader>>();

/**
 * The app main element
 */
const main = ref<HTMLElement>();

/**
 * The intersection observer for background color reactivity
 */
const backgroundObserver = ref();

/**
 * The section currently taking up a majority of the viewport
 */
const currentDominantSection = ref<HTMLElement>();

/**
 * The height of the current dominant section
 */
const currentDominantSectionHeight = ref<number>(0);

/**
 * The width of the background container in pixels
 */
const backgroundWidth = ref<number>();

/**
 * The current color class to apply to the background
 */
const backgroundClass = ref('bg-theme-100');

/**
 * The current color class to apply to text elements
 */
const textClass = ref('text-theme-900');

/**
 * Specially animate a scroll to the first section of the portfolio
 */
function diveIn() {
	anchorDropped.value = true;

	scrollToSection('about');
}

/**
 * Update the recorded measurement of page's main content width
 */
const updateBackgroundWidthMeasurement = debounce(
	function () {
		backgroundWidth.value = main.value?.getBoundingClientRect().width;
	},
	100,
	{ leading: true },
);

/**
 * Set the background color of the page based on the section currently dominating the screen space
 *
 * @param {IntersectionObserverEntry[]} entries The entries to process
 */
function setBackground(entries: IntersectionObserverEntry[]) {
	let latestDominantSection: HTMLElement | undefined;
	let latestDominantSectionHeight: number = 0;

	// Update the current dominant section height if it changed
	const updatedCurrentDominantSection = entries.find(entry => {
		return entry.target === currentDominantSection.value;
	});

	if (updatedCurrentDominantSection) {
		currentDominantSectionHeight.value = updatedCurrentDominantSection.intersectionRect.height;
	}

	// Find the intersection height of the dominant section in the current set of entries
	entries.forEach(entry => {
		if (!entry.isIntersecting) {
			return;
		}

		if (!latestDominantSection || latestDominantSectionHeight < entry.intersectionRect.height) {
			latestDominantSection = entry.target as HTMLElement;
			latestDominantSectionHeight = entry.intersectionRect.height;
			return;
		}
	});

	// Update the record for current dominant section if changed…
	if (
		latestDominantSection &&
		currentDominantSection.value !== latestDominantSection &&
		currentDominantSectionHeight.value < latestDominantSectionHeight
	) {
		setActiveSection(latestDominantSection?.id);
		currentDominantSection.value = latestDominantSection;
		currentDominantSectionHeight.value = latestDominantSectionHeight;
	}
	// …or stop if not
	else {
		return;
	}

	// Update color classes if dominant section changed
	switch (currentDominantSection.value?.id) {
		case 'header':
		case 'about':
			backgroundClass.value = 'bg-theme-600';
			textClass.value = 'text-theme-900';
			break;
		case 'projects':
			backgroundClass.value = 'bg-theme-850';
			textClass.value = 'text-theme-100';
			break;
		case 'other':
			backgroundClass.value = 'bg-theme-900';
			textClass.value = 'text-theme-100';
			break;
		case 'contact':
			backgroundClass.value = 'bg-theme-950';
			textClass.value = 'text-theme-100';
			break;
	}
}

/**
 * Set the currently active project
 *
 * @param activeProjectIndex The index of the project to display
 */
function setActiveProject(activeProjectIndex: number) {
	activeProject.value = projects.value[activeProjectIndex];
}

/**
 * Smoothly scroll to a section of the portfolio
 *
 * @param id The ID of the section to scroll to
 */
async function scrollToSection(id: string) {
	const element = document.querySelector(`#${id}`);
	const offset = element?.getBoundingClientRect().top ?? 0;

	setPlaybackDisabled(true);

	return smoothScroll(offset, 90).then(() => setPlaybackDisabled(false));
}

onMounted(async () => {
	projects.value = await fetch('https://cdn.grayvold.me/developer/data/projects.json').then(
		response => response.json(),
	);

	activeProject.value = projects.value[0];

	const mediaQuery = matchMedia('(prefers-reduced-motion: reduce)');

	setPlaybackDisabled(mediaQuery.matches);

	mediaQuery.addEventListener('change', () => setPlaybackDisabled(mediaQuery.matches));

	// Set initial background width measurement
	backgroundWidth.value = main.value?.getBoundingClientRect().width;

	window.addEventListener('resize', updateBackgroundWidthMeasurement);

	// Change playback ability based on window visibility
	window.addEventListener('visibilitychange', function () {
		setPlaybackDisabled(document.visibilityState != 'visible');
	});

	// Set up background style reactivity
	backgroundObserver.value = new IntersectionObserver(setBackground, {
		threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
	});

	main.value
		?.querySelectorAll('section')
		.forEach(section => backgroundObserver.value.observe(section));

	backgroundObserver.value.observe(header.value?.$el);
});

onBeforeUnmount(() => {
	window.removeEventListener('resize', updateBackgroundWidthMeasurement);
});
</script>

<style lang="postcss">
@import '/public/animations.css';

p {
	@apply font-text;
}

h1,
h2,
h3,
h4,
h5,
h6 {
	@apply font-display !font-bold;
}

form * {
	@apply font-display;
}

.sailboat-icon path {
	@apply stroke-3;
}

.sailboat-icon-thicker path {
	@apply stroke-4;
}

/* Alter the waves icon stroke-width */
.waves-icon path {
	stroke-width: 2;
}
</style>

<style scoped lang="postcss">
h2 {
	@apply text-4xl transition-colors;
}

main > section {
	@apply min-h-[600px] mt-0 px-12 py-8;
}

#about {
	@apply relative px-0 mb-8 pt-0;
}

#about-text p {
	@apply text-2xl mb-4;
}

#contact {
	@apply min-h-screen;
}

#projects {
	@apply px-0;
}

#projects-list {
	@apply w-full grid gap-x-8 gap-y-16 justify-center md:grid-cols-[repeat(auto-fit,minmax(300px,1fr))];
}

.text-highlight {
	font-variant: all-small-caps;

	@apply font-bold bg-gradient-to-r from-theme-800 to-theme-600 lg:from-theme-100 lg:to-theme-700 bg-no-repeat to-transparent;

	background-size: 100% 0.25rem;
	background-position: left 90%;
}
</style>
