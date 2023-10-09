<template>
	<form
		v-if="!submissionComplete && !formSubmissionInProgress"
		ref="form"
		@input="updateFormCompletionStatus"
		:class="elementClasses"
	>
		<label>
			<span>Name</span>
			<input
				name="name"
				maxlength="128"
				placeholder="Dempster 'Shark Bait' Keic"
				required
				v-model="formData.name"
			/>
		</label>

		<label>
			<span>Email</span>
			<input
				type="email"
				name="email"
				maxlength="128"
				placeholder="ahoy@matey.org"
				required
				v-model="formData.email"
			/>
		</label>

		<label>
			<span>Message</span>
			<textarea
				name="message"
				maxlength="1000"
				placeholder="Current careening waveson kelp forecastle plankowner primage first assistant engineer companionway berth harbourmaster."
				required
				v-model="formData.message"
			/>
		</label>

		<input type="submit" value="Send" @click="submitContactForm" :disabled="!formComplete" />

		<output v-if="submissionError" class="text-theme-600"> {{ submissionError }} </output>
	</form>

	<div v-else-if="formSubmissionInProgress" id="submission-loading">
		<WavesIcon class="waves-icon waves-icon-animated block mx-auto my-8 w-8 h-8" />
	</div>

	<div v-else id="submission-confirmation">
		<p class="text-3xl text-center font-display">Submission complete</p>
		<p class="text-xl mx-auto mt-4">
			Thanks for your interest! I'll get back to you as soon as I can.
		</p>
	</div>

	<div ref="turnstile" data-callback="onTurnstileCallback" />
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { debounce } from 'lodash-es';
import WavesIcon from '~icons/iconoir/sea-waves';

defineProps({
	// Any class names to append to the form element
	elementClasses: {
		type: String,
		default: '',
	},
});

/**
 * The form element
 */
const form = ref();

/**
 * The Turnstile element
 */
const turnstile = ref();

/**
 * Whether the form's content is fit for submission
 */
const formComplete = ref(false);

/**
 * Whether the form as completed is being submitted for sending
 */
const formSubmissionInProgress = ref(false);

/**
 * Whether the form was submitted and confirmation of submission was received
 */
const submissionComplete = ref(false);

/**
 * Any error to display about the form's submission
 */
const submissionError = ref(undefined);

/**
 * The data of the form
 */
const formData = reactive({
	name: '',
	email: '',
	message: '',
});

/**
 * The ID of the rendered Turnstile widget
 */
const turnstileId = ref(undefined);

/**
 * A setInterval ID for the Turnstile refreshing function
 */
const turnstileInterval = ref(undefined);

/**
 * Get Turnstile token set up for possible contact form submission
 */
function initializeTurnstile() {
	const id = window.turnstile.render(turnstile.value, {
		sitekey: import.meta.env.VITE_TURNSTILE_KEY,
	});

	if (id !== undefined) {
		turnstileId.value = id;
	}

	turnstileInterval.value = setInterval(refreshTurnstile, 1000 * 60 * 4.5);
}

/**
 * Refresh Turnstile token when it's nearing expiration
 */
function refreshTurnstile() {
	if (turnstileId.value == undefined) {
		clearInterval(turnstileInterval.value);
		initializeTurnstile();
		return;
	}

	turnstileId.value = window.turnstile.reset(turnstileId.value);
}

/**
 * Gather contact form data and submit
 *
 * @param {Event} event The triggering event
 */
async function submitContactForm(event) {
	event.preventDefault();
	formSubmissionInProgress.value = true;

	const requestData = new FormData(form.value);

	requestData.append('token', window.turnstile.getResponse(turnstileId.value));

	const response = await fetch('/send-contact-email', {
		method: 'POST',
		body: requestData,
	});

	formSubmissionInProgress.value = false;

	if (!response.ok || Math.floor(response.status / 100) !== 2) {
		const message =
			((await response.json())?.message ?? 'Sorry, something went wrong') +
			`. Please try again in a few minutes`;

		submissionError.value = message;
		refreshTurnstile();
		return;
	}

	submissionComplete.value = true;
}

/**
 * Set disabled attribute on submit button depending on form completion status
 */
const updateFormCompletionStatus = debounce(
	function () {
		// Null out the submission error as user is attempting to fix
		submissionError.value = null;

		if (Object.values(formData).find(value => value == '') == undefined) {
			formComplete.value = true;
		} else {
			formComplete.value = false;
		}
	},
	200,
	{ leading: true, trailing: true },
);

onMounted(() => {
	window.onTurnstileLoad = initializeTurnstile;
});
</script>

<style lang="postcss">
.waves-icon-animated {
	@apply text-theme-600 animate-float;
}
</style>

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
