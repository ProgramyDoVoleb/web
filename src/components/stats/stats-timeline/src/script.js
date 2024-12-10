import {number, date} from "@/pdv/helpers";

export default {
	name: 'stats-timeline',
	props: ['data'],
	data: function () {
		return {
			h: 0,
			w: 0,
			partHeight: 100,
			offsetTop: 20,
			offsetLeft: 90,
			offsetRight: 10,
			graphWidth: 0,
			viewBox: '0 0 0 0',
			selected: -1,
			width: 400
		}
	},
	computed: {
		grads: function () {
			var list = [];

			this.data.parties.forEach((party, index) => {
				var color = this.color(party);

				if (color) {
					list.push({
						reg: party.reg,
						name: 'grad_' + party.reg,
						stops: color
					})
				}
			});

			return list;
		},
		values: function () {
			var list = [];

			this.data.parties.forEach((party, indexParty) => {

				var pct = [];

				party.list.forEach((item, indexDate) => {

					var value = item;

					if (value) {
						if (indexParty === 0) {
							pct.push([0, value.pct])
						} else {
							if (list[indexParty - 1].pct[indexDate][1] < 100) {
								if (list[indexParty - 1].pct[indexDate][1] + value.pct > 100) {
									pct.push([list[indexParty - 1].pct[indexDate][1], list[indexParty - 1].pct[indexDate][1]])
								} else {
									pct.push([list[indexParty - 1].pct[indexDate][1], list[indexParty - 1].pct[indexDate][1] + value.pct])
								}
							} else {
								pct.push([100, 100]);
							}
						}
					} else {
						if (indexParty === 0) {
							pct.push([0, 0])
						} else {
							pct.push([list[indexParty - 1].pct[indexDate][1], list[indexParty - 1].pct[indexDate][1]])
						}
					}
				});

				list.push({
					party,
					pct
				})
			});

			var rest = {
				party: {
					name: 'Ostatní',
					color: '#eee'
				},
				pct: []
			}

			// this.data.list.forEach((item, indexDate) => {
			// 	// if (rest.pct.length > 0) {
			// 		if (list[list.length - 1].pct[indexDate]) {
			// 			rest.pct.push([list[list.length - 1].pct[indexDate][1], 100]);
			// 		} else {
			// 			rest.pct.push([100, 100]);
			// 		}
			// 	// } else {
			// 	// 	rest.pct.push([100, 100]);
			// 	// }

			// });

			// list.push(rest);

			function getPoint(pct, line, self, add) {
				var x, y;

				x = pct / 100 * self.graphWidth + self.offsetLeft + (add ? add * self.graphWidth : 0);
				y = line * self.partHeight + self.offsetTop;

				return {x, y};
			}

			list.forEach(item => {
				item.coord = [];

				item.pct.forEach((value, index) => {
					var pointA = getPoint(value[0], index, this);
					var pointB = getPoint(value[1], index, this, .001);

					item.coord.push([pointA, pointB]);
				});
			});

			list.forEach(item => {
				var p = [];

				p.push('M ' + item.coord[0][0].x + ' ' + item.coord[0][0].y);

				for (var i = 1; i < item.coord.length; i++) {
					p.push('C ' + item.coord[i - 1][0].x + ' ' + (item.coord[i - 1][0].y + this.partHeight / 2));
					p.push(item.coord[i][0].x + ' ' + (item.coord[i][0].y - this.partHeight / 2));
					p.push(item.coord[i][0].x + ' ' + item.coord[i][0].y);
				}

				p.push('L ' + item.coord[item.coord.length - 1][1].x + ' ' + item.coord[item.coord.length - 1][1].y);

				for (var i = item.coord.length - 1; i > 0; i--) {
					p.push('C ' + item.coord[i][1].x + ' ' + (item.coord[i][1].y - this.partHeight / 2));
					p.push(item.coord[i - 1][1].x + ' ' + (item.coord[i - 1][1].y + this.partHeight / 2));
					p.push(item.coord[i - 1][1].x + ' ' + item.coord[i - 1][1].y);
				}

				p.push('L ' + item.coord[0][0].x + ' ' + item.coord[0][0].y);

				item.path = p.join(' ');

			});

			list.forEach(item => {
				var grad = this.grads.find(g => g.reg === item.party.reg);

				if (grad) {
					item.grad = grad.name;
				}
			})



			return list;
		},
	},
	methods: {
		number,
		date,
		resize: function () {
			setTimeout(() => {
				this.width = this.$el.getBoundingClientRect().width;

				// if (this.width > 250) this.width = 250;

				this.h = (this.data.dates.length - 1) * this.partHeight + this.offsetTop * 2;
				this.w = this.width || this.$el.querySelector("svg").clientWidth;
				this.viewBox = '0 0 ' + this.w + ' ' + this.h;
				this.graphWidth = this.w - this.offsetLeft - this.offsetRight;
			}, 1000);
		},
		color: function (party) {
			var color = party.color;

			if (party.color === "#aaa" && party.coalition) {
				var arr = [];
				var clr = [];

				party.coalition.forEach(reg => {
					arr.push(this.$store.getters.getPartyByReg(reg).color);
				});

				arr.forEach((a, i) => {
					clr.push({
						color: a,
						pct: i / (arr.length - 1) * 100
					});
				});

				return clr;

			} else {
				return undefined;
			}
		},
		select: function (id) {
			this.selected = id;
		},
		getSelected: function () {
			var arr = [];

			this.data.parties.forEach(party => {
				if (party.list[this.selected].pct > 0) {
					var obj = {
						name: party.list[this.selected].name || party.name,
						pct: party.list[this.selected].pct,
						color: party.color
					}

					arr.push(obj);
				}
			});

			arr.sort((a, b) => b.pct - a.pct);

			return arr;
		}
	},
	mounted: function () {
		this.resize();
		window.addEventListener('resize', () => this.resize());
	}
};
