<template>
	<form
		data-static-form-name="contact"
		class="
			block
			max-w-128
			mx-auto
			mt-12
			mb-4
			p-4
			rounded-[0.5rem]
			border-2 border-theme-700
			text-left text-theme-100
		"
	>
		<label class="block">
			<span class="block">Name</span>
			<input
				name="name"
				maxlength="64"
				placeholder="Dempster 'Shark Bait' Keic"
				class="block w-full"
			/>
		</label>

		<label class="block">
			<span class="block">Email</span>
			<input
				type="email"
				name="email"
				maxlength="96"
				placeholder="ahoy@matey.org"
				class="block w-full"
			/>
		</label>

		<label class="block">
			<span class="block">Email</span>
			<textarea
				name="message"
				maxlength="1000"
				placeholder="Current careening waveson kelp forecastle plankowner primage first assistant engineer companionway berth harbourmaster."
				class="block w-full"
			/>
		</label>

		<input type="submit" value="Send" />
	</form>
</template>

<style scoped lang="postcss">
input,
textarea {
	@apply mb-4 resize-y text-theme-100;
	@apply bg-transparent border-transparent border-b-2 border-b-theme-700 transition-colors;
}

input::placeholder,
textarea::placeholder {
	@apply text-theme-100 text-opacity-40;
}

input:focus,
textarea:focus {
	@apply outline-none border-transparent border-b-theme-100;
}

input:focus::-webkit-input-placeholder,
input:focus::-moz-placeholder,
textarea:focus::-webkit-input-placeholder,
textarea:focus::-moz-placeholder {
	@apply text-transparent;
}

input[type='submit'] {
	@apply bg-theme-600 text-theme-900 rounded px-2 py-0.5 border-none cursor-pointer;
	@apply focus:(bg-theme-850 text-theme-100) hover:(bg-theme-850 text-theme-100);
}

label {
	@apply text-theme-700 transition-colors;
}

label:focus-within {
	@apply text-theme-100;
}

textarea {
	@apply min-h-32 !border-theme-700  !border-2 rounded px-1 pt-1 leading-5;
}
</style>
