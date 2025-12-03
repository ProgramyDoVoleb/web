import {color, url, truncate, date} from '@/pdv/helpers';
// import {history} from '@/components/history/helpers';
import {useData} from '@/stores/data';
import {colorByItem} from '@/pdv/helpers';

function reg (party) {
	var r = party.reg;

	if (party.coal.length === 2 && party.coal.find(x => x === 80)) {
		r = !party.coal.find(x => x === 80);
	}

	return r;
}

export default {
	name: 'history-town',
	props: ['num', 'colors', 'seats', 'limit'],
	data: function () {
		return {
			width: 0,
			height: 0,
			heightMultiplicator: 2,
			highlight: {
				show: false,
				type: 0,
				selected: -1,
				sub: -1,
				list: []
			},
			old: {
				type: -1,
				selected: -1,
				sub: -1
			},
			delayClick: false,
			delay: false,
			selected: {
				type: null,
				node: null,
				sub: null
			},
			selectedOld: null,
			query: null
		}
	},
	computed: {
		$store: function () {
			return useData()
		},
		data: function () {
			var d = this.$store.getters.pdv('town/history-candidates/' + this.num);

			if (d) {
				d.strany.forEach(strana => {
					strana.$color = colorByItem(strana, d);
					if (this.height < strana.$offset + 100) this.height = strana.$offset + 100;
				});

				d.kandidati.forEach(kandidat => {
					kandidat.index = url(kandidat.JMENO + ' ' + kandidat.PRIJMENI);
				});

				d.list.forEach(link => {
					link[0].$color = d.strany.find(x => x.id === link[0].pid).$color;
				});
			}

			return d;
		},
		columns: function () {
			if (!this.data) return;

			var arr = [];

			this.data.cis.volby.forEach((volby, index) => {
				arr.push(((this.width - 40) / (this.data.cis.volby.length - 1)) * (this.data.cis.volby.length - index - 1) - 3 + 20)
			});

			return arr;
		},
		lines: function () {
			if (!this.data) return;

			var arr = [];

			this.data.list.forEach(line => {
				if (true) {
					var obj = {
						data: line,
						points: [],
						path: "",
						color: line[0].$color
					}

					this.columns.forEach(c => {
						obj.points.push({
							skip: true,
							x: c + 3,
							y: -1000
						});
					})

					line.forEach(entry => {
						var point = obj.points[entry.el];
						point.skip = false;
						point.y = this.data.strany.find(x => x.id === entry.pid).$offset + 20 + entry.loc[3];
					});

					// obj.points.forEach((c, i) => {
						var path = ["M " + obj.points[0].x + ',' + obj.points[0].y];
						var dist = Math.round((this.columns[0] - this.columns[1]) / 3);

						obj.points.forEach((point, index) => {
							if (index > 0 && obj.points[index - 1].x != point.x) {
								if (point.skip) {
									path.push("M " + (point.x + ',' + point.y));
								} else {
									if (obj.points[index - 1].skip) {
										path.push("M " + (point.x + ',' + point.y));
									} else {
										path.push("C " + (obj.points[index - 1].x - dist) + ',' + (obj.points[index - 1].y) + ' ' + (point.x + dist) + ',' + (point.y) + ' ' + (point.x + ',' + point.y));
									}
								}

							}
						});

						obj.path = path.join(' ');
					// })

					arr.push(obj);
				}
			});

			return arr;
		},
		linesLimited: function () {
			if (!this.data) return;

			var arr = [];

			this.lines.forEach(line => {
				if (this.selected.type === null) {
					arr.push(line);
				}
				if (this.selected.type === 'party') {
					if (line.data.find(x => x.pid === this.selected.node)) {
						arr.push(line);
					}
				}
				if (this.selected.type === 'candidate') {
					if (line.data.find(x => x.id === this.selected.node)) {
						arr.push(line);
					}
				}
			});

			return arr;
		},
		selectedCandidate: function () {
			if (!this.selected.type || this.selected.type != 'candidate' || !this.selected.node) return;

			return this.data.kandidati.find(x => x.id === this.selected.node)
		},
		years: function () {
			if (!this.data) return;

			var years = [];
			var list = [];
			var largest = 0;

			this.data.cis.volby.forEach(v => {
				years.push(v.datum.split('-')[0]);
				list.push(null);
			});

			var cc = [];

			if (this.data.cis.obec[0].MANDATY > 20) {
				this.heightMultiplicator = 1;
			}

			if (this.data.cis.obec[0].MANDATY > 40) {
				this.heightMultiplicator = .5;
			}

			this.data.cis.obec.forEach((seat, index) => {
				if (seat != null) {

					var obj = {
						year: years[index],
						seats: seat.MANDATY,
						parties: this.data.strany.filter(x => x.volby === seat.volby),
						candidates: this.data.kandidati.filter(x => x.volby === seat.volby),
						height: this.data.kandidati.filter(x => x.volby === seat.volby).length * this.heightMultiplicator + (this.data.strany.filter(x => x.volby === seat.volby).length - 1) * 10,
						x: this.width - 10 - (Math.round((this.width - 20) / 4)) * index
					}

					obj.parties.forEach((party, index2) => {
						party.list = obj.candidates.filter(x => x.POR_STR_HL === party.POR_STR_HL);
						party.list.sort((a, b) => a.PORCISLO - b.PORCISLO);
						party.height = party.list.filter(x => x.COBVODU === party.COBVODU).length * this.heightMultiplicator;
						party.y = index2 === 0 ? 25 : obj.parties[index2 - 1].y + obj.parties[index2 - 1].list.filter(x => x.COBVODU === obj.parties[index2 - 1].COBVODU).length * this.heightMultiplicator + 10;

						if (party.COBVODU > 1 && index2 > 0 && obj.parties[index2 - 1].VSTRANA === party.VSTRANA) party.y -= 8;

						party.color = colorByItem(party, this.data);
					})

					obj.height = obj.parties[obj.parties.length - 1].y + 50;

					list[index] = obj;

					if (largest < obj.height) largest = obj.height;
				}
			})

			this.height = largest + 20;

			return list;
		},
		history: function () {
			return this.data ? this.data.list : null;
		},
		highlightList: function () {
			if (!this.history) return;

			var list = [];
			var cid = [];
			var p = null;

			if (this.highlight.type === 1 && this.highlight.selected && typeof this.highlight.selected.length != "undefined" && this.highlight.sub > -1) {
				p = this.history.find(x => x[0].index === 0 && x[0].cand.no === this.highlight.selected[0] && x[0].cand.obvod === this.highlight.selected[1] && x[0].cand.cand === this.highlight.sub);

				if (p) {
					list.push({cand: p[0].cand, history: p});
					cid.push(p[0].cand.cid);
				}
			}

			if (this.highlight.type === 2 && this.highlight.selected && typeof this.highlight.selected.length != "undefined") {
				p = this.history.filter(x => x[0].index === 0 && x[0].cand.no === this.highlight.selected[0] && x[0].cand.obvod === this.highlight.selected[1]);

				p.forEach(pp => {
					list.push({cand: pp[0].cand, history: pp});
					cid.push(pp[0].cand.cid)
				});
			}

			if (this.highlight.type === 3 && this.highlight.selected != -1 && this.highlight.sub != -1) {
				p = this.history.filter(x => x[0].index === 0);

				p.forEach(pp => {
					var y = pp.find(x => x.index === this.highlight.selected);

					if (y && typeof this.highlight.sub === 'object' && y.cand.no === this.highlight.sub[0] && y.cand.obvod === this.highlight.sub[1]) {
						list.push({cand: pp[0].cand, history: pp});
						cid.push(pp[0].cand.cid)
					}
				});
			}

			if (list.length > 0) this.$emit('update', {list, years: this.years});

			return {list, cid};
		},
		people: function () {
			if (!this.history) return;

			var list = [];

			this.history.forEach(person => {
				if (person[0].el === 0) {
					var obj = {
						color: colorByItem(this.data.strany.find(x => x.volby === person[0].volby && person[0].POR_STR_HL === x.POR_STR_HL && person[0].COBVODU === x.COBVODU), this.data),
						evo: [this.data.kandidati.find(x => x.id === person[0].id)],
						points: [],
						index: person[0].el,
						path: null,
						// highlight: this.highlight.type > 0 && this.highlightList.find(x => x.cand === person[0].cand)
					}

					obj.cid = obj.evo.id;

					for (var i = obj.index; i < 5; i++) {
						if (person.find(x => x.index === i)) {
							var year = this.years[i];
							var p = person.find(x => x.index === i);
							var cand = p.cand;

							var party = year.parties.find(x => x.no === cand.no && x.obvod === cand.obvod);

							if (party) {
								obj.points.push({x: year.x, y: party.y + cand.cand * this.heightMultiplicator - .5});
							} else {
								// obj.points.push(obj.points[obj.points.length - 1]);
								// console.log(obj.points);
							}
						} else {
							obj.points.push({x: this.years[i].x, y: this.height + 100, skip: true});
						}
					}

					var path = ["M " + obj.points[0].x + ',' + obj.points[0].y];
					var dist = Math.round((obj.points[0].x - obj.points[1].x) / 3);

					obj.points.forEach((point, index) => {
						if (index > 0 && obj.points[index - 1].x != point.x) {
							if (point.skip) {
								path.push("M " + (point.x + ',' + point.y));
							} else {
								if (obj.points[index - 1].skip) {
									path.push("M " + (point.x + ',' + point.y));
								} else {
									path.push("C " + (obj.points[index - 1].x - dist) + ',' + (obj.points[index - 1].y) + ' ' + (point.x + dist) + ',' + (point.y) + ' ' + (point.x + ',' + point.y));
								}
							}

						}
					});

					obj.path = path.join(' ');

					list.push(obj);
				}
			});

			return list;
		},
		viewBox: function () {
			return '0 0 ' + this.width + ' ' + this.height;
		},
		queried: function () {
			return this.query ? url(this.query) : null
		}
	},
	methods: {
		date, 
		setWidth: function () {
			this.width = this.$el.offsetWidth;
		},
		select: function (type, node, sub) {
			this.selected.type = type;

			setTimeout(() => {
				this.selected.node = node;
				this.selected.sub = sub;
			}, 100);
		},
		click_setLimit: function (year, no) {
			if (!this.limit) {
				this.highlight.type = year === 0 ? 2 : 3;
				setTimeout(() => {
					if (year === 0) {
						this.highlight.selected = no;
					} else {
						this.highlight.selected = year;
						setTimeout(() => this.highlight.sub = no, 200);
					}

				}, 100);
			}
		},
		personname: function (data) {
			return [data.cand.name[2],data.cand.name[0],data.cand.name[1],data.cand.name[3]]
		},
		truncate,
		sort: function (list) {
			list.sort((a, b) => a.PRIJMENI.localeCompare(b.PRIJMENI, 'cs'));
			return list;
		}
	},
	mounted: function () {
		this.setWidth();
		this.height = 2000;

		if (this.seats < 40) {
			this.delayClick = false;
		}

		window.addEventListener('resize', () => this.setWidth());

		setTimeout(() => this.delay = false, 2000);

		if (this.limit) {
			this.highlight.type = this.limit[0];
			setTimeout(() => this.highlight.selected = this.limit[1], 100);
			setTimeout(() => this.highlight.sub = this.limit[2], 200);
		}
	},
	watch: {
		selected: {
			handler: function () {
				if (this.selectedOld != this.selected.type) {
					this.selected.sub = null;
					this.selected.node = null;
					this.selectedOld = this.selected.type;
				}
			},
			deep: true
		},
		highlight: {
			handler: function () {
				// console.log(this.old.type, this.highlight.type, '-', this.old.selected, this.highlight.selected, '-', this.old.sub, this.highlight.sub);

				if (this.old.type != this.highlight.type) {
					this.highlight.selected = -1;
					this.highlight.sub = -1;
					this.old.selected = -1;
					this.old.sub = -1;
					this.old.type = this.highlight.type;
				} else if (this.old.selected != this.highlight.selected) {
					this.highlight.sub = -1;
					this.old.sub = -1;
					this.old.selected = this.highlight.selected;
				}
			},
			deep: true
		},
		limit: {
			handler: function () {
				this.highlight.type = this.limit[0];
				setTimeout(() => this.highlight.selected = this.limit[1], 100);
				setTimeout(() => this.highlight.sub = this.limit[2], 200);
			},
			deep: true
		}
	}
};
