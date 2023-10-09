import { computed, reactive, ref, toValue, watch } from 'vue';

/**
 * Whether playback should be possible (e.g. for reduced motion preference)
 */
const playbackDisabled = ref(false);

/**
 * The list of functions that can be run corresponding to key IDs
 */
const animationFunctions = reactive(new Map());

/**
 * The name of the section currently active
 */
const currentSection = ref();

/**
 * The animation function of the current active section
 */
const currentAnimationFunction = computed(() => {
	return animationFunctions.get(currentSection.value) ?? (() => {});
});

/**
 * The current requestAnimationFrame ID for canceling if restarting animation while it is
 * currently playing
 */
const animationFrameRequestId = ref(null);

/**
 * Run an animation loop
 */
function runAnimation() {
	if (animationFrameRequestId.value !== null) {
		cancelAnimationFrame(animationFrameRequestId.value);
	}

	if (!playbackDisabled.value) {
		currentAnimationFunction.value(true);

		animationFrameRequestId.value = requestAnimationFrame(runAnimation);
	}
}

/**
 * React to changes in playback enabling/disabling
 *
 * @param {Boolean} isDisabled The new value of the property
 */
watch(playbackDisabled, isDisabled => {
	if (animationFrameRequestId.value !== null) {
		cancelAnimationFrame(animationFrameRequestId.value);
	}

	currentAnimationFunction.value(false);

	if (!isDisabled) {
		animationFrameRequestId.value = requestAnimationFrame(runAnimation);
	}
});

/**
 * Send a stop signal to the old animation when a new animation begins in case it needs one
 */
watch(currentSection, (_, oldValue) => {
	animationFunctions.get(oldValue)?.(false);
});

if (!playbackDisabled.value) {
	runAnimation();
}

/**
 * Props and watchers for determining current state of component's animation
 */
export function useAnimation() {
	/**
	 * Add a function to the animation list for a particular section
	 *
	 * @param {String} id The name of the section in which the animation plays
	 * @param {Function} animationFunction The function to run when active
	 */
	function registerAnimationFunction(id, animationFunction) {
		const idValue = toValue(id);

		if (idValue && animationFunction) {
			animationFunctions.set(id, animationFunction);
		}
	}

	/**
	 * Set the currently active section
	 *
	 * @param {String} id The name of the section that is now active
	 */
	function setActiveSection(id) {
		currentSection.value = id;
	}

	/**
	 * Manually set playback as enabled or disabled
	 *
	 * @param {Boolean} disabled True to disable playback or false to enable it
	 */
	function setPlaybackDisabled(disabled) {
		playbackDisabled.value = disabled;
	}

	return { registerAnimationFunction, setActiveSection, setPlaybackDisabled };
}
