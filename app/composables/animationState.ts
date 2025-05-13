/**
 * Handle the management of a component's animation based on its active state
 *
 * @param activeState Ref or getter indicating whether this animatable is active
 * @param animationFunction The animation function to run during active state
 * @returns A ref of the animation frame request ID
 */
export const useAnimationState = (
	activeState: MaybeRefOrGetter<boolean>,
	animationFunction: () => void,
) => {
	const animationFrameId = ref<number>();

	const isActive = toValue(activeState);

	if (isActive) {
		animationFrameId.value = requestAnimationFrame(animationFunction);
	}

	watch(
		() => toValue(activeState),
		(isNowActive, wasActive) => {
			if (animationFrameId.value) {
				cancelAnimationFrame(animationFrameId.value);
			}

			if (isNowActive && !wasActive) {
				animationFrameId.value = requestAnimationFrame(animationFunction);
			}
		},
	);

	return animationFrameId;
};
