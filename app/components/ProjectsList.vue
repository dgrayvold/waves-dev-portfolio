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
				class="mx-auto mb-2 border-b-2 border-t-2 border-theme-700 cursor-pointer overflow-hidden md:(mb-0 border-2 rounded-lg max-w-164)"
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

				<div v-else class="bg-theme-850 flex flex-col h-full w-full items-center">
					<Icon
						name="icon-park-outline:sailboat-one"
						class="text-theme-800 mx-auto mb-16 mt-8 h-full w-24"
					/>
				</div>
			</SplideSlide>
		</Splide>

		<div
			class="mx-auto px-4 border-2 border-theme-700 rounded-lg max-w-[90%] min-h-76 w-full relative z-10 from-theme-900 to-theme-900 to-opacity-90 bg-linear-to-r md:(max-w-[500px] -mt-8)"
		>
			<ul class="flex gap-4 items-end justify-center">
				<li v-for="(project, index) in projects" :key="project.project">
					<button
						class="m-3 outline-2 outline-transparent outline border-2 border-theme-800 rounded-xl h-4 w-4 cursor-pointer"
						:class="
							activeProject?.project === projects[index]?.project
								? 'bg-theme-100 border-theme-100 focus-visible:outline-theme-800'
								: 'bg-theme-800 border-theme-800 focus-visible:outline-theme-100'
						"
						:aria-label="project.project"
						@click="selectProject(index)"
					/>
				</li>
			</ul>
			<p class="text-2xl leading-6 font-display font-semibold mt-2">
				{{ activeProject?.project }}
			</p>
			<p
				class="text-xl leading-2 font-semibold font-text mb-4"
				style="font-variant: all-small-caps"
			>
				{{ activeProject?.location }}
			</p>

			<ul class="my-0 mb-6 flex flex-wrap gap-2">
				<li
					v-for="tag in activeProject?.tags"
					:key="tag"
					class="text-xs text-theme-900 font-700 font-display px-1.5 pt-0.5 rounded bg-theme-600 uppercase"
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
				class="text-theme-900 mb-4 mt-4 px-2 pb-1 outline-2 outline-transparent outline rounded bg-theme-700 inline-block self-start focus-visible:(text-theme-100 outline-theme-100 bg-theme-900) hover:(text-theme-100 outline-theme-100 bg-theme-900)"
			>
				<span class="leading-4 pr-1 align-middle">
					{{ activeProject?.cta ?? 'Go' }}
				</span>

				<Icon
					name="icon-park-outline:sailboat-one"
					size="16"
					class="ml-2 align-middle inline-block transform transition-all stroke-4"
				/>
			</a>
		</div>
	</div>
</template>

<script setup lang="ts">
import { Splide, SplideSlide } from '@splidejs/vue-splide';
import type { Project } from '~/utils/schema';

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
