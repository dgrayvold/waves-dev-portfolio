export function useUi() {
	/**
	 * Smoothly scroll to given position in document or element or end if the chosen coordinate is greater
	 *
	 * @param y The y coordinate to scroll to
	 * @param frames The number of frames to run the animation
	 * @param scrollingElement The element to scroll within, if any; defaults to viewport if none supplied
	 *
	 * @return A Promise that resolves to true upon animation completion
	 */
	function smoothScroll(y: number, frames = 60, scrollingElement?: HTMLElement): Promise<true> {
		if (matchMedia('prefers-reduced-motion: reduced').matches) {
			return new Promise(res => {
				window.scrollTo(0, y);
				res(true);
			});
		}

		return new Promise(res => {
			let curFrame = 0;
			let curPosition = scrollingElement ? scrollingElement.scrollTop : window.scrollY;
			let curVelocity = 0;

			const documentMaxEndPosition = scrollingElement
				? scrollingElement.scrollHeight
				: document.body.offsetHeight - window.innerHeight;
			const endPosition = y > documentMaxEndPosition ? documentMaxEndPosition : y;
			const totalFrames = frames;
			const maxVelocity = ((endPosition - curPosition) / totalFrames) * 2;

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
