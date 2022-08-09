<template>
	<canvas
		width="1000"
		height="1000"
		class="w-[500px] h-[500px] bg-true-gray-600 mx-auto"
		ref="canvas"
	></canvas>

	<svg ref="test" width="100" height="100" viewBox="0 0 100 100">
		<path class="fill-white" d="M50,0 L90,50 L50,100 L10,50 Z" />
	</svg>
</template>

<script>
export default {
	props: {
		color: {
			type: String,
			default: 'white',
		},
	},
	mounted() {
		const src = this.$refs.test.querySelector('path').getAttribute('d');
		const path = new Path2D(src);
		const c = this.$refs.canvas;
		const ctx = c.getContext('2d');

		// Draw reference guides
		ctx.fillStyle = 'yellow';
		ctx.fillRect(499, 0, 2, 1000);
		ctx.fillRect(0, 499, 1000, 2);

		ctx.fillStyle = this.color;
		ctx.scale(5, 5);

		// North
		ctx.translate(50, 0);
		ctx.fill(path);

		// East (from north)
		ctx.rotate((90 * Math.PI) / 180);
		ctx.translate(50, -150);
		ctx.fill(path);

		// South (from east)
		ctx.rotate((90 * Math.PI) / 180);
		ctx.translate(50, -150);
		ctx.fill(path);

		// West (from south)
		ctx.rotate((90 * Math.PI) / 180);
		ctx.translate(50, -150);
		ctx.fill(path);
	},
};
</script>
