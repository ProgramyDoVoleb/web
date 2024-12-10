export default {
	name: 'Flex',
	props: ['flex', 'align', 'tick'],
	methods: {
		makeFlexible: function () {

			if (typeof this.flex === 'object' && this.$el.children) {

				// this.$el.children.forEach((el, index) => {
				// 	el.classList.add('p-flex---0-' + this.flex[0][index]);
				// 	el.classList.add('p-flex---1-' + this.flex[1][index]);
				// 	el.classList.add('p-flex---2-' + this.flex[2][index]);
				// 	el.classList.add('p-flex---3-' + this.flex[3][index]);
				// });

				for (var i = 0; i < this.$el.children.length; i++) {
					this.$el.children[i].classList.add('p-flex---0-' + this.flex[0][i]);
					this.$el.children[i].classList.add('p-flex---1-' + this.flex[1][i]);
					this.$el.children[i].classList.add('p-flex---2-' + this.flex[2][i]);
					this.$el.children[i].classList.add('p-flex---3-' + this.flex[3][i]);
				}

				this.flex.forEach((breakpoint, index) => {
					var pb = false;

					breakpoint.forEach(b => {
						if (b === -1) pb = true;
					})

					if (pb === true) {
						this.$el.classList.add('p-flex---' + index + '-wrap');
					}
				});
			}

			if (typeof this.flex === 'number' && this.$el.children) {

				this.$el.classList.add('p-flex---wrap');

				for (var i = 0; i < this.$el.children.length; i++) {
					this.$el.children[i].style.width = this.flex + 'rem';
				}
			}

			if (this.tick) {
				// do nothing
			}
		}
	},
	mounted: function () {
		this.makeFlexible()
	},
	watch: {
		flex: function () {
			this.makeFlexible()
		},
		tick: function () {
			this.makeFlexible()
		}
	}
};
