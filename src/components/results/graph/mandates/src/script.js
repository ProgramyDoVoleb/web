export default {
	name: 'results-graph-mandates',
	props: ['circles'],
	methods: {
		recolor: function () {
			if (this.circles) {
				this.circles.forEach((item, index) => {
					var el = this.$el.querySelector('circle:nth-child(' + (index + 1) + ')');
					el.style.fill = item.color;
					el.style.opacity = item.selected || this.circles.filter(x => x.selected).length === 0 ? 1 : .05;
				});
			}
		}
	},
	watch: {
		circles: function () {
			this.recolor();
		}
	},
	mounted: function () {
		this.recolor()
	}
};
