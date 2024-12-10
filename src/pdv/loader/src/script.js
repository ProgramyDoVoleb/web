export default {
	name: 'Loader',
	props: ['rule', 'reserve'],
	computed: {
		_r: function () {
			return this.reserve || '200px'
		}
	}
};
