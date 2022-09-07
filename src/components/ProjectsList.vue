<template>
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
				@click="selectProject(project)"
			>
				<h3 class="text-2xl !font-normal">
					{{ project.project }}
				</h3>
				<p class="text-sm leading-2">{{ project.location }}</p>

				<ul class="flex gap-2 my-2">
					<li
						v-for="tag in project.tags"
						:key="tag"
						class="
							px-1.5
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
		<div v-if="activeProject.loadedImage || activeProject.image">
			<img
				:src="activeProject.loadedImage?.src ?? activeProject.image"
				class="
					border-b-1 border-theme-100 border-opacity-50
					w-full
					h-72
					object-cover object-top
				"
			/>

			<p class="text-2xl px-2 font-display">{{ activeProject.project }}</p>
			<p class="px-2">{{ activeProject.description }}</p>

			<a
				v-show="activeProject.url != null"
				:href="activeProject.url"
				target="_blank"
				class="inline-block bg-theme-700 mx-2 px-2 pb-1 my-2 rounded text-theme-900 group"
			>
				<span class="leading-4 align-middle pr-1">{{ activeProject.cta ?? 'Go' }}</span>
				<SailboatIcon
					class="
						inline-block
						align-middle
						h-4
						stroke-4
						transition-all
						transform
						group-hover:translate-x-2
					"
				/>
			</a>
		</div>
		<div v-else class="flex flex-col items-center bg-theme-900 bg-opacity-50 w-full h-full">
			<SailboatIcon class="h-32 w-32 mx-auto my-8 stroke-theme-800" />

			<p class="text-3xl text-center">{{ activeProject.project }}</p>
			<p class="py-8 px-8 max-w-128">{{ activeProject.description }}</p>

			<a
				v-show="activeProject.url != null"
				:href="activeProject.url"
				target="_blank"
				class="inline-block bg-theme-700 mx-2 px-2 pb-1 my-2 rounded text-theme-900 group"
			>
				<span class="leading-4 align-middle pr-1">{{ activeProject.cta ?? 'Go' }}</span>
				<SailboatIcon
					class="
						inline-block
						align-middle
						h-4
						stroke-4
						transition-all
						transform
						group-hover:translate-x-2
					"
				/>
			</a>
		</div>
	</figure>
</template>

<script>
import SailboatIcon from '@/components/Icons/SailboatIcon.vue';

export default {
	components: {
		SailboatIcon,
	},

	props: {
		activeProject: {
			type: Object,
			default: () => ({}),
		},
		projects: {
			type: Array,
			default: () => [],
		},
	},

	emits: ['select'],

	methods: {
		selectProject(project) {
			// activeProject = projects.find(p => p.project == project.project);
			this.$emit('select', project.project);
		},
	},
};
</script>
