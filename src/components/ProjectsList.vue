<template>
	<Splide
		ref="splide"
		:options="{
			arrows: false,
			perPage: 1,
			focus: 'center',
			trimSpace: false,
			keyboard: true,
			pagination: false,
			gap: '0.5rem',
		}"
		class="col-start-2 col-span-8 row-start-1 row-end-6"
		@splide:active="selectProjectFromSplide"
	>
		<SplideSlide
			v-for="(project, index) in projects"
			:key="project.project"
			:data-project="project.project"
			class="
				lg:border-2
				border-theme-700
				lg:rounded-lg
				overflow-hidden
				lg:max-w-164
				mx-auto
				cursor-pointer
			"
			:data-project-index="index"
			@click="selectProject(index)"
		>
			<img v-if="project.loadedImage || project.image" :src="project.image" />
			<div v-else class="flex flex-col items-center bg-theme-850 w-full h-full">
				<SailboatIcon class="h-full w-32 mx-auto my-8 stroke-theme-800" />
			</div>
		</SplideSlide>
	</Splide>

	<div
		class="
			relative
			md:-mt-8
			mx-auto
			min-h-76
			w-full
			max-w-[500px]
			px-4
			bg-gradient-to-r
			from-theme-900
			to-theme-900 to-opacity-90
			border-2 border-theme-700
			rounded-lg
			z-10
		"
	>
		<ul class="flex gap-4 justify-center items-end">
			<li v-for="(project, index) in projects" :key="project.project">
				<button
					class="mt-1 px-2 py-2 h-10 w-10 rounded outline outline-2 outline-transparent"
					focus-visible=" outline-theme-700"
					@click="selectProject(index)"
				>
					<svg
						class="transform rotate-180 fill-theme-800"
						:class="{
							'!fill-theme-100': projects[index].project == activeProject.project,
						}"
						version="1.1"
						id="Capa_1"
						xmlns="http://www.w3.org/2000/svg"
						xmlns:xlink="http://www.w3.org/1999/xlink"
						viewBox="0 0 205.859 205.859"
						style="enable-background: new 0 0 205.859 205.859"
						xml:space="preserve"
					>
						<path
							d="M202.93,161.481c-3.906-3.904-10.236-3.904-14.143,0l-6.582,6.582l-65.134-65.134l13.517-13.517
	c3.838,1.797,8.055,2.747,12.419,2.747c7.828,0,15.188-3.049,20.724-8.584l39.198-39.197c1.875-1.876,2.929-4.419,2.929-7.071
	s-1.054-5.195-2.929-7.071L175.624,2.929C173.748,1.054,171.205,0,168.552,0s-5.195,1.054-7.071,2.929l-39.196,39.198
	c-5.536,5.535-8.585,12.896-8.585,20.724c0,4.364,0.95,8.582,2.747,12.419l-13.517,13.517L89.412,75.27
	c1.797-3.838,2.747-8.055,2.747-12.419c0-7.828-3.049-15.188-8.584-20.724L44.378,2.929C42.502,1.054,39.959,0,37.306,0
	s-5.196,1.054-7.071,2.929L2.929,30.235c-3.905,3.905-3.905,10.237,0,14.143l39.197,39.196c5.536,5.536,12.896,8.585,20.725,8.585
	c4.364,0,8.581-0.95,12.419-2.747l13.517,13.517l-65.134,65.134l-6.582-6.582c-3.905-3.903-10.237-3.904-14.142,0
	c-3.905,3.905-3.906,10.237,0,14.143l13.651,13.651c0.001,0.001,0.002,0.002,0.002,0.002s0.002,0.001,0.003,0.002l13.651,13.651
	c1.953,1.952,4.512,2.929,7.071,2.929c2.559,0,5.119-0.977,7.071-2.929c3.905-3.905,3.906-10.237,0-14.143l-6.582-6.582
	l65.134-65.134l65.134,65.134l-6.582,6.582c-3.905,3.905-3.905,10.237,0,14.143c1.953,1.952,4.512,2.929,7.071,2.929
	s5.118-0.977,7.071-2.929l27.307-27.307C206.836,171.719,206.836,165.387,202.93,161.481z"
						/>
					</svg>
				</button>
			</li>
		</ul>
		<p class="text-2xl leading-6 font-display font-semibold mt-2">
			{{ activeProject.project }}
		</p>
		<p
			class="ileading-6 text-xl font-text mb-2 font-semibold"
			style="font-variant: all-small-caps"
		>
			{{ activeProject.location }}
		</p>

		<ul class="flex gap-2 my-0 mb-6">
			<li
				v-for="tag in activeProject.tags"
				:key="tag"
				class="
					px-1.5
					pt-0.5
					text-theme-900
					bg-theme-600
					rounded
					uppercase
					text-xs
					font-display
				"
			>
				{{ tag }}
			</li>
		</ul>

		<p class="font-text text-lg leading-5">{{ activeProject.description }}</p>

		<a
			v-show="activeProject.url != null"
			:href="activeProject.url"
			target="_blank"
			class="
				inline-block
				px-2
				pb-1
				mt-4
				mb-4
				rounded
				bg-theme-700
				text-theme-900
				self-start
				hover:bg-theme-900
				focus-visible:bg-theme-900
				hover:text-theme-100
				focus-visible:text-theme-100
				outline outline-2 outline-transparent
				hover:outline-theme-100
				focus-visible:outline-theme-100
			"
		>
			<span class="leading-4 align-middle pr-1">
				{{ activeProject.cta ?? 'Go' }}
			</span>
			<SailboatIcon class="inline-block align-middle h-4 stroke-4 transition-all transform" />
		</a>
	</div>
</template>

<script>
import { Splide, SplideSlide } from '@splidejs/vue-splide';
import '@splidejs/vue-splide/css';

import SailboatIcon from '@/components/Icons/SailboatIcon.vue';

export default {
	components: {
		Splide,
		SplideSlide,
		SailboatIcon,
	},

	props: {
		/**
		 * The project currently displayed
		 */
		activeProject: {
			type: Object,
			default: () => ({}),
		},

		/**
		 * All of the projects available to view
		 */
		projects: {
			type: Array,
			default: () => [],
		},
	},

	emits: ['select'],

	methods: {
		/**
		 * Select a project by its index in the projects list
		 *
		 * @param {Number} index The index of the project to select
		 */
		selectProject(index) {
			this.$emit('select', index);

			this.$refs.splide.go(index);
		},

		/**
		 * Select the project from the overall Splide instance
		 * @param {Splide} splide The Splide instance
		 * @param {SplideSlide} slide The newly active Splide slide
		 */
		selectProjectFromSplide(splide, slide) {
			this.selectProject(slide.slide.dataset.projectIndex);
		},
	},
};
</script>

<style scoped lang="postcss">
.splide__slide {
	transform: translateZ(0);
	position: relative;
	-webkit-backface-visibility: hidden;
	backface-visibility: hidden;
}

.splide__slide img {
	@apply filter transition-all duration-400 w-full h-full object-cover;

	filter: grayscale(0%) sepia(0%) brightness(1) hue-rotate(0deg) saturate(1);
}

.splide__slide:not(.is-active) img {
	filter: grayscale(100%) sepia(100%) brightness(0.4) hue-rotate(120deg) saturate(3);
}
</style>
