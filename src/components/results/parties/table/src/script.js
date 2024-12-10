import { number, pct, round, truncate } from '@/pdv/helpers';
import { cdn } from '@/stores/core';

export default {
	name: 'results-parties-table',
	props: ['list'],
	data: function () {
		return {
			show: false,
			global: false,
			width: 400,
			widthLimit: 600
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
		partyWithMaxPct: function () {
			var res = null;

			this.list.forEach(x => {
				if (res === null || res.pct < x.pct) {
					res = x;
				}
			});

			return res;
		},
		display: function () {
			var arr = this.list.filter(x => x.passed);
			var rest = [];

			this.list.filter(x => !x.passed).forEach(item => {
				if (arr.length < (this.show ? 1000 : (window.innerWidth < 800 ? 7 : 10))) {
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

			if (this.partyWithMaxPct) {
				o.ref = {
					votes: rest.reduce((a, b) => a + b.votes, 0),
					pct: rest.reduce((a, b) => a + b.pct, 0)
				}
			}

			o.graph = pct(o.pct, this.partyWithMaxPct.pct * 1.2, 2);

			if (this.show === false && o.votes > 0) arr.push(o);
			
			return arr;
		}
	},
	methods: {
		round,
		truncate,
		number,
		onResize: function () {
			this.width = this.$el.getBoundingClientRect().width;
		}
	},
	mounted: function () {
		this.onResize();
		window.addEventListener("resize", () => this.onResize());
	},
	watch: {
		list: function () {
			this.show = false;
		}
	}
};
