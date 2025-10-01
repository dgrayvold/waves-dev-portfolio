<template>
	<div
		class="text-theme-100 mx-auto mb-4 mt-8 p-4 text-left rounded-[0.5rem] max-w-128 block lg:(mt-12)"
	>
		<form
			v-if="!submissionComplete && !formSubmissionInProgress"
			ref="form"
			class="font-display"
			:class="$attrs.class"
			@input="updateFormCompletionStatus"
			@focusin.once="formInteracted = true"
			@submit.prevent="submitContactForm"
		>
			<label class="text-theme-700 block transition-colors focus-within:(text-theme-100)">
				<span class="block">Name</span>
				<input
					v-model="formData.name"
					class="text-theme-100 mb-4 outline-none border-b-2 border-transparent border-b-theme-700 rounded-none bg-transparent w-full block resize-y transition-colors placeholder:(text-theme-100/40) focus:(outline-none border-transparent border-b-theme-100)"
					name="name"
					maxlength="128"
					placeholder="Dempster 'Shark Bait' Keic"
					required
				/>
			</label>

			<label class="text-theme-700 block transition-colors focus-within:(text-theme-100)">
				<span class="block">Email</span>
				<input
					v-model="formData.email"
					class="text-theme-100 mb-4 outline-none border-b-2 border-transparent border-b-theme-700 rounded-none bg-transparent w-full block resize-y transition-colors placeholder:(text-theme-100/40) focus:(outline-none border-transparent border-b-theme-100)"
					type="email"
					name="email"
					maxlength="128"
					placeholder="ahoy@matey.org"
					required
				/>
			</label>

			<label class="text-theme-700 block transition-colors focus-within:(text-theme-100)">
				<span class="block">Message</span>
				<textarea
					v-model="formData.message"
					class="text-theme-100 leading-5 mb-4 px-1 pt-1 outline-none border-b-2 border-transparent border-b-theme-700 rounded rounded-none bg-theme-950 bg-transparent min-h-32 w-full block resize-y resize-y transition-colors placeholder:(text-theme-100/40) focus:(outline-none border-transparent border-b-theme-100) !border-2 !border-theme-700"
					name="message"
					maxlength="1000"
					placeholder="Current careening waveson kelp forecastle plankowner primage first assistant engineer companionway berth harbourmaster."
					required
				/>
			</label>

			<client-only>
				<input
					class="text-theme-900 px-2 py-0.5 rounded border-none bg-theme-600 w-full cursor-pointer disabled:(text-theme-900 bg-theme-800 cursor-auto) focus:(text-theme-100 bg-theme-850) hover:(text-theme-100 bg-theme-850)"
					type="submit"
					value="Send"
					:disabled="!formComplete"
				/>
			</client-only>

			<output v-if="submissionError || formErrors.length" class="text-theme-600">
				<p v-if="submissionError">{{ submissionError }}</p>

				<div v-if="formErrors.length" class="flex gap-4">
					<Icon name="icon-park-outline:thunderstorm-one" size="24" />
					<div>
						<p>Please check your submission for errors:</p>

						<ul>
							<li v-for="error in formErrors" :key="error" class="list-circle-inside">
								{{ error }}
							</li>
						</ul>
					</div>
				</div>
			</output>
		</form>

		<div v-else-if="formSubmissionInProgress" id="submission-loading">
			<Icon
				name="iconoir:sea-waves"
				size="64"
				class="waves-icon text-theme-600 mx-auto my-8 block animate-float"
			/>
		</div>

		<div v-else id="submission-confirmation">
			<p class="text-3xl font-display text-center">Submission complete</p>
			<p class="text-xl mx-auto mt-4">
				Thanks for your interest! I'll get back to you as soon as I can.
			</p>
		</div>

		<NuxtTurnstile v-if="formInteracted" ref="turnstile" v-model="turnstileToken" />
	</div>
</template>

<script setup lang="ts">
import { debounce } from 'lodash-es';

const form = useTemplateRef('form');

const turnstile = useTemplateRef('turnstile');

/**
 * Whether the visitor has interacted with the form, which activates Turnstile
 */
const formInteracted = ref(false);

/**
 * Whether the form's content is fit for submission
 */
const formComplete = ref(false);

/**
 * Whether the form is being submitted for sending
 */
const formSubmissionInProgress = ref(false);

/**
 * Whether the form was submitted and confirmation of submission was received
 */
const submissionComplete = ref(false);

/**
 * Any error to display about the form's submission
 */
const submissionError = ref<string>();

const formErrors = ref<string[]>([]);

/**
 * The data of the form
 */
const formData = reactive({
	name: '',
	email: '',
	message: '',
});

const turnstileToken = ref('');

/**
 * Gather contact form data and submit
 *
 * @param {Event} event The triggering event
 */
function submitContactForm() {
	if (!form.value) {
		return;
	}

	formErrors.value = [];
	submissionError.value = '';

	formSubmissionInProgress.value = true;

	const requestData = Object.fromEntries(new FormData(form.value).entries());

	const validationResult = validateFormData(requestData);

	if (!validationResult.success) {
		formErrors.value = validationResult.issues.map(issue => issue.message);
		formSubmissionInProgress.value = false;
		return;
	}

	$fetch('/api/contact', {
		method: 'POST',
		body: {
			requestData: validationResult.output,
			token: turnstileToken.value,
		},
	})
		.then(
			() => {
				submissionComplete.value = true;
			},
			error => {
				submissionError.value = `Sorry, something went wrong. ${
					error?.data?.statusMessage ? `(${error.data.statusMessage}.)` : ' '
				} Please try again in a few minutes`;

				turnstile.value?.reset();
			},
		)
		.finally(() => (formSubmissionInProgress.value = false));
}

/**
 * Set disabled attribute on submit button depending on form completion status
 */
const updateFormCompletionStatus = debounce(
	() => {
		// Null out the submission error as user is attempting to fix
		submissionError.value = undefined;

		formComplete.value = Object.values(formData).find(value => value === '') === undefined;
	},
	200,
	{ leading: true, trailing: true },
);
</script>

<style scoped lang="postcss">
input:focus::-webkit-input-placeholder,
input:focus::-moz-placeholder,
textarea:focus::-webkit-input-placeholder,
textarea:focus::-moz-placeholder {
	@apply text-transparent;
}
</style>
