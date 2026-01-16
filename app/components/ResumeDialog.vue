<template>
	<dialog
		ref="resumeDialog"
		class="bg-transparent w-screen inset-0 justify-center fixed z-100 h-svh backdrop:bg-theme-950/10"
		:class="resumeDialogVisible ? 'grid items-center justify-center' : ''"
		@close="resumeDialogVisible = false"
	>
		<section
			class="border-2 border-theme-700 rounded-lg bg-theme-600 max-w-screen w-100 justify-start max-h-svh"
		>
			<menu class="p-2 flex justify-end">
				<button
					class="text-theme-800 outline-none rounded-lg cursor-pointer transition-colors focus-visible:(text-theme-950 outline-2 bg-theme-800/20) hover:text-theme-950"
					@click="resumeDialogVisible = false"
				>
					<Icon name="akar-icons:x-small" size="24" />
				</button>
			</menu>

			<h1 class="text-3xl text-theme-850 font-text pb-4 text-center">Résumé</h1>

			<nav class="text-lg font-text py-4 flex gap-8 justify-center">
				<NuxtLink
					:href="runtimeConfig.public.resumeUrl"
					target="_blank"
					class="text-theme-850 p-4 outline-none rounded-2xl flex flex-col w-32 transition-colors items-center focus-visible:(text-theme-950 bg-theme-800/20)"
				>
					<Icon name="mdi:compass-rose" size="48" class="" />
					<span>View</span>
				</NuxtLink>

				<NuxtLink
					:href="runtimeConfig.public.resumeDownloadUrl"
					target="_blank"
					class="text-theme-850 p-4 outline-none rounded-2xl flex flex-col w-32 transition-colors items-center focus-visible:(text-theme-950 bg-theme-800/20)"
				>
					<Icon name="akar-icons:download" size="48" class="" />
					<span>Download</span>
				</NuxtLink>
			</nav>
		</section>
	</dialog>
</template>

<script setup lang="ts">
const route = useRoute();

const runtimeConfig = useRuntimeConfig();

const resumeDialog = useTemplateRef('resumeDialog');

const resumeDialogVisible = ref(false);

const windowScrollLocked = useScrollLock(() => (import.meta.client ? window : null), false);

watch(resumeDialogVisible, isVisible => {
	if (!resumeDialog.value) {
		return;
	}

	windowScrollLocked.value = isVisible;

	if (isVisible) {
		resumeDialog.value.showModal();
	} else {
		resumeDialog.value.close();
	}
});

onMounted(() => {
	resumeDialogVisible.value =
		runtimeConfig.public.resumeUrl !== '' && route.fullPath.startsWith('/resume');
});
</script>
