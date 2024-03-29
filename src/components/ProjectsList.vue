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
			class="border-t-2 border-b-2 md:border-2 border-theme-700 md:rounded-lg overflow-hidden md:max-w-164 mx-auto mb-2 md:mb-0 cursor-pointer"
			:data-project-index="index"
			@click="selectProject(index)"
		>
			<picture v-if="project.image" :title="project.project">
				<source type="image/webp" :srcset="project.image.webp" />
				<img :src="project.image.jpg" alt="Project image thumbnail" />
			</picture>

			<div v-else class="flex flex-col items-center bg-theme-850 w-full h-full">
				<i
					class="i-icon-park-outline-sailboat-one inline-block h-full w-24 mx-auto my-8 text-theme-800"
				/>
			</div>
		</SplideSlide>
	</Splide>

	<div
		class="relative md:-mt-8 mx-auto min-h-76 w-full max-w-[90%] md:max-w-[500px] px-4 bg-gradient-to-r from-theme-900 to-theme-900 to-opacity-90 border-2 border-theme-700 rounded-lg z-10"
	>
		<ul class="flex gap-4 justify-center items-end">
			<li v-for="(project, index) in projects" :key="project.project">
				<button
					class="w-4 h-4 m-3 rounded-xl border-2 border-theme-800 outline outline-2 outline-transparent"
					:class="{
						'bg-theme-100 border-theme-100 focus-visible:outline-theme-800':
							activeProject?.project == projects[index].project,
						'bg-theme-800 border-theme-800 focus-visible:outline-theme-100':
							activeProject?.project != projects[index].project,
					}"
					@click="selectProject(index)"
					:aria-label="project.project"
				/>
			</li>
		</ul>
		<p class="text-2xl leading-6 font-display font-semibold mt-2">
			{{ activeProject?.project }}
		</p>
		<p
			class="leading-2 text-xl font-text mb-4 font-semibold"
			style="font-variant: all-small-caps"
		>
			{{ activeProject?.location }}
		</p>

		<ul class="flex flex-wrap gap-2 my-0 mb-6">
			<li
				v-for="tag in activeProject?.tags"
				:key="tag"
				class="px-1.5 pt-0.5 text-theme-900 bg-theme-600 rounded uppercase text-xs font-display font-700"
			>
				{{ tag }}
			</li>
		</ul>

		<p class="font-text text-lg leading-5">{{ activeProject?.description }}</p>

		<a
			v-show="activeProject?.url != null"
			:href="activeProject?.url"
			target="_blank"
			rel="noopener noreferrer nofollow"
			class="inline-block px-2 pb-1 mt-4 mb-4 rounded bg-theme-700 text-theme-900 self-start hover:bg-theme-900 focus-visible:bg-theme-900 hover:text-theme-100 focus-visible:text-theme-100 outline outline-2 outline-transparent hover:outline-theme-100 focus-visible:outline-theme-100"
		>
			<span class="leading-4 align-middle pr-1">
				{{ activeProject?.cta ?? 'Go' }}
			</span>
			<SailboatIcon class="inline-block align-middle h-4 stroke-4 transition-all transform" />
		</a>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Splide, SplideSlide } from '@splidejs/vue-splide';
import '@splidejs/vue-splide/css';

import type { Project } from '@/types/types';

withDefaults(
	defineProps<{
		/**
		 * The project currently displayed
		 */
		activeProject?: Project;

		/**
		 * All of the projects available to view
		 */
		projects: Project[];
	}>(),
	{
		activeProject: undefined,
		projects: () => [] as Project[],
	},
);

/**
 * The Splide slideshow container
 */
const splide = ref();

const emit = defineEmits(['select']);

/**
 * Select a project by its index in the projects list
 *
 * @param index The index of the project to select
 */
function selectProject(index: number) {
	emit('select', index);

	splide.value.go(index);
}

/**
 * Select the project from the overall Splide instance
 *
 * @param splide The Splide instance
 * @param slide The newly active Splide slide
 */
function selectProjectFromSplide(_: typeof Splide, slide: typeof SplideSlide) {
	selectProject(slide.slide.dataset.projectIndex);
}
</script>

<style scoped lang="postcss">
.splide__slide {
	transform: translateZ(0);
	position: relative;
	-webkit-backface-visibility: hidden;
	backface-visibility: hidden;
}

.splide__slide img {
	@apply filter transition-all duration-400 w-full object-cover transform translate-z-0;

	filter: grayscale(0%) sepia(0%) brightness(1) hue-rotate(0deg) saturate(1);
}

.splide__slide:not(.is-active) img {
	filter: grayscale(100%) sepia(100%) brightness(0.2) hue-rotate(120deg) saturate(5);
}
</style>
