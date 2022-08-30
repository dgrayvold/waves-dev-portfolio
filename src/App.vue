<template>
	<Header
		ref="header"
		@dive="diveIn"
		@aweigh="anchorDropped = false"
		:anchorDropped="anchorDropped"
	/>

	<main ref="main" :class="textClass">
		<section id="about" ref="initialSection" class="grid grid-cols-2">
			<Portrait class="relative -top-32" />

			<div class="max-w-128 ml-auto mr-8">
				<WavesIcon class="w-8 h-8 mb-0 -ml-0.5 text-theme-800" />
				<h2 class="mb-4">Who I am</h2>

				<p class="text-2xl">Lorem ipsum dolor sit amet.</p>
				<p class="text-2xl">
					Interdum mattis fringilla eleifend semper imperdiet fames mattis purus.
				</p>
				<p class="text-2xl">
					Dictum id tempor odio interdum est aliquam luctus a at. Interdum tempus sapien
					quam platea molestie nibh non etiam turpis justo.
				</p>
			</div>
		</section>

		<section id="projects" class="grid grid-cols-2 grid-rows-[1rem,auto] gap-8">
			<SailboatIcon class="w-10 h-10 !stroke-theme-700 stroke-3 col-span-2" />
			<h2 class="col-span-2 mb-0">What I've made</h2>

			<ProjectsList
				:projects="projects"
				:activeProject="activeProject"
				@select="setActiveProject"
			/>
		</section>

		<section id="contact" class="relative text-center pb-32 overflow-hidden">
			<h2 class="inline-block">
				<ShipWheelIcon class="w-10 h-10 mb-8 mx-auto text-theme-700" />
				<span>Let's set sail together</span>
			</h2>

			<ContactForm class="bg-theme-900" />

			<AnchorIcon
				class="
					absolute
					h-64
					w-64
					text-theme-850
					-bottom-16
					right-8
					transform
					-rotate-30
					-z-1
				"
			/>
		</section>
	</main>

	<div class="fixed inset-0 -z-10 transition-colors duration-700" :class="backgroundClass" />
</template>

<script>
import Header from '@/components/Header.vue';
import Portrait from '@/components/Portrait.vue';
import ProjectsList from '@/components/ProjectsList.vue';
import ContactForm from '@/components/ContactForm.vue';
import AnchorIcon from '@/components/Icons/AnchorIcon.vue';
import ShipWheelIcon from '@/components/Icons/ShipWheelIcon.vue';
import LighthouseIcon from '@/components/Icons/LighthouseIcon.vue';
import WavesIcon from '@/components/Icons/WavesIcon.vue';
import SailboatIcon from '@/components/Icons/SailboatIcon.vue';

import ui from '@/mixins/ui.js';

import projects from '/src/projects.json';

export default {
	components: {
		Header,
		Portrait,
		ProjectsList,
		ContactForm,
		LighthouseIcon,
		WavesIcon,
		SailboatIcon,
		ShipWheelIcon,
		AnchorIcon,
	},

	data() {
		return {
			anchorDropped: false,
			projects: projects,
			activeProject: projects[0],
			backgroundObserver: null,
			backgroundClass: 'bg-theme-100',
			textClass: 'theme-900',
			currentDominantSection: null,
			currentDominantSectionHeight: null,
		};
	},

	mounted() {
		// Load project images for later use
		this.projects.forEach((project, index) => {
			if (project.image == null) {
				return;
			}

			const loadedImage = new Image();

			loadedImage.onload = data => {
				this.projects[index].loadedImage = loadedImage;
			};

			loadedImage.src = project.image;
		});

		// Set up background style reactivity
		this.backgroundObserver = new IntersectionObserver(this.setBackground, {
			threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
		});

		this.$refs.main
			.querySelectorAll('section')
			.forEach(section => this.backgroundObserver.observe(section));
	},

	methods: {
		async scrollToSection(id) {
			const element = document.querySelector(`#${id}`);
			const offset = element.getBoundingClientRect().top;

			ui.smoothScroll(offset, 90);
		},

		setActiveProject(name) {
			this.activeProject = this.projects.find(project => project.project == name);
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
				case 'about':
					backgroundClass = 'bg-theme-600';
					textClass = 'text-theme-900';
					break;
				case 'projects':
					backgroundClass = 'bg-theme-850';
					textClass = 'text-theme-100';
					break;
				case 'contact':
					backgroundClass = 'bg-theme-900';
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
	},

	mixins: [ui],
};
</script>

<style scoped lang="postcss">
h2 {
	@apply text-4xl transition-colors;
}

main > section {
	@apply mt-0 px-12 py-24 min-h-screen;
}

#about {
	@apply relative pt-8 pb-24;
}

#projects-list {
	@apply w-full grid gap-x-8 gap-y-16 justify-center md:grid-cols-[repeat(auto-fit,minmax(300px,1fr))];
}
</style>
