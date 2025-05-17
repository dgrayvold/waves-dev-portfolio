<template>
	<div>
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
			class="col-span-8 col-start-2 row-start-1 row-end-6"
			@splide:active="selectProjectFromSplide"
		>
			<SplideSlide
				v-for="(project, index) in projects"
				:key="project.project"
				:data-project="project.project"
				class="mx-auto mb-2 cursor-pointer overflow-hidden border-b-2 border-t-2 border-theme-700 md:(mb-0 max-w-164 border-2 rounded-lg)"
				:data-project-index="index"
				@click="selectProject(index)"
			>
				<NuxtImg
					v-if="project.image"
					:title="project.project"
					:src="project.image"
					width="656"
					format="jpg"
					:modifiers="{
						fl: 'progressive',
						q: 75,
					}"
				/>

				<div v-else class="h-full w-full flex flex-col items-center bg-theme-850">
					<i
						class="i-icon-park-outline-sailboat-one mx-auto my-8 inline-block h-full w-24 text-theme-800"
					/>
				</div>
			</SplideSlide>
		</Splide>

		<div
			class="relative z-10 mx-auto max-w-[90%] min-h-76 w-full border-2 border-theme-700 rounded-lg from-theme-900 to-theme-900 to-opacity-90 bg-gradient-to-r px-4 md:(max-w-[500px] -mt-8)"
		>
			<ul class="flex items-end justify-center gap-4">
				<li v-for="(project, index) in projects" :key="project.project">
					<button
						class="m-3 h-4 w-4 border-2 border-theme-800 rounded-xl outline-2 outline-transparent outline"
						:class="{
							'bg-theme-100 border-theme-100 focus-visible:outline-theme-800':
								activeProject?.project === projects[index]?.project,
							'bg-theme-800 border-theme-800 focus-visible:outline-theme-100':
								activeProject?.project !== projects[index]?.project,
						}"
						:aria-label="project.project"
						@click="selectProject(index)"
					/>
				</li>
			</ul>
			<p class="mt-2 text-2xl font-semibold leading-6 font-display">
				{{ activeProject?.project }}
			</p>
			<p
				class="mb-4 text-xl font-semibold leading-2 font-text"
				style="font-variant: all-small-caps"
			>
				{{ activeProject?.location }}
			</p>

			<ul class="my-0 mb-6 flex flex-wrap gap-2">
				<li
					v-for="tag in activeProject?.tags"
					:key="tag"
					class="rounded bg-theme-600 px-1.5 pt-0.5 text-xs text-theme-900 font-700 font-display uppercase"
				>
					{{ tag }}
				</li>
			</ul>

			<p class="text-lg leading-5 font-text">{{ activeProject?.description }}</p>

			<a
				v-show="activeProject?.url !== null"
				:href="activeProject?.url"
				target="_blank"
				rel="noopener noreferrer nofollow"
				class="mb-4 mt-4 inline-block self-start rounded bg-theme-700 px-2 pb-1 text-theme-900 outline-2 outline-transparent outline focus-visible:(bg-theme-900 text-theme-100 outline-theme-100) hover:(bg-theme-900 text-theme-100 outline-theme-100)"
			>
				<span class="pr-1 align-middle leading-4">
					{{ activeProject?.cta ?? 'Go' }}
				</span>

				<i
					class="i-icon-park-outline-sailboat-one ml-2 inline-block h-4 transform stroke-4 align-middle transition-all"
				/>
			</a>
		</div>
	</div>
</template>

<script setup lang="ts">
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
		projects?: Project[];
	}>(),
	{
		activeProject: undefined,
		projects: () => [] as Project[],
	},
);

const emit = defineEmits(['select']);

const splide = useTemplateRef('splide');

/**
 * Select a project by its index in the projects list
 *
 * @param index The index of the project to select
 */
function selectProject(index: number) {
	emit('select', index);

	// @ts-expect-error No accessible types for component
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
	filter: grayscale(100%) sepia(100%) brightness(0.3) hue-rotate(120deg) saturate(5);
}
</style>
