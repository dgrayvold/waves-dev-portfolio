<template>
	<WavesHeader
		id="header"
		ref="header"
		@dive="diveIn"
		@aweigh="anchorDropped = false"
		@navigate="scrollToSection"
		:anchor-dropped="anchorDropped"
		:playback-disabled="playbackDisabled"
		:playing="currentDominantSection?.id == 'header'"
	/>

	<main ref="main" :class="textClass">
		<section id="about">
			<BubbleBackground
				:width="backgroundWidth"
				image-url="https://cdn.grayvold.me/file/grayvold-me-cdn/developer/images/daniel.png"
				:playback-disabled="playbackDisabled"
				:playing="currentDominantSection?.id == 'about'"
				class="mt-8 lg:mt-0 lg:absolute left-0 top-0"
			/>

			<div
				id="about-text"
				class="relative max-w-128 mx-auto lg:ml-auto lg:mr-8 px-4 pt-0 pb-2 lg:bg-theme-800 lg:text-theme-100 z-10 min-h-[500px]"
			>
				<WavesIcon
					class="waves-icon w-8 h-8 mb-0 -ml-0.5 text-theme-900 lg:text-theme-100"
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
			<SailboatIcon class="sailboat-icon mb-2 mx-12 w-10 h-10 !stroke-theme-700 col-span-2" />
			<h2 class="mx-12 col-span-2 mb-8">What I've made</h2>

			<FishBackground
				:width="backgroundWidth"
				:lines="12"
				:playback-disabled="playbackDisabled"
				:playing="currentDominantSection?.id == 'projects'"
				class="absolute -mt-8 lg:mt-6"
			/>

			<ProjectsList
				:projects="projects"
				:active-project="activeProject"
				@select="setActiveProject"
			/>
		</section>

		<section id="contact" class="relative text-center pb-32 overflow-hidden min-h-screen">
			<ShipWheelIcon class="block w-10 h-10 mt-32 mb-8 mx-auto text-theme-700" />
			<h2>
				<span>Let's set sail together</span>
			</h2>

			<ContactForm class="bg-theme-950" />

			<AnchorIcon
				class="absolute h-64 w-64 text-theme-850 -bottom-16 right-8 transform -rotate-30 -z-1"
			/>
		</section>
	</main>

	<div class="fixed inset-0 -z-10 transition-colors duration-700" :class="backgroundClass" />
</template>

<script>
import WavesHeader from '@/components/WavesHeader.vue';
import ProjectsList from '@/components/ProjectsList.vue';
import ContactForm from '@/components/ContactForm.vue';
import AnchorIcon from '~icons/mdi/anchor';
import ShipWheelIcon from '~icons/mdi/ship-wheel';
import WavesIcon from '~icons/iconoir/sea-waves';
import SailboatIcon from '~icons/icon-park-outline/sailboat-one';
import BubbleBackground from '@/components/BubbleBackground.vue';
import FishBackground from '@/components/FishBackground.vue';
import { debounce } from 'lodash-es';

import ui from '@/mixins/ui.js';

