export default {
	name: 'LineGraph',
	props: ['color', 'value', 'addon', 'append', 'label'],
	data: function () {
		return {
			visible: false
		}
	},
	computed: {
		shown: function () {
			return this.visible ? this.value : 0
		}
	},
	mounted: function () {
		if (this.$el.getBoundingClientRect().top < window.innerHeight) {
			this.visible = true;
		} else {
			window.addEventListener('scroll', () => {
				if (!this.visible) {
					if (this.$el.getBoundingClientRect().top < window.innerHeight) {
						this.visible = true;
					}
				}
			});
		}
	}
};
