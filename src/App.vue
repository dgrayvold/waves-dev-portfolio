<template>
	<section class="w-full h-192 bg-black">
		<Snowflake />
	</section>

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
				<h2>Who I am</h2>

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

		<section id="projects" class="grid grid-cols-2">
			<SailboatIcon class="w-10 h-10 !stroke-theme-700 stroke-2 col-span-2" />
			<h2 class="text-theme-100 col-span-2">What I've made</h2>

			<ul
				class="
					col-span-2
					xl:col-span-1
					my-8
					rounded-xl
					bg-theme-700 bg-opacity-30
					border-1 border-theme-100 border-opacity-50
					overflow-scroll
				"
			>
				<li
					v-for="project in projects"
					:key="project.project"
					class="text-theme-100 transition-colors"
					even=" bg-theme-600 bg-opacity-20"
					hover="bg-theme-800 bg-opacity-100"
					:class="{
						'!bg-opacity-100 !bg-theme-900': activeProject == project.project,
					}"
				>
					<button
						class="w-full text-left cursor-pointer"
						p="x-2 y-1"
						@click="activeProject = project.project"
					>
						<h3 class="text-2xl">
							{{ project.project }}
						</h3>
						<p>{{ project.location }}</p>

						<ul class="flex gap-2 my-2">
							<li
								v-for="tag in project.tags"
								:key="tag"
								class="px-1.5 text-theme-900 bg-theme-600 rounded"
							>
								{{ tag }}
							</li>
						</ul>
					</button>
				</li>
			</ul>
		</section>
	</main>
</template>

<script>
import Header from '@/components/Header.vue';
import Snowflake from '@/components/Snowflake.vue';
import WavesIcon from '@/components/Icons/WavesIcon.vue';
import SailboatIcon from '@/components/Icons/SailboatIcon.vue';

import ui from '@/mixins/ui.js';

import projects from '../public/projects.json';

export default {
	components: {
		Header,
		WavesIcon,
		SailboatIcon,
		Snowflake,
	},

	data() {
		return {
			anchorDropped: false,
			projects: projects,
			activeProject: null,
		};
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
	@apply text-4xl mb-4;
}

main > section {
	@apply mt-0 px-12 py-32;
}

#about {
	@apply relative pt-0 pb-24 bg-theme-600;
}

#projects {
	@apply relative bg-theme-900;
	background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23aefeff' fill-opacity='0.03' fill-rule='evenodd'/%3E%3C/svg%3E");
}

#projects-list {
	@apply w-full grid gap-x-8 gap-y-16 justify-center md:grid-cols-[repeat(auto-fit,minmax(300px,1fr))];

	/* grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); */
}
</style>