export default {
	components: {
		WavesHeader,
		ProjectsList,
		ContactForm,
		WavesIcon,
		SailboatIcon,
		ShipWheelIcon,
		AnchorIcon,
		BubbleBackground,
		FishBackground,
	},

	data() {
		return {
			anchorDropped: false,

			/**
			 * The list of projects to show off
			 */
			projects: [],

			/**
			 * The currently displayed project
			 */
			activeProject: undefined,

			/**
			 * The intersection observer for background color reactivity
			 */
			backgroundObserver: null,

			/**
			 * The current color class to apply to the background
			 */
			backgroundClass: 'bg-theme-100',

			/**
			 * The current color class to apply to text elements
			 */
			textClass: 'theme-900',

			/**
			 * The section currently taking up a majority of the viewport
			 */
			currentDominantSection: undefined,

			/**
			 * The height of the current dominant section
			 */
			currentDominantSectionHeight: null,

			/**
			 * The width of the background container in pixels
			 */
			backgroundWidth: undefined,

			/**
			 * Whether animations should be enabled
			 */
			playbackDisabled: false,
		};
	},

	async mounted() {
		this.projects = await fetch('https://cdn.grayvold.me/developer/data/projects.json').then(
			response => response.json(),
		);
		this.activeProject = this.projects[0];

		// Set initial measurement of background width
		this.backgroundWidth = this.$refs.main.getBoundingClientRect().width;

		// Set playback based on motion preference
		if (matchMedia('(prefers-reduced-motion: reduced)').matches) {
			this.playbackDisabled = true;
		}

		// Set up background style reactivity
		this.backgroundObserver = new IntersectionObserver(this.setBackground, {
			threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
		});

		this.$refs.main
			.querySelectorAll('section')
			.forEach(section => this.backgroundObserver.observe(section));
		this.backgroundObserver.observe(this.$refs.header.$el);

		window.addEventListener('resize', this.updateBackgroundWidthMeasurement);

		// Change playback ability based on window visibility
		window.addEventListener(
			'visibilitychange',
			function () {
				this.playbackDisabled = document.visibilityState != 'visible';
			}.bind(this),
		);
	},

	beforeUnmount() {
		window.removeEventListener('resize', this.updateBackgroundWidthMeasurement);
	},

	methods: {
		async scrollToSection(id) {
			const element = document.querySelector(`#${id}`);
			const offset = element.getBoundingClientRect().top;

			ui.smoothScroll(offset, 90);
		},

		/**
		 * Set the currently active project
		 *
		 * @param {Number} activeProjectIndex The index of the project to display
		 */
		setActiveProject(activeProjectIndex) {
			this.activeProject = this.projects[activeProjectIndex];
		},

		setBackground(entries) {
			let latestDominantSection;
			let latestDominantSectionHeight;

			// Update the current dominant section height if it changed
			const updatedCurrentDominantSection = entries.find(
				entry => entry.target == this.currentDominantSection,
			);

			if (updatedCurrentDominantSection) {
				this.currentDominantSectionHeight =
					updatedCurrentDominantSection.intersectionRect.height;
			}

			// Find the intersection height of the dominant section in the current set of entries
			entries.forEach(entry => {
				if (!entry.isIntersecting) {
					return;
				}

				if (
					latestDominantSection == null ||
					latestDominantSectionHeight < entry.intersectionRect.height
				) {
					latestDominantSection = entry.target;
					latestDominantSectionHeight = entry.intersectionRect.height;
					return;
				}
			});

			// Update the record for current dominant section if changed…
			if (
				this.currentDominantSection != latestDominantSection &&
				this.currentDominantSectionHeight < latestDominantSectionHeight
			) {
				this.currentDominantSection = latestDominantSection;
				this.currentDominantSectionHeight = latestDominantSectionHeight;
			}
			// …or stop if not
			else {
				return;
			}

			// Update background classes if dominant section changed
			let backgroundClass;
			let textClass;

			switch (this.currentDominantSection.id) {
				case 'header':
				case 'about':
					backgroundClass = 'bg-theme-600';
					textClass = 'text-theme-900';
					break;
				case 'projects':
					backgroundClass = 'bg-theme-850';
					textClass = 'text-theme-100';
					break;
				case 'other':
					backgroundClass = 'bg-theme-900';
					textClass = 'text-theme-100';
					break;
				case 'contact':
					backgroundClass = 'bg-theme-950';
					textClass = 'text-theme-100';
					break;
			}

			this.backgroundClass = backgroundClass;
			this.textClass = textClass;
		},

		diveIn() {
			this.$refs.header.toggleWavesAnimation();
			this.anchorDropped = true;
			this.scrollToSection('about');
		},

		/**
		 * Update the recorded measurement of page's main content width
		 */
		updateBackgroundWidthMeasurement: debounce(
			function () {
				this.backgroundWidth = this.$refs.main.getBoundingClientRect().width;
			},
			100,
			{ leading: true },
		),
	},

	mixins: [ui],
};
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

	@apply font-bold bg-gradient-to-r from-theme-800 to-theme-600 lg:from-theme-100 lg:to-theme-700 bg-no-repeat to-transparent;

	background-size: 100% 0.25rem;
	background-position: left 90%;
}
</style>
