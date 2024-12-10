import { number, pct, round, truncate } from '@/pdv/helpers';
import { cdn } from '@/stores/core';

export default {
	name: 'results-parties-graph',
	props: ['list'],
	data: function () {
		return {
			show: false,
			width: 400,
		}
	},
	methods: {
		number
	},
	computed: {
		passed: function () {
			return this.list.filter(x => x.passed).length
		},
		missed: function () {
			return this.list.filter(x => !x.passed).length
		},
		display: function () {
			var arr = this.list.filter(x => x.passed);
			var rest = [];

			// console.log(this.$el);

			this.list.filter(x => !x.passed).forEach(item => {
				if (arr.length < (this.width < 800 ? 7 : 10)) {
					arr.push(item);
				} else {
					rest.push(item);
				}
			});
			
			var o = {
				label: 'ostatní',
				short: 'ostatní',
				link: null,
				color: '#88888844',
				logo: cdn + 'empty.png',
				votes: rest.reduce((a, b) => a + b.votes, 0),
				pct: rest.reduce((a, b) => a + b.pct, 0),
				mandates: null,
				passed: false
			}

			if (arr[0].ref) {
				o.ref = {
					votes: rest.reduce((a, b) => a + b.ref.votes, 0),
					pct: rest.reduce((a, b) => a + b.ref.pct, 0)
				}
			}

			if (o.votes > 0) arr.push(o);
			
			var highest = 0;

			arr.forEach(x => {
				if (highest < x.pct) highest = x.pct;

				if (x.ref && x.ref.pct > highest) highest = x.ref.pct;
			})
			
			arr.forEach(x => {
				x.graph = pct(x.pct, highest * (highest === o.pct ? 1.4 : 1.2), 2);

				if (x.ref) {
					x.ref.graph = pct(x.ref.pct, highest * (highest === o.pct ? 1.4 : 1.2), 2);
				}
			})
			
			return arr;
		}
	},
	methods: {
		round,
		truncate,
		onResize: function () {
			this.width = this.$el.getBoundingClientRect().width;
		}
	},
	mounted: function () {
		setTimeout(() => {
			this.show = true
		}, 150)
		this.onResize();
		window.addEventListener("resize", () => this.onResize());
	},
	watch: {
		list: function () {
			this.show = false;
			
			setTimeout(() => {
				this.show = true
			}, 150)
		}
	}
};
