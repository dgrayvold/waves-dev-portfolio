<template>
	<li
		class="
			relative
			min-h-80
			max-w-80
			p-4
			pb-8
			bg-theme-600
			rounded-xl
			overflow-hidden
		"
	>
		<h3 class="text-2xl leading-6">
			<slot name="project"> Project Name </slot>
		</h3>
		<p class="uppercase text-sm">
			<slot name="location"> Project location </slot>
		</p>

		<ul class="card-tags">
			<slot name="tags" />
		</ul>

		<div class="card-description">
			<slot name="description"> Project description </slot>
		</div>

		<div class="card-link">
			<slot name="link">
				<a href="/">Go</a>
			</slot>
		</div>
	</li>
</template>

<style lang="postcss">
.card-description p {
	@apply leading-5 my-2;
}

.card-link {
	@apply absolute flex items-center justify-center bottom-0 left-0 right-0 h-8;
	@apply text-center uppercase text-theme-900;
	@apply bg-theme-700 transition-colors;
	@apply hover:(text-theme-100 bg-theme-900);
}

.card-link a {
	@apply w-full;
}

.card-tags {
	@apply flex gap-x-2 gap-y-1 flex-wrap mb-4;
}

.card-tags li {
	@apply px-1 py-0.5 uppercase inline-block text-[0.75rem] bg-theme-800 text-theme-100 rounded;
}
</style>
