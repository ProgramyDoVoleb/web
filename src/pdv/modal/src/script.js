export default {
	name: 'modal-element',
	props: ['inline', 'aria'],
	data: function () {
		return {
			opened: false
		}
	},
	methods: {
		hide: function () {
			this.opened = false;
		},
		show: function () {
			this.opened = true;
		}
	}
};
