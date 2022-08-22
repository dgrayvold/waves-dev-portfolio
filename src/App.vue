<template>
	<Header
		ref="header"
		@dive="diveIn"
		@aweigh="anchorDropped = false"
		:anchorDropped="anchorDropped"
	/>

	<main>
		<section id="about" ref="initialSection" class="grid grid-cols-2">
			<div class="w-100 h-100 mx-8 rounded-xl inline-block bg-black"></div>

			<div class="max-w-128 ml-auto">
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
			<h2 class="text-theme-100 col-span-2 mb-0">What I've made</h2>

			<ul
				class="
					col-span-2
					xl:col-span-1
					max-h-108
					mb-8
					rounded-xl
					bg-theme-700 bg-opacity-30
					border-1 border-theme-100 border-opacity-50
					overflow-y-scroll
				"
			>
				<li
					v-for="project in projects"
					:key="project.project"
					class="text-theme-100 transition-colors"
					even=" bg-theme-600 bg-opacity-10"
					hover="bg-theme-800 bg-opacity-100"
					:class="{
						'!bg-opacity-100 !bg-theme-900': activeProject.project == project.project,
					}"
				>
					<button
						class="w-full text-left cursor-pointer"
						p="x-2 y-1"
						@click="activeProject = projects.find(p => p.project == project.project)"
					>
						<h3 class="text-2xl">
							{{ project.project }}
						</h3>
						<p class="text-sm leading-2">{{ project.location }}</p>

						<ul class="flex gap-2 my-2">
							<li
								v-for="tag in project.tags"
								:key="tag"
								class="px-1.5 text-theme-900 bg-theme-600 rounded uppercase text-xs"
							>
								{{ tag }}
							</li>
						</ul>
					</button>
				</li>
			</ul>

			<figure
				class="
					relative
					col-span-2
					xl:col-span-1
					mb-8
					rounded-xl
					bg-theme-900 bg-opacity-50
					border-1 border-theme-100 border-opacity-50
					text-theme-100
					overflow-hidden
				"
			>
				<img
					:src="activeProject.loadedImage?.src ?? activeProject.image"
					class="
						border-b-1 border-theme-100 border-opacity-50
						w-full
						max-h-72
						object-cover object-top
					"
				/>

				<p class="text-2xl px-2">{{ activeProject.project }}</p>
				<p class="px-2">{{ activeProject.description }}</p>

				<a
					v-show="activeProject.url != null"
					:href="activeProject.url"
					target="_blank"
					class="
						inline-block
						bg-theme-700
						mx-2
						px-2
						pb-1
						my-2
						rounded
						text-theme-900
						group
					"
				>
					<span class="leading-4 align-middle pr-1">{{ activeProject.cta ?? 'Go' }}</span>
					<SailboatIcon
						class="
							inline-block
							align-middle
							h-4
							stroke-2
							transition-all
							transform
							group-hover:translate-x-2
						"
					/>
				</a>
			</figure>
		</section>

		<section id="contact" class="relative text-center pb-32 overflow-hidden">
			<h2 class="inline-block text-theme-100">
				<ShipWheelIcon class="w-8 h-8 mb-0 mx-auto text-theme-700" />
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
					left-8
					transform
					-rotate-30
					-z-1
				"
			/>
		</section>
	</main>
</template>

<script>
import Header from '@/components/Header.vue';
import Snowflake from '@/components/Snowflake.vue';
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
		ContactForm,
		LighthouseIcon,
		WavesIcon,
		SailboatIcon,
		ShipWheelIcon,
		Snowflake,
		AnchorIcon,
	},

	data() {
		return {
			anchorDropped: false,
			projects: projects,
			activeProject: projects[0],
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
	},

	methods: {
		async scrollToSection(id) {
			const element = document.querySelector(`#${id}`);
			const offset = element.getBoundingClientRect().top;

			ui.smoothScroll(offset, 90);
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
	@apply text-4xl;
}

main > section {
	@apply mt-0 px-12 py-24;
}

#about {
	@apply relative pt-8 pb-24 bg-theme-600;
}

#projects {
	@apply relative bg-theme-850;
	background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23aefeff' fill-opacity='0.03' fill-rule='evenodd'/%3E%3C/svg%3E");
}

#projects-list {
	@apply w-full grid gap-x-8 gap-y-16 justify-center md:grid-cols-[repeat(auto-fit,minmax(300px,1fr))];
}
</style>
