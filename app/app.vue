<template>
	<div>
		<WavesHeader
			ref="header"
			:anchor-dropped="anchorDropped"
			:active="activeSection === 'header'"
			@dive="diveIn"
			@aweigh="anchorDropped = false"
			@navigate="scrollToSection"
		/>

		<main ref="main" :class="textClass">
			<section id="about">
				<client-only>
					<BubbleBackground
						:width="backgroundWidth"
						image-url="https://cdn.grayvold.me/file/grayvold-me-cdn/developer/images/daniel.png"
						class="left-0 top-0 mt-8 lg:(absolute mt-0)"
						:active="activeSection === 'about'"
					/>
				</client-only>

				<div
					id="about-text"
					class="relative z-10 mx-auto max-w-140 min-h-[500px] px-4 pb-2 pt-0 lg:(ml-auto mr-8 bg-theme-800 text-theme-100)"
				>
					<i
						class="i-iconoir-sea-waves waves-icon mb-0 block h-8 w-8 pt-12 text-theme-900 -ml-0.5 lg:text-theme-100"
					/>

					<h2 class="mb-4">Who I am</h2>

					<p>
						A
						<a
							href="https://dgrayvold.com"
							alt="Check out my audio work"
							class="text-highlight"
						>
							composer, sound designer, and musician</a
						>
						who followed the currents to find the endless potential of tech in
						storytelling and communication.
					</p>
					<p>
						I took up development to create innovative art sailing on the ebb and flow
						of life in an ocean of digital content.
					</p>
					<p>
						Now I rise with the tides to make a more engaging world through web and
						automation technology as the senior developer at
						<a
							class="text-highlight"
							href="https://greatnews.life"
							rel="noopener noreferrer nofollow"
						>
							GreatNews.Life</a
						>.
					</p>
				</div>
			</section>

			<section id="projects">
				<i
					class="i-icon-park-outline-sailboat-one sailboat-icon col-span-2 mx-12 mb-2 block h-10 w-10 !stroke-theme-700"
				/>
				<h2 class="col-span-2 mx-12 mb-8">What I've made</h2>

				<client-only>
					<FishBackground
						:width="backgroundWidth"
						:lines="12"
						class="absolute -mt-8 lg:mt-6"
						:active="activeSection === 'projects'"
					/>
				</client-only>

				<ProjectsList
					:projects="projects"
					:active-project="activeProject"
					@select="setActiveProject"
				/>
			</section>

			<section id="contact" class="relative min-h-screen overflow-hidden pb-32 text-center">
				<i class="i-mdi-ship-wheel mx-auto mb-8 mt-32 block h-10 w-10 text-theme-700" />

				<h2>
					<span>Let's set sail together</span>
				</h2>

				<ContactForm element-classes="bg-theme-950" />

				<i
					class="i-mdi-anchor absolute right-8 h-64 w-64 transform text-theme-850 -bottom-16 -z-1 -rotate-30"
				/>
			</section>
		</main>

		<div class="fixed inset-0 transition-colors duration-700 -z-10" :class="backgroundClass" />
	</div>
</template>

<script lang="ts">
const sectionIds = ['header', 'about', 'projects', 'other', 'contact'] as const;
type SectionId = (typeof sectionIds)[number];

function isSectionId(id: string): id is SectionId {
	return sectionIds.includes(id as SectionId);
}
</script>

<script setup lang="ts">
import { projects } from '#nuxt-prepare';

useSeoMeta({
	charset: 'utf-8',
	viewport: 'width=device-width,initial-scale=1.0',
	themeColor: '#001015',
	description: 'A wildly creative tinkerer for media and web',
	author: 'Daniel Grayvold',
	ogTitle: 'Daniel Grayvold',
	ogType: 'website',
	ogUrl: 'https://grayvold.me',
	ogImage: 'https://cdn.grayvold.me/developer/images/waves-dev-portfolio.png',
});

const { width: backgroundWidth } = useWindowSize({ initialWidth: 0 });

/**
 * Whether the anchor icon in the header is visible or dropped into the sea
 */
const anchorDropped = ref(false);

/**
 * The currently displayed project
 */
const activeProject = ref();

