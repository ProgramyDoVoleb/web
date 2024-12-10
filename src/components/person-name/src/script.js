export default {
	name: 'person-name',
	props: ['data', 'full', 'short'],
	computed: {
		dataParsed: function () {
			return [this.data[1], this.data[2], this.data[0], this.data[3]];
		}
	}
};
