export default {
	name: 'responsive-label',
	props: ['short', 'long', 'breakpoint'],
	computed: {
		cl: function () {
			return {
				long: 'show-' + (this.breakpoint || 40) + 'rem',
				short: 'hide-' + (this.breakpoint || 40) + 'rem'
			}
		}
	}
};
