export default {
	name: 'Loader',
	props: ['rule', 'reserve'],
	computed: {
		_r: function () {
			return this.reserve || '200px'
		}
	},
	mounted: function () {
		this.$nextTick(() => {
			if (!this.$refs || !this.$refs.loader) return;

			var el = this.$refs.loader;
			var h = el.getBoundingClientRect().height;

			if (h < 40) {
				el.classList.add('loaderAnimationHorizontal')
				for (var i = 0; i < 6; i++) {
					var e = document.createElement('div');
					e.className = 'loaderAnimation loaderAnimationSetup';
					e.setAttribute('style', 'animation-delay: ' + (.05 * i) + 's');
					el.appendChild(e);
				}
			} else {
				for (var i = 0; i < Math.floor(h / 32); i++) {
					var e = document.createElement('div');
					e.className = 'loaderAnimation loaderAnimationSetup';
					e.setAttribute('style', 'animation-delay: ' + (.05 * i) + 's');
					el.appendChild(e);
				}
			}
		});
	}
};
