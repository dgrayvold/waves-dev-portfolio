export function useUi() {
	/**
	 * Smoothly scroll to given position in document or element or end if the chosen coordinate is greater
	 *
	 * @param {Number}            y                  The y coordinate to scroll to
	 * @param {Number}            [frames=60]        The number of frames to run the animation
	 * @param {Element}           [scrollingElement] The element to scroll within
	 *
	 * @return {Promise<Boolean>} A Promise that resolves to true upon animation completion
	 */
	function smoothScroll(y, frames = 60, scrollingElement) {
		if (matchMedia('prefers-reduced-motion: reduced').matches) {
			return new Promise(res => {
				window.scrollTo(0, y);
				res();
			});
		}

		return new Promise(res => {
			let curFrame = 0,
				curPosition = scrollingElement ? scrollingElement.scrollTop : window.pageYOffset,
				documentMaxEndPosition = scrollingElement
					? scrollingElement.scrollHeight
					: document.body.offsetHeight - window.innerHeight,
				endPosition = y > documentMaxEndPosition ? documentMaxEndPosition : y,
				totalFrames = frames,
				curVelocity = 0,
				maxVelocity = ((endPosition - curPosition) / totalFrames) * 2;

			requestAnimationFrame(scrollRamp);

			function scrollRamp() {
				curFrame++;

				if (curFrame == totalFrames) {
					if (curPosition != endPosition) {
						if (scrollingElement) {
							scrollingElement.scrollTo(0, endPosition);
						} else {
							window.scrollTo(0, endPosition);
						}
					}

					return res(true);
				}

				if (curFrame > totalFrames / 2 && curFrame < totalFrames) {
					//Easing out
					curVelocity = maxVelocity * (2 - curFrame / (totalFrames / 2));
				} else if (curFrame <= totalFrames / 2) {
					//Easing in
					curVelocity = maxVelocity * (curFrame / (totalFrames / 2));
				}

				curPosition += curVelocity;

				if (scrollingElement) {
					scrollingElement.scrollTo(0, curPosition);
				} else {
					window.scrollTo(0, curPosition);
				}

				requestAnimationFrame(scrollRamp);
			}
		});
	}

	return { smoothScroll };
}
