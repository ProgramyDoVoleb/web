export default {
	name: 'BoxLine',
	props: ['height', 'color'],
	computed: {
		_height: function () {
			var value = '1em';

			if (this.height || this.height === 0) {
				value = this.height
			} // else if (this.$slots.default) {
				// value = this.$slots.default
			// }

			if (typeof value === 'number' || isNaN(value) === false) value += 'em';

			// console.log(value, this.height, this.$slots.default);

			return value;
		}
	}
};
