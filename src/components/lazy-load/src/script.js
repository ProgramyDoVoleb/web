// var timer;

export default {
	name: 'lazy-loader',
	props: ['src', 'display', 'ratio', 'height', 'width', 'reserve'],
	data: function () {
		return {
			loaded: false,
			loading: false,
			position: 0,
			scrolled: 0,
			_height: 0
		}
	},
	methods: {
		_isSVG: function () {
			return this.src.split('.svg').length === 2;
		},
		loadComplete: function () {
			this.loaded = true;
		},
		load: function () {
			this.loading = true;
			// console.log(timer);
			// clearInterval(timer);

			var l = new Image();
			l.addEventListener('load', () => this.loadComplete());
			l.src = this.src;
		},
		check: function () {
			if (this.loading === true || this.loaded === true) return;
			if (!this.$el) return;

			if (this._isSVG()) {
				this._height = this.height || this.$el.offsetWidth * this.ratio;
			} else {
				this._height = 'auto';
			}

			this.position = this.$el.getBoundingClientRect().top + this.$el.scrollTop;

			if (this.position - 500 < window.innerHeight) this.load();
		},
		scroll: function () {
			var value = window.pageYOffset || document.documentElement.scrollTop;
			if (value > this.scrolled) this.scrolled = value;
		}
	},
	mounted: function () {
		window.addEventListener('scroll', () => this.scroll());

		setInterval(() => this.check(), 250);
	}
};
