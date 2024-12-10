import {useData} from '@/stores/data';
import { colorByItem, logoByItem } from '@/components/results/helpers';
import { type, date, number } from '@/pdv/helpers';
import { useCore, cdn } from '@/stores/core';

export default {
	name: 'party-polls',
	props: ['VSTRANA', 'color', 'isCoalition'],
	data: function () {
		return {
			cdn,
			agency: ['Kantar', 'Median', 'STEM', 'CVVM', 'Data Collect', 'Ipsos'],
			agencySelected: null,
			width: 0,
			tick: 1,
			el: null
		}
	},
	computed: {
		$store: function () {
			return useData()
		},
		data: function () {
			var d = this.$store.getters.pdv('polls/fetch/' + this.VSTRANA);

			if (d) {
				setTimeout(() => this.elsvg(), 500);
			}

			return d;
		},
		points: function () {
			var list = [];

			if (this.data) {
				this.data.entries.forEach(entry => {

					var poll = this.data.polls.find(x => x.id === entry.poll);

					if (poll) {

						list.push({
							x: new Date(poll.datum).getTime(),
							y: entry.value,
							a: poll.agency,
							data: {poll, entry}
						});
					}
				});

				list.sort((a, b) => a.x - b.x);
			}

			// this.tick++;

			return list;
		},
		minmax: function () {
			if (!this.data) return;

			var list = this.points.map(x => x.y);
			var dates = this.points.map(x => x.x);

			return {
				minX: Math.min(...dates),
				maxX: Math.max(...dates),
				minY: 0,
				maxY: Math.max(10, ...list)

			}
		},
		relatives: function () {
			if (!this.data || this.points.length === 0) return;

			var list = [];

			this.points.forEach(point => {
				var o = {
					a: point.a,
					v: point.y,
					d: point.x,
					x: (point.x - this.minmax.minX) / (this.minmax.maxX - this.minmax.minX),
					y: (this.minmax.maxY - point.y) / this.minmax.maxY,
					data: point.data
				}

				list.push(o);
			});

			// this.tick++;

			return list;
		},
		circles: function () {
			if (!this.data || this.relatives.length === 0 || !this.el || this.width < 0) return;

			var list = [];

			if (this.el) {

				var svgel = this.el.getBoundingClientRect();

				this.relatives.forEach(relative => {
					var o = {
						x: Math.round(relative.x * (svgel.width - 50)) + 25,
						y: Math.round(relative.y * (svgel.height - 50)) + 25,
						a: relative.a,
						v: relative.v,
						d: relative.d,
						data: relative.data
					}
	
					list.push(o);
				});
			}

			// this.tick++;

			return list;
		},
		years: function () {
			if (!this.data || this.relatives.length === 0 || !this.el || this.width < 0) return;

			var list = [];

			var svgel = this.el.getBoundingClientRect();

			[2020,2021,2022,2023,2024,2025].forEach(year => {
				var o = {
					x: Math.round((new Date(year + '-01-01').getTime() - this.minmax.minX) / (this.minmax.maxX - this.minmax.minX) * (svgel.width - 50)) + 25, 
					y: Math.round(1 * (svgel.height - 50)) + 25,
					d: year
				}

				list.push(o);
			});

			return list;
		},
		splits: function () {
			if (!this.data || this.relatives.length === 0 || !this.el || this.width < 0) return;

			var list = [];

			var svgel = this.el.getBoundingClientRect();

			[0,5,10,15,20,25,30,35,40].forEach(splitter => {
				var o = {
					y: Math.round((1 - (splitter / this.minmax.maxY)) * (svgel.height - 50)) + 25,
					d: splitter
				}

				list.push(o);
			});

			return list;
		},
		agencies: function () {
			if (!this.data || !this.circles || !this.el || this.width < 0) return;

			var list = [];

			this.agency.forEach(agency => {
				var o = {
					agency,
					points: this.circles.filter(x => (this.isCoalition || x.data.poll.pollofpolls) && x.a.toLowerCase().split(agency.toLowerCase()).length > 1)
				}

				if (o.points.length > 1) {
					function cp(a, b, c) {
						if (!a || !c) return b;
						return {
						  x: b.x + (c.y - a.y) * .05,
						  y: b.y + (c.y - a.y) * .0
						};
					  }

					  o.curve = o.points.flatMap((pt, i) => [
						cp(o.points[i + 1], pt, o.points[i - 1]),
						pt,
						cp(o.points[i - 1], pt, o.points[i + 1]),
					  ])
					  .slice(1, -1) // remove the control points before the first point and after the last one
					  .map(pt => [pt.x, pt.y]);

					  o.path = 'M ' + o.curve[0] + ' C ' + o.curve.slice(1).join(' ');
				}

				list.push(o);
			})

			return list;
		},
		latest: function () {

		}
	},
	methods: {
		date, number,
		elsvg: function () {
			this.width = window.innerWidth;
			this.el = document.querySelector('.svg');
		}
	},
	mounted: function () {
		window.addEventListener('resize', () => {
			this.elsvg();
		});
		
	}
};
