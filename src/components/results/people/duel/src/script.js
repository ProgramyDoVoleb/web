import { number, pct, round, truncate } from '@/pdv/helpers';
import { cdn } from '@/stores/core';

export default {
	name: 'results-parties-graph',
	props: ['list', 'kolo'],
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

			arr.map(x => x.pct = x['round' + this.kolo].pct);
			arr.map(x => x.votes = x['round' + this.kolo].votes);
			arr.map(x => x.graph = x['round' + this.kolo].graph);

			rest.map(x => x.pct = x['round' + this.kolo].pct);
			rest.map(x => x.votes = x['round' + this.kolo].votes);
			rest.map(x => x.graph = x['round' + this.kolo].graph);
			
			var o = {
				label: 'ostatní',
				short: 'ostatní',
				link: null,
				color: '#88888844',
				photo: cdn + 'empty.png',
				votes: rest.reduce((a, b) => a + b.votes, 0),
				pct: rest.reduce((a, b) => a + b.pct, 0),
				mandates: null,
				passed: false
			}

			if (o.votes > 0) arr.push(o);
			
			var highest = 0;

			arr.forEach(x => {
				if (highest < x.pct) highest = x.pct;
			})
			
			arr.forEach(x => {
				x.graph = x.pct;
			})

			if (arr[0].ref) {
				arr.sort((a, b) => b.ref.round2.pct - a.ref.round2.pct);
			} else {
				arr.sort((a, b) => b.pct - a.pct);
			}
			
			
			return arr;
		},
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