const header = useTemplateRef('header');

const main = useTemplateRef('main');

/**
 * The intersection observer for background color reactivity
 */
const backgroundObserver = ref();

const playbackDisabled = ref(false);

/**
 * The section currently taking up a majority of the viewport
 */
const currentDominantSection = ref<HTMLElement>();

/**
 * The height of the current dominant section
 */
const currentDominantSectionHeight = ref<number>(0);

/**
 * The current color class to apply to the background
 */
const backgroundClass = ref('bg-theme-100');

/**
 * The current color class to apply to text elements
 */
const textClass = ref('text-theme-900');

const activeSection = computed(() => {
	if (
		!playbackDisabled.value &&
		currentDominantSection.value &&
		isSectionId(currentDominantSection.value.id)
	) {
		return currentDominantSection.value.id;
	}

	return undefined;
});

/**
 * Specially animate a scroll to the first section of the portfolio
 */
function diveIn() {
	anchorDropped.value = true;

	scrollToSection('about');
}

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
		currentDominantSection.value = latestDominantSection;
		currentDominantSectionHeight.value = latestDominantSectionHeight;
	}
	// …or stop if not
	else {
		return;
	}

	// Update color classes if dominant section changed
	switch (currentDominantSection.value?.id) {
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
		case 'header':
		case 'about':
		default:
			backgroundClass.value = 'bg-theme-600';
			textClass.value = 'text-theme-900';
			break;
	}
}

/**
 * Set the currently active project
 *
 * @param activeProjectIndex The index of the project to display
 */
function setActiveProject(activeProjectIndex: number) {
	activeProject.value = projects[activeProjectIndex];
}

/**
 * Smoothly scroll to a section of the portfolio
 *
 * @param id The ID of the section to scroll to
 */
async function scrollToSection(id: string) {
	const element = document.querySelector(`#${id}`);
	const offset = element?.getBoundingClientRect().top ?? 0;

	playbackDisabled.value = true;

	return smoothScroll(offset, 90).then(() => (playbackDisabled.value = false));
}

onMounted(async () => {
	activeProject.value = projects[0];

	const mediaQuery = matchMedia('(prefers-reduced-motion: reduce)');

	playbackDisabled.value = mediaQuery.matches;

	mediaQuery.addEventListener('change', () => (playbackDisabled.value = mediaQuery.matches));

	// Change playback ability based on window visibility
	window.addEventListener(
		'visibilitychange',
		() => (playbackDisabled.value = document.visibilityState !== 'visible'),
	);

	// Set up background style reactivity
	backgroundObserver.value = new IntersectionObserver(setBackground, {
		threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
	});

	main.value
		?.querySelectorAll('section')
		.forEach(section => backgroundObserver.value.observe(section));

	backgroundObserver.value.observe(header.value?.$el);
});
</script>

<style lang="postcss">
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

	/**
     * Prevent Safari from rendering small caps with added spacing at the end of the link. 
     * 
     * See https://community.adobe.com/t5/adobe-fonts-discussions/small-caps-rendering-issue-in-safari-macos-and-ios/td-p/11563177
     */
	font-synthesis: none;

	@apply font-bold bg-gradient-to-r from-theme-800 to-theme-600 lg:from-theme-100 lg:to-theme-700 bg-no-repeat to-transparent;

	background-size: 100% 0.25rem;
	background-position: left 90%;
}

@keyframes boat {
	0% {
		transform: translateY(0px) rotateZ(0deg);
	}
	33% {
		transform: translateY(-4px) rotateX(2deg) rotateZ(5deg);
	}
	66% {
		transform: translateY(4px) rotateZ(-6deg);
	}
	100% {
		transform: translateY(0px) rotateZ(0deg);
	}
}

@keyframes float {
	0% {
		transform: translateY(0px);
	}
	50% {
		transform: translateY(-4px);
	}
	75% {
		transform: translateY(4px);
	}
	100% {
		transform: translateY(0px);
	}
}

@keyframes turn {
	0% {
		transform: rotateZ(0deg);
	}
	50% {
		transform: rotateZ(90deg);
	}
	100% {
		transform: rotateZ(0deg);
	}
}
</style>
