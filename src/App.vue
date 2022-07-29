<template>
	<Header />

	<main>
		<section id="about">
			<WavesIcon class="w-24 h-24 mx-auto mb-8 text-theme-800" />
			<h2 class="text-theme-800">What I am</h2>

			<ul class="grid grid-cols-3 gap-16 space-around">
				<li>
					<h3 class="text-2xl text-center mb-4 text-theme-800">
						Designer
					</h3>
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
					<h3 class="text-2xl text-center mb-4 text-theme-800">
						Developer
					</h3>
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
					<h3 class="text-2xl text-center mb-4 text-theme-800">
						Creator
					</h3>
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
				class="w-24 h-24 mx-auto mb-8 !stroke-theme-100 stroke-2"
			/>
			<h2 class="text-theme-100">What I've made</h2>

			<ul id="projects-list">
				<Card>
					<template #project>Exodus</template>
					<template #location>GreatNews.Life</template>
					<template #tags>
						<li>Vue 3</li>
						<li>Vite SSG</li>
						<li>Tailwind/Windi CSS</li>
					</template>
					<template #description>
						<p>
							Simple, fast access to the latest positive-only news
							in northwestern Indiana
						</p>
					</template>
				</Card>

				<Card>
					<template #project>GreatNews.Life Corporate Site</template>
					<template #location>GreatNews.Life</template>
					<template #tags>
						<li>Nuxt</li>
						<li>Blava</li>
						<li>Tailwind/Windi CSS</li>
						<li>Serverless</li>
					</template>
					<template #description>
						<p>
							Rebranded corporate site with a fresh design using
							modern tools
						</p>
					</template>
				</Card>

				<Card>
					<template #project>Blava</template>
					<template #location>GreatNews.Life</template>
					<template #tags>
						<li>JS</li>
						<li>HTML Canvas</li>
						<li>Spline</li>
					</template>
					<template #description>
						<p>Performant artful blob generator using canvas 📋</p>
					</template>
				</Card>

				<Card>
					<template #project> BLC Website </template>
					<template #location> Bethlehem Lutheran Church </template>
					<template #tags>
						<li>PHP</li>
						<li>JS</li>
					</template>
					<template #description>
						<p>
							Connecting the community of BLC together with news,
							resources, and by-the-minute information
						</p>
					</template>
				</Card>

				<Card>
					<template #project> Dice Roller </template>
					<template #location> Personal Project </template>
					<template #tags>
						<li>JS</li>
						<li>Web app</li>
					</template>
					<template #description>
						<p>
							A unique group-based take on dice rolling for RPGs
						</p>
					</template>
					<template #link>
						<a
							href="https://dgrayvold.com/apps/diceroller"
							target="_blank"
						>
							Roll for init
						</a>
					</template>
				</Card>

				<Card>
					<template #project> Wordy </template>
					<template #location> Personal Project </template>
					<template #tags>
						<li>Vue 3</li>
						<li>Vite SSG</li>
						<li>Tailwind/Windi CSS</li>
					</template>
					<template #description>
						<p>A Wordle clone with a fresh coat of paint</p>
					</template>
					<template #link>
						<a href="https://wordy.grayvold.me" target="_blank">
							Play
						</a>
					</template>
				</Card>
			</ul>
		</section>
	</main>
</template>

<script>
import Header from '@/components/Header.vue';
import Card from '@/components/Card.vue';
import WavesIcon from '@/components/Icons/WavesIcon.vue';
import SailboatIcon from '@/components/Icons/SailboatIcon.vue';

export default {
	components: {
		Card,
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

#projects-list {
	@apply w-full grid gap-8 justify-center md:grid-cols-[repeat(auto-fit,minmax(300px,1fr))];

	/* grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); */
}
</style>
