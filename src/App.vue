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
			<div
				class="w-100 h-100 mx-8 rounded-xl inline-block bg-black"
			></div>

			<div class="max-w-128">
				<WavesIcon class="w-8 h-8 mb-0 -ml-0.5 text-theme-800" />
				<p class="text-2xl">Lorem ipsum dolor sit amet.</p>
				<p class="text-2xl">
					Interdum mattis fringilla eleifend semper imperdiet fames
					mattis purus.
				</p>
				<p class="text-2xl">
					Dictum id tempor odio interdum est aliquam luctus a at.
					Interdum tempus sapien quam platea molestie nibh non etiam
					turpis justo.
				</p>
			</div>
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
import Snowflake from '@/components/Snowflake.vue';
import WavesIcon from '@/components/Icons/WavesIcon.vue';
import SailboatIcon from '@/components/Icons/SailboatIcon.vue';

import ui from '@/mixins/ui.js';

export default {
	components: {
		Card,
		Header,
		WavesIcon,
		SailboatIcon,
		Snowflake,
	},

	data() {
		return {
			anchorDropped: false,
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
	@apply text-4xl text-center mb-16;
}

main section {
	@apply mt-0 py-16 px-12 py-8;
}

#about {
	@apply pt-0 bg-theme-600;
}

#projects-list {
	@apply w-full grid gap-x-8 gap-y-16 justify-center md:grid-cols-[repeat(auto-fit,minmax(300px,1fr))];

	/* grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); */
}
</style>
