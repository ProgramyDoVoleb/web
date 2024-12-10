export default {
	name: 'person-icon',
	props: ['data', 'size', 'color'],
	computed: {
		s: function () {
			return this.size ? this.size + 'rem' : '12rem';
		},
		s2: function () {
			return this.size ? (this.size / 3) + 'rem' : '4rem';
		},
		c: function () {
			return this.color || '#aaa'
		}
	}
};
