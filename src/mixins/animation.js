/**
 * Props and watchers for determining current state of component's animation
 */
export default {
	props: {
		/**
		 * Whether playback should be possible (e.g. for reduced motion preference)
		 */
		playbackDisabled: {
			type: Boolean,
			default: false,
		},

		/**
		 * Whether the animation is currently running (dependent on playback being enabled)
		 */
		playing: {
			type: Boolean,
			default: true,
		},
	},

	data() {
		return {
			/**
			 * The current requestAnimationFrame ID for canceling if restarting animation while
			 * it is currently playing
			 */
			animationFrameRequestId: null,
		};
	},

	watch: {
		/**
		 * React to changes in playback enabling/disabling
		 *
		 * @param {Boolean} newValue The new value of the property
		 */
		playbackDisabled(newValue) {
			if (!newValue && this.playing) {
				if (this.animationFrameRequestId !== null) {
					cancelAnimationFrame(this.animationFrameRequestId);
				}
				this.animationFrameRequestId = requestAnimationFrame(this.animate);
			}
		},

		/**
		 * React to changes in playback enabling/disabling
		 *
		 * @param {Boolean} newValue The new value of the property
		 */
		playing(newValue) {
			if (newValue && !this.playbackDisabled) {
				if (this.animationFrameRequestId !== null) {
					cancelAnimationFrame(this.animationFrameRequestId);
				}
				this.animationFrameRequestId = requestAnimationFrame(this.animate);
			}
		},
	},
};
