// import MapElement from '@/components/map/do.vue';
import SearchTown from "@/components/search-town/do.vue";
import {colorByItem} from '@/components/results/helpers';
import {useData} from '@/stores/data';
import {pct, round} from '@/pdv/helpers';
import { defineAsyncComponent } from 'vue';

export default {
	name: 'map-pro',
	props: ['current', 'cis', 'spec', 'column'],
	components: {
		MapElement: defineAsyncComponent(() => import('@/components/map/do.vue')),
		SearchTown
	},
	data: function () {
		return {
			showValue: undefined,
			showDetail: undefined,
			zoomValue: 0,
			showField: 1,
			colorDepth: 7,
			alert: false,
			townShow: [false, false, false, true, true, true, true, true],
			townShowLabel: ['250', '1000', '2500', '10 000', '25 000', '100 000', '1 000 000', 'Praha'],
			townShowLabelMobile: ['do 250', '1k', '2.5k', '10k', '25k', '100k', '1M', 'Praha'],
			infoDataLast: undefined,
			infoData: {
				name: '',
				top5: [],
				ucast: [],
				strana: []
			},
			tick: 0,
			recalculated: false
		}
	},
	computed: {
		partiesSortedByPct: function () {
			// var d = this.current.$vysledky ? this.current.$vysledky : null;
			var arr = [];

			// if (d) {
				this.current.$vysledky.forEach(x => arr.push(x));
				arr.sort((a, b) => b.PROCENT - a.PROCENT);
			// }

			return arr;
		},
		$store: function () {
			return useData()
		},
		$cis: function () {
			var d = this.$store.getters.pdv('elections/map/cis/' + this.current.datum);

			if (d) {
				if (d.cis.obce) {
					d.cis.obce.forEach(item => {
						if (item.length < 5) {
							if (item[3] < 250) {
								item.push(0)
							} else if (item[3] < 1000) {
								item.push(1)
							} else if (item[3] < 2500) {
								item.push(2)
							} else if (item[3] < 10000) {
								item.push(3)
							} else if (item[3] < 25000) {
								item.push(4)
							} else if (item[3] < 100000) {
								item.push(5)
							} else if (item[3] < 1000000) {
								item.push(6)
							} else {
								item.push(7)
							}
						}
					});
				}
				if (d.cis.okresy) {
					var arr = [];
					
					if (d.cis.backup_okresy) {
						d.cis.okresy = [];
						d.cis.backup_okresy.forEach(i => d.cis.okresy.push(i));
					} 

					d.cis.okresy.filter(x => (!this.spec || Number(this.spec) === x.KRAJ)).forEach(item => {
						if (!arr.find(x => x.NUMNUTS === item.NUMNUTS)) {
							arr.push(item);
						}
					});

					arr.sort((a, b) => a.NAZEV.localeCompare(b.NAZEV, 'cs'));
					
					if (!d.cis.backup_okresy) {
						d.cis.backup_okresy = [];
						d.cis.okresy.forEach(i => d.cis.backup_okresy.push(i));
					} 
					d.cis.okresy = arr;
				} 
				if (d.cis.kraje) {
					var arr = [];
					
					if (d.cis.backup_kraje) {
						d.cis.kraje = [];
						d.cis.backup_kraje.forEach(i => d.cis.kraje.push(i));
					} 

					d.cis.kraje.filter(x => (!this.spec || Number(this.spec) === x.KRAJ)).forEach(item => {
						if (!arr.find(x => x.NUMNUTS === item.NUMNUTS) && String(item.NUTS).length === 5) {
							arr.push(item);
						}

						if (this.spec && item.KRAJ === Number(this.spec) && item.NUTS.length === 5) {
							this.zoomValue = item.NUTS.slice(0,5);
						}
					});

					arr.sort((a, b) => a.NAZEV.localeCompare(b.NAZEV, 'cs'));
					
					if (!d.cis.backup_kraje) {
						d.cis.backup_kraje = [];
						d.cis.kraje.forEach(i => d.cis.backup_kraje.push(i));
					} 
					d.cis.kraje = arr;
				} 
			}

			return d;
			// return this.$store.getters.pdv('elections/map/cis/' + this.current.datum);
		},
		$ucast: function () {
			return this.$store.getters.pdv('elections/map/ucast/' + this.current.id + (this.spec ? ':' + this.spec : ''));
		},
		$vysledky: function () {
			return this.$store.getters.pdv('elections/map/vysledky/' + this.current.id + (this.spec ? ':' + this.spec : ''));
		},
		isReady: function () {
			return !!this.$cis && !!this.$ucast && !!this.$vysledky;
		},
		data: function () {
			if (this.isReady && this.showValue && this.showDetail) {
				var arr = [];

				// console.log(1, new Date());

				if (this.showDetail === 'obce') {

					this.$cis.cis.obce.forEach(obec => {
						if (this.townShow[obec[4]]) {
							if (!this.spec || this['$' + (this.showValue === 'ucast' ? 'ucast' : 'vysledky')].list[0].$obce.find(x => x[0] === obec[0] && x[2] === Number(this.spec))) {
								arr.push([[obec[0], obec[2][1], obec[2][0], obec[4]]]);
							}
						}
					});

					// console.log(2, new Date());
					
					if (this.showValue === 'ucast') {
						arr.forEach(item => {

							item.push(0);
							item.push(0);
							item.push(0);

							var t1 = this.$ucast.list[0].$ucast.find(x => x[0] === item[0][0]);
							var t2 = this.$ucast.list[1].$ucast.find(x => x[0] === item[0][0]);

							if (t1) {
								item[1] = pct(t1[2], t1[1], 2);
							}
							if (t2) {
								item[2] = pct(t2[2], t2[1], 2);
								item[3] = round(item[1] - item[2], 2);
							}
						})

						// console.log('3A', new Date());
					}
	
					if (this.showValue === 'nej5') {
						// arr.forEach((item, i2) => {

						// 	var t5 = [];

						// 	this.$vysledky.list[0].$vysledky.filter(x => x[0] === item[0][0]).forEach(t => {
						// 		t5.push([t[1], t[2]]);
						// 	});

						// 	t5 = t5.slice(0, 5);

						// 	console.log('3B_' + i2, new Date());

						// 	item.push(t5);
						// })

						this.$vysledky.list[0].$vysledky.forEach(vys => {

							var town = arr.find(x => vys[0] === x[0][0]);

							// console.log(vys, town);

							if (town) {

								if (town.length === 1) {
									town.push([]);
								}
	
								if (town[1].length < 5) {
									town[1].push([vys[1], vys[2]]);
								}
							}
						});

						// console.log('3B', new Date());
					}

					if (this.showValue.substring(0,2) === 'st') {

						var pty = Number(this.showValue.split('/')[1]);
						var pct2 = this.$vysledky.list[0].$vysledky.filter(x => pty === x[1]);

						pct2.forEach(item => {
							var ar = arr.find(x => item[0] === x[0][0]);

							if (ar) {
								ar.push(item[2])
							}
						});

						// arr.forEach(item => {

						// 	var pty = this.showValue.split('/')[1];
						// 	var pct = this.$vysledky.list[0].$vysledky.filter(x => x[0] === item[0][0] && Number(pty) === x[1]);
							
						// 	if (pct.length > 0) {
						// 		item.push(pct[0][2]);
						// 	}
						// })

						// console.log('3C', new Date());
					}
				}

				if (this.showDetail != 'obce') {

					if (this.showValue === 'ucast') {

						this.$cis.cis[this.showDetail].forEach(reg => {
							var obj = [reg.NUTS, 0, 0, 0];

							var o = this.$ucast.list[0]['$' + this.showDetail].find(x => x[this.showDetail === 'okresy' ? 'OKRES' : 'KRAJ'] === reg.NUTS);
							// var o = this.$ucast.list[0]['$' + this.showDetail].find(x => x[this.showDetail === 'okresy' ? 'OKRES' : 'KRAJ'] === reg.NUTS);

							if (o) {
								obj[1] = pct(o.VOLILO, o.VOLICU, 2);
	

								if (this.$ucast.list.length > 1) {
							
									var o2 = this.$ucast.list[1]['$' + this.showDetail].find(x => x[this.showDetail === 'okresy' ? 'OKRES' : 'KRAJ'] === reg.NUTS);
									// var o = this.$ucast.list[0]['$' + this.showDetail].find(x => x[this.showDetail === 'okresy' ? 'OKRES' : 'KRAJ'] === reg.NUTS);
		
									if (o2) {
										obj[2] = pct(o2.VOLILO, o2.VOLICU, 2);
										obj[3] = round(obj[1] - obj[2], 2);
									}
								}

								arr.push(obj);
							}
						});
					}
					if (this.showValue === 'nej5') {

						this.$cis.cis[this.showDetail].forEach(reg => {
							var obj = [reg.NUTS, []];

							var o = this.$vysledky.list[0]['$' + this.showDetail].filter(x => x[this.showDetail === 'okresy' ? 'OKRES' : 'KRAJ'] === reg.NUTS);
							// var o = this.$ucast.list[0]['$' + this.showDetail].find(x => x[this.showDetail === 'okresy' ? 'OKRES' : 'KRAJ'] === reg.NUTS);

							if (o.length > 0) {

								o.forEach(p => {
									obj[1].push([p.CAND, p.PROCENT]);
								})
								
							}

							obj[1].sort((a, b) => b[1] - a[1]);
							obj[1] = obj[1].slice(0, 5);

							if (obj[1].length > 0) arr.push(obj);
						});
					}
					if (this.showValue.substring(0,2) === 'st') {

						this.$cis.cis[this.showDetail].forEach(reg => {
							var obj = [reg.NUTS, 0, null, null];
							var pty = this.showValue.split('/')[1];

							var pct = this.$vysledky.list[0]['$' + this.showDetail].filter(x => x[this.showDetail === 'okresy' ? 'OKRES' : 'KRAJ'] === reg.NUTS && Number(pty) === x.CAND);

							// console.log(1, pty, reg, pct);

							if (pct.length > 0) {
								obj[1] = pct[0].PROCENT;
								arr.push(obj);
							} else {
								// obj[1] = 0;
							}

						});
					}
				}

				return arr; // this.$store.getters.json(source);
			} else {
				return [];
			}
		},
		parties: function () {
			return [];
		},
		range: function () {
			return this.getRange(this.data, this.showField)
		},
		hasTrend: function () {
			if (this.showValue != 'nej5' && this.data && this.data[0] && this.data[0][3]) {
				return true
			} else {
				return false
			}
		},
		points: function () {
			var list = [];

			var t = this.tick;

			// console.log(4, new Date());

			if (this.data && this.showDetail === 'obce') {
				this.data.forEach(town => {

					if (this.townShow[town[0][3]] === true) {
						var obj = {
							id: town[0][0],
							num: town[0][0],
							value: town[(this.showField === 4 ? 1 : this.showField)]
						}

						if (this.showValue === 'nej5') {
							if (town.length > 1) {
								obj.data = town[1];
								obj.value = obj.data[0][1];
								obj.depth = 1;
								obj.opacity = obj.value / 100 * 3 + .25;
								obj.color = '#aaa';
	
								var party = this.current.$strany.find(x => x[this.column] === obj.data[0][0]); // this.parties.find(p => p.reg === obj.data[0][0]);
		
								obj.color = colorByItem(party, {cis: this.cis}, null, true);
							} 

						} else {
							obj.depth = this.getDepth(obj.value);
							obj.opacity = this.getOpacity(obj.depth, obj.value);
							obj.color = this.getColor(obj.value);
						}

						if (this.showValue.substring(0, 2) === 'st' && this.showField === 1) {

							var party = this.current.$strany.find(x => x[this.column] === Number(this.showValue.split('/')[1])); // this.parties.find(p => p.reg === obj.data[0][0]);
	
							obj.color = colorByItem(party, {cis: this.cis}, null, true);
						}

						if (this.showValue.substring(0, 2) === 'st' && this.showField === 4) {
							var party = this.current.$vysledky.find(x => x[this.column] === Number(this.showValue.split('/')[1])); // this.parties.find(p => p.reg === obj.data[0][0]);

							obj.value = obj.value - party.PROCENT;
							obj.depth = 1;
							obj.opacity = Math.abs(obj.value) / 100 * 3 + .25;
							obj.color = this.getColor(obj.value);
						}

						obj.lng = town[0][1];
						obj.lnt = town[0][2];
						obj.size = town[0][3] + 1;

						list.push(obj);
					}
				});

			  this.alert = false;
			}

			// console.log(5, new Date());

			return list;
		},
		areas: function () {
			var list = [];

			if (this.data && (this.showDetail === 'kraje' || this.showDetail === 'okresy')) {

				this.data.forEach(area => {
					var obj = {
						id: area[0],
						nuts: area[0],
						value: area[(this.showField === 4 ? 1 : this.showField)]
					}

					if (this.showValue === 'nej5') {
						obj.data = area[1];
						obj.value = obj.data[0][1];
						obj.depth = 1;
						obj.opacity = obj.value / 100 * 3 + .25;
						obj.color = '#aaa';

						var party = this.current.$strany.find(x => x[this.column] === obj.data[0][0]); // this.parties.find(p => p.reg === obj.data[0][0]);

						obj.color = colorByItem(party, {cis: this.cis}, null, true);



						// if (party && party.color != '#aaa') {
						// 	obj.color = party.color;
						// } else if (party) {
						// 	obj.color = createColorByName(party.name || '');
						// }

					} else {
						obj.depth = this.getDepth(obj.value);
						obj.opacity = this.getOpacity(obj.depth, obj.value);
						obj.color = this.getColor(obj.value);
					}

					if (this.showValue.substring(0, 2) === 'st' && this.showField === 1) {
						// var party = this.parties.find(p => p.reg === Number(this.showValue.split('/')[1]));

						// if (party && party.color != '#aaa') {
						// 	obj.color = party.color;
						// } else if (party) {
						// 	obj.color = createColorByName(party.name || '');
						// }

						// console.log(Number(this.showValue.split('/')[1]));

						var party = this.current.$strany.find(x => x[this.column] === Number(this.showValue.split('/')[1])); // this.parties.find(p => p.reg === obj.data[0][0]);

						obj.color = colorByItem(party, {cis: this.cis}, null, true);
					}

					if (this.showValue.substring(0, 2) === 'st' && this.showField === 4) {
						var party = this.current.$vysledky.find(x => x[this.column] === Number(this.showValue.split('/')[1])); // this.parties.find(p => p.reg === obj.data[0][0]);

						obj.value = obj.value - party.PROCENT;
						obj.depth = 1;
						obj.opacity = Math.abs(obj.value) / 100 * 3 + .25;
						obj.color = this.getColor(obj.value);
					}

					if (this.zoomValue.length === 6 && this.zoomValue != obj.nuts) obj.color = '#ddd';

					if (this.zoomValue.length === 5 && this.zoomValue != obj.nuts.substring(0, 5)) obj.color = '#ddd';

					list.push(obj);
				});

				this.alert = false;
			}

			return list;
		}
	},
	methods: {
		changeTown: function (index) {
			this.townShow[index] = !this.townShow[index];
			this.$refs.info.style="left: " + 10000 + "px; top: " + 0 + "px";

			if (this.showDetail === 'obce') {
				this.alert = true;

				this.$nextTick();

				setTimeout(() => this.tick++, 100);
			} else {
				this.changeShow('obce');
			}
		},
		getRange: function (source, index) {
			var min, max, range = [];

			source.forEach((item, num) => {
				if (num === 0) {
					min = item[index];
					max = item[index];
				} else {
					if (min > item[index]) min = item[index];
					if (max < item[index]) max = item[index];
				}
			});

			for (var i = 0; i < this.colorDepth; i++) {
				range[i] = min + (max - min) / this.colorDepth * i
			}

			return {min, max, range}
		},
		getDepth: function (value) {
			for (var i = 0; i < this.colorDepth; i++) {
				if (this.range.range[i] > value) return i - 1;
			}

			return this.colorDepth - 1;
		},
		getColor: function (value) {
			if (this.showValue === 'ucast' && this.showField === 1) return 'var(--blue)';
			if ((this.showValue === 'ucast' || this.showValue.substring(0, 2) === 'st') && (this.showField === 3 || this.showField === 4)) {
				if ((value || 0) > 0) return 'var(--green)';
				if ((value || 0) < 0) return 'var(--red)';
				if (!value || value === 0) return 'var(--greyish)';
			};
		},
		getOpacity: function (depth, value) {
			if ((this.showValue === 'ucast' || this.showValue.substring(0, 2) === 'st') && this.showField === 1) return (10 - this.colorDepth + (depth || 0) + 1) / 10;
			if ((this.showValue === 'ucast' || this.showValue.substring(0, 2) === 'st') && this.showField === 3) {
				var exces = Math.abs(this.range.min) > Math.abs(this.range.max) ? Math.abs(this.range.min): Math.abs(this.range.max);
				var val = .2 + Math.abs((value || 0) / exces) * .8;

				return val;
			}
		},
		changeShow: function (value) {

			if (value === 'obce') this.alert = true;
			if (this.$refs && this.$refs.info) this.$refs.info.style="left: " + 10000 + "px; top: " + 0 + "px";

			if (this.zoomValue.length === 6 && value === 'kraje') this.zoomValue = this.zoomValue.substring(0, 5);

			this.$nextTick();

			setTimeout(() => this.showDetail = value, 100);
		},
		changeField: function (value) {

			if (this.showDetail === 'obce') this.alert = true;

			this.$nextTick();

			setTimeout(() => this.showField = value, 100);
		},
		changeValue: function (value) {
			this.$refs.modalElement2.opened = false;
			this.alert = true;

			setTimeout(() => {
				this.showValue = value;

				this.changeField(1);
	
			}, 100);
		},
		changeZoom: function (attr, item) {
			this.$refs.modalElement.opened = false;
			this.zoomValue = item.nuts;

		},
		info: function (data) {
			if (this.infoDataLast && this.infoDataLast.id === data.data.id) return;

			this.infoDataLast = data.data;

			// console.log(data.e.target.getBoundingClientRect());

			var el = data.e.target.getBoundingClientRect();
			var elholder = data.e.target.parentNode.getBoundingClientRect();

			var left = el.left - elholder.left + el.width * 1.33;
			var top = el.top - elholder.top + el.height / 1.1 - 10;

			if (left < data.e.offsetX) left = data.e.offsetX;
			if (top < data.e.offsetY) top = data.e.offsetY - 10;

			this.$refs.info.style="left: " + left + "px; top: " + top + "px";

			var name, item, arr;

			// console.log(data);

			if (data.data.nuts && data.data.nuts.length === 5 && this.showDetail === 'kraje') {
				item = this.$store.getters.getRegionByNuts(data.data.id);
				arr = this.data.find(a => a[0] === data.data.id);

				if (!item) {
					item = {
						name: 'Praha'
					}
				}
			} else if (data.data.nuts && data.data.nuts.length === 6 && this.showDetail === 'okresy') {
				item = this.$cis.cis.okresy.find(x => x.NUTS === data.data.id);
				arr = this.data.find(a => a[0] === data.data.id);

				this.infoData.name = item.NAZEV;
			} else {
				item = this.$cis.cis.obce.find(x => x[0] === data.data.id); // this.$store.getters.getTownByNumFromIndex(data.data.id);
				arr = this.data.find(a => a[0][0] === data.data.id);

				this.infoData.name = item[1];
			}

			if (!item || !arr) return;

			if (this.showValue === 'nej5') {
				while (this.infoData.top5.length > 0) this.infoData.top5.pop();

				arr[1].forEach(x => {
					this.infoData.top5.push({
						reg: x[0],
						pct: x[1]
					})
				})
			}

			if (this.showValue === 'ucast') {
				while (this.infoData.ucast.length > 0) this.infoData.ucast.pop();

				this.infoData.ucast.push({
					label: 'Účast',
					value: arr[1] + ' %'
				});

				if (arr[2]) {
					this.infoData.strana.push({
						label: '-------------------------------------',
						value: ''
					});

					this.infoData.ucast.push({
						label: 'Minule',
						value: arr[2] + ' %'
					});
				}

				if (arr[3]) {
					this.infoData.ucast.push({
						label: 'Rozdíl',
						value: arr[3] + ' b',
						class: arr[3] > 0 ? 'green' : 'red'
					});
				}
			}

			if (this.showValue.substring(0, 2) === 'st') {
				while (this.infoData.strana.length > 0) this.infoData.strana.pop();

				var party = this.current.$vysledky.find(p => p[this.column] === Number(this.showValue.split('/')[1]));

				this.infoData.strana.push({
					label: 'Výsledek zde',
					value: arr[1] + ' %'
				});

				this.infoData.strana.push({
					label: 'Výsledek celkem',
					value: party.PROCENT + ' %'
				});

				if (party) {
					this.infoData.strana.push({
						label: 'Rozdíl od výsledků',
						value: (arr[1] - party.PROCENT > 0 ? '+' : '') + (Math.round((arr[1] - party.PROCENT) * 100) / 100) + ' b',
						class: (arr[1] - party.PROCENT) > 0 ? 'green' : 'red'
					});
				}

				if (arr[2]) {
					this.infoData.strana.push({
						label: '-------------------------------------',
						value: ''
					});

					this.infoData.strana.push({
						label: 'Výsledek minule',
						value: arr[2] + ' %'
					});
				}

				if (arr[3]) {
					this.infoData.strana.push({
						label: 'Rozdíl od minule',
						value: (arr[3] > 0 ? '+' : '') + arr[3] + ' b',
						class: arr[3] > 0 ? 'green' : 'red'
					});
				}
			}
		},
		colorByItem
	},
	mounted: function () {
		this.showValue = this.show || 'nej5';
		this.showDetail = this.detail || 'okresy';
		this.zoomValue = this.zoom || 'CZ01';
		this.recalculated = Number(this.current.datum.split('-')[0]) < 2000;
	},
	watch: {
		current: function () {
			this.showValue = this.show || 'nej5';
			this.showDetail = this.detail || 'okresy';
			this.zoomValue = this.zoom || 'CZ01';
			this.recalculated = Number(this.current.datum.split('-')[0]) < 2000;
		}
	}
};
