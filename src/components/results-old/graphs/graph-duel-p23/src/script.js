// import {createColorByName} from "@/common/helpers";

export default {
	name: 'results-graph-duel',
	props: ['data', 'local'],
	data: function () {
		return {
			loaded: false,
			bg: [],
			visible: false
		}
	},
	components: {},
	methods: {
		coef: function (local) {
			var max = 0;

			this.data.list.forEach(result => {
				if (local === true) {
					if (result.local.pct > max) max = result.local.pct;
				} else {
					if (result.pct > max) max = result.pct;
				}
			})

			return 100 / max * .95;
		},
		pct: function (count, base) {
			return Math.round(10000 * count / base)/100
		},
		rnd: function (value) {
			return Math.round(value * 100) / 100;
		}
	},
	computed: {
		rest: function () {
			return 100 - this.data.list[0].pct - this.data.list[1].pct;
		}
	},
	mounted: function () {
			this.loaded = true;

			this.data.list.forEach(item => {
				this.bg.push(item.color);
			});

			setTimeout(() => {
				if (this.$el.getBoundingClientRect().top < window.innerHeight) {
					this.visible = true;
					this.$el.querySelectorAll('.zero').forEach(el => el.classList.remove("zero"));
				} else {
					window.addEventListener('scroll', () => {
						if (!this.visible) {
							if (this.$el.getBoundingClientRect().top < window.innerHeight) {
								this.visible = true;
								this.$el.querySelectorAll('.zero').forEach(el => el.classList.remove("zero"));
							}
						}
					});
				}
			}, 100);
	}
};
