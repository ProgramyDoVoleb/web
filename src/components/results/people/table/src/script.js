import { number, pct, round, truncate } from '@/pdv/helpers';
import { cdn } from '@/stores/core';

export default {
	name: 'results-parties-table',
	props: ['list', 'kolo'],
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
			return this.list.filter(x => this.kolo === 1 ? x.passed : x.mandate).length
		},
		missed: function () {
			return this.list.filter(x => !x.passed).length
		},
		display: function () {
			var arr = this.list.filter(x => this.kolo === 1 ? true : !!x.passed);
			var rest = [];

			arr.map(x => x.pct = x['round' + this.kolo].pct);
			arr.map(x => x.votes = x['round' + this.kolo].votes);
			arr.map(x => x.graph = x['round' + this.kolo].graph);
			
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

			o.graph = pct(o.pct, arr[0].pct * 1.2, 2);

			if (this.show === false && o.votes > 0) arr.push(o);

			arr.sort((a, b) => b.pct - a.pct);
			
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
