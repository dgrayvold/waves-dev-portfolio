<template>
	<div class="relative mx-8 py-16">
		<canvas
			ref="canvas"
			height="1000"
			width="1000"
			class="absolute top-16 left-0 transform rotate-45"
		></canvas>
		<div id="portrait" class="w-[300px] h-[300px] m-[100px] rounded-xl inline-block bg-black" />
	</div>
</template>

<script>
export default {
	mounted() {
		const c = this.$refs.canvas;
		const ctx = c.getContext('2d');
		const cellSize = 80;

		ctx.fillStyle = 'rgba(7,66,71,0.1)';

		for (let x = 40; x < 1000; x += cellSize) {
			for (let y = 40; y < 1000; y += cellSize) {
				const position = { x: x + cellSize, y: y + cellSize };
				const offset = {
					x: -cellSize + Math.random() * 25,
					y: -cellSize + Math.random() * 25,
				};

				ctx.beginPath();
				ctx.arc(
					position.x + offset.x,
					position.y + offset.y,
					Math.random() * 10 + 8,
					0,
					2 * Math.PI,
					false,
				);
				ctx.fill();
			}
		}
	},
};
</script>

<style scoped lang="postcss">
canvas {
	height: 500px;
	width: 500px;
}
#portrait {
	@apply relative;
}

/* #portrait::before {
	@apply absolute inset-0 transform rotate-45 scale-140;

	content: '';
	background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23074247' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E");
} */
</style>
