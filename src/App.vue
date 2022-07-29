<template>
	<Header />

	<main>
		<section id="about">
			<WavesIcon class="w-24 h-24 mx-auto mb-8 text-theme-800" />
			<h2 class="text-theme-800">What I am</h2>

			<ul class="grid grid-cols-3 gap-16 space-around">
				<li>
					<h3 class="text-2xl text-center mb-4">Designer</h3>
					<p class="">
						The web is full of generic, messy, slow, and
						inaccessible sites, but it doesn't have to be. I create
						designs that are bold and unique but don't compromise on
						performance or a visitor's ability to experience them. I
						combine color, typography, structure, and media to
						provide experiences that delight and provide value to
						people.
					</p>
				</li>

				<li>
					<h3 class="text-2xl text-center mb-4">Developer</h3>
					<p>
						Great designs come to life when they are made
						interactive and engaging. I use whatever tools and
						languages necessary to add function to form.
					</p>
					<p>
						I also know the value of a well-crafted automation. My
						scripts have saved my colleagues and myself hundreds of
						hours of tedious labor by utilizing the capabilities of
						Goo&shy;gle Apps Script, VBA, Apple&shy;Script/JXA,
						Bash, and more.
					</p>
				</li>

				<li>
					<h3 class="text-2xl text-center mb-4">Creator</h3>
					<p>
						My greatest strength is my varied professional
						background. I'm not just a designer and developer. I'm
						also a musician, a photographer, a video editor, a print
						designer, a writer, and much more.
					</p>
				</li>
			</ul>
		</section>

		<section id="projects" class="bg-theme-800">
			<SailboatIcon
				class="w-24 h-24 mx-auto mb-8 stroke-theme-100 stroke-2"
			/>
			<h2 class="text-theme-100">What I've made</h2>
		</section>
	</main>
</template>

<script>
import Header from '@/components/Header.vue';
import WavesIcon from '@/components/Icons/WavesIcon.vue';
import SailboatIcon from '@/components/Icons/SailboatIcon.vue';

export default {
	components: {
		Header,
		WavesIcon,
		SailboatIcon,
	},
};
</script>

<style scoped lang="postcss">
h2 {
	@apply text-4xl text-center mb-16;
}

main section {
	@apply my-16 px-12 py-8;
}

#about {
	@apply -mt-16;
}
</style>
