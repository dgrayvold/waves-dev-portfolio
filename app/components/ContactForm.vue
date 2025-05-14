<template>
	<div>
		<form
			v-if="!submissionComplete && !formSubmissionInProgress"
			ref="form"
			:class="elementClasses"
			@input="updateFormCompletionStatus"
			@focusin.once="formInteracted = true"
			@submit.prevent="submitContactForm"
		>
			<label>
				<span>Name</span>
				<input
					v-model="formData.name"
					name="name"
					maxlength="128"
					placeholder="Dempster 'Shark Bait' Keic"
					required
				/>
			</label>

			<label>
				<span>Email</span>
				<input
					v-model="formData.email"
					type="email"
					name="email"
					maxlength="128"
					placeholder="ahoy@matey.org"
					required
				/>
			</label>

			<label>
				<span>Message</span>
				<textarea
					v-model="formData.message"
					name="message"
					maxlength="1000"
					placeholder="Current careening waveson kelp forecastle plankowner primage first assistant engineer companionway berth harbourmaster."
					required
				/>
			</label>

			<client-only>
				<input type="submit" value="Send" :disabled="!formComplete" class="leading-trim" />
			</client-only>

			<output v-if="submissionError || formErrors.length" class="text-theme-600">
				<p v-if="submissionError">{{ submissionError }}</p>

				<div v-if="formErrors.length" class="flex gap-4">
					<i class="i-icon-park-outline:thunderstorm-one inline-block h-6 w-6" />
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
			<i
				class="i-iconoir-sea-waves waves-icon mx-auto my-8 block h-8 w-8 animate-float text-theme-600"
			/>
		</div>

		<div v-else id="submission-confirmation">
			<p class="text-center text-3xl font-display">Submission complete</p>
			<p class="mx-auto mt-4 text-xl">
				Thanks for your interest! I'll get back to you as soon as I can.
			</p>
		</div>

		<NuxtTurnstile v-if="formInteracted" ref="turnstile" v-model="turnstileToken" />
	</div>
</template>

<script setup lang="ts">
defineProps({
	// Any class names to append to the form element
	elementClasses: {
		type: String,
		default: '',
	},
});

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
		formErrors.value = validationResult.error.issues.map(issue => issue.message);
		formSubmissionInProgress.value = false;
		return;
	}

	$fetch('/api/contact', {
		method: 'POST',
		body: {
			requestData,
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
const updateFormCompletionStatus = useDebounce(
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
form,
#submission-confirmation,
#submission-loading {
	@apply block max-w-128 mx-auto mt-12 mb-4 p-4 rounded-[0.5rem];
	@apply border-2 border-theme-700 text-left text-theme-100;
}

input,
textarea {
	@apply block w-full mb-4 resize-y bg-transparent text-theme-100 outline-none;
	@apply border-transparent border-b-2 border-b-theme-700 rounded-none transition-colors;
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
	@apply bg-theme-600 text-theme-900 rounded px-2 py-0.5 border-none cursor-pointer max-w-28;
	@apply focus:(bg-theme-850 text-theme-100) hover:(bg-theme-850 text-theme-100);
	@apply disabled:(bg-theme-800 text-theme-900 cursor-auto);
}

label {
	@apply block text-theme-700 transition-colors;
}

label:focus-within {
	@apply text-theme-100;
}

label span {
	@apply block;
}

textarea {
	@apply min-h-32 !border-theme-700  !border-2 rounded px-1 pt-1 leading-5 resize-y;
}
</style>
