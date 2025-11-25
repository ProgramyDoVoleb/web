import {number, round, sortBy, lang} from '@/pdv/helpers';
import {colorByItem} from '@/components/results/helpers';
import { useEnums } from '@/stores/enums';
import MapLeaflet from '@/components/map-leaflet/do.vue'

import {useData} from '@/stores/data';

export default {
	name: 'OkrskyStats',
	props: ['elections', 'party', 'cand', 'volkraj'],
	data: function () {
		return {
			subset: {
				candidates: [1],
				towns: [],
				showResults: true,
				showCandidates: true
			},
			showCandidatesOrder: false,
			showTownsOrder: false,
			showMap: true,
			showTable: false,
			showRelative: true,
			ready: false,
			highlight: null
		}
	},
	components: {
		MapLeaflet
	},
	computed: {
		$store: function () {
			return useData()
		},
		data: function () {
			var d = this.$store.getters.pdv('elections/specific/' + this.elections.id + '/okrsky/' + this.party.id + (this.volkraj ? ':' + this.volkraj : ''));

			if (d) {
				this.ready = true;
			}

			return d;
		},
		sums: function () {
			var list = [];
			for (var i = 0; i < 70; i++) {
				list.push({id: i + 1, sum: 0});
			}

			this.data.list.forEach(y => {
				if ((this.subset.towns.length === 0 || this.subset.towns.indexOf(y[5]) > -1) && y[0] > 0) {
					y.forEach((x, i) => {
						if (i > 10 && i < 80) {
							list[i - 11].sum += x;
						}
					})
				}
			});

			// var res = list.sort((a, b) => b.sum - a.sum);
			// res = res.splice(0, 10);

			return list;
		},
		candadatesOrder: function () {
			var list = [];
			
			this.data.candidates.filter(x => this.subset.candidates.length === 0 ? true : this.subset.candidates.indexOf(x.PORCISLO) > -1).forEach(x => list.push(x))

			if (this.showCandidatesOrder) {
				list.sort((a, b) => b.POCHLASU - a.POCHLASU);
			}

			return list;
		},
		townsOrder: function () {
			var list = [];
			
			this.data.cis.obce.filter(x => this.subset.towns.length === 0 ? true : this.subset.towns.indexOf(x.obec) > -1).forEach(x => list.push(x))

			if (this.showTownsOrder) {
				list.sort((a, b) => (b.$data.results.find(x => x.KSTRANA === this.party.KSTRANA) ? b.$data.results.find(x => x.KSTRANA === this.party.KSTRANA).HLASU : 0) - (a.$data.results.find(x => x.KSTRANA === this.party.KSTRANA) ? a.$data.results.find(x => x.KSTRANA === this.party.KSTRANA).HLASU : 0));
			}

			return list;
		},
		townsOrderCenter: function () {
			var minX = 15;
			var maxX = 15;
			var minY = 50;
			var maxY = 50;

			if (this.townsOrder) {
				minX = Math.min(...this.townsOrder.map(x => x.$data.gps[1]));
				maxX = Math.max(...this.townsOrder.map(x => x.$data.gps[1]));
				minY = Math.min(...this.townsOrder.map(x => x.$data.gps[0]));
				maxY = Math.max(...this.townsOrder.map(x => x.$data.gps[0]));

				// console.log('obce');
			} else {
				// console.log('záloha');
			}
			
			// console.log(this.townsOrder.map(x => x.$data.gps[1]), maxX, minY, maxY);

			return [
				round(minY + (maxY - minY) / 2, 2),
				round(minX + (maxX - minX) / 2, 2)
			]
		},
		townsOrderResults: function () {
			var list = [], min, max;

			this.townsOrder.forEach(town => {
				var obj = {
					obec: town.obec,
					gps: town.$data.gps,
					NAZEV: town.NAZEVOBCE,
					PROCENT: (town.$data.results.find(x => x.KSTRANA === this.party.KSTRANA) || {PROCENT: 0}).PROCENT,
					HLASU: (town.$data.results.find(x => x.KSTRANA === this.party.KSTRANA) || {PROCENT: 0}).HLASU,
					UCAST: town.$data.attendance.UCAST,
					PLATNYCH: town.$data.attendance.PLATNYCH,
					level: 0
				}

				list.push(obj);
			})

			if (this.showRelative === true) {

				min = Math.min(...list.map(x => x.PROCENT));
				max = Math.max(...list.map(x => x.PROCENT));
	
				if (this.highlight) {
					min = Math.min(...list.map(x => this.fetch(x.obec, this.highlight, 0) / (x.HLASU || 1)));
					max = Math.max(...list.map(x => this.fetch(x.obec, this.highlight, 0) / (x.HLASU || 1)));
				}
	
				list.forEach(town => {
					if (this.highlight) {
						var f = this.fetch(town.obec, (this.highlight), 0);
	
						town.level = f > 0 ? (Math.round((((f * 2 / (town.HLASU || 0)) - min) / (max - min)) * 99)) + 1 : 0;
					} else {
						town.level = town.PROCENT > 0 ? (Math.round(((town.PROCENT - min) / (max - min)) * 99) + 1) : 0;
					}				
				})
			} else {

				min = Math.min(...list.map(x => (x.HLASU || 0)));
				max = Math.max(...list.map(x => (x.HLASU || 0)));
	
				if (this.highlight) {
					min = Math.min(...list.map(x => this.fetch(x.obec, this.highlight, 0)));
					max = Math.max(...list.map(x => this.fetch(x.obec, this.highlight, 0)));
				}
	
				list.forEach(town => {
					if (this.highlight) {
						var f = this.fetch(town.obec, (this.highlight), 0);
	
						town.level = f > 0 ? (Math.round(((f - min) / (max - min)) * 99)) + 1 : 0;
					} else {
						town.level = (town.HLASU || 0) > 0 ? (Math.round((((town.HLASU || 0) - min) / (max - min)) * 99) + 1) : 0;
					}				
				})
			}

			return list;
		}
	},
	methods: {
		fetch: function (town, cand, fallback) {
			return this.data.list.reduce((a, b) => {
				if (b[5] === town) {
					return a + b[10 + cand]
				} else {
					return a;
				}
			}, 0) || (typeof fallback != 'undefined' ? fallback : '·')
		},
		toggle_candidate: function (id) {
			if (this.subset.candidates.indexOf(id) > -1) {
				this.subset.candidates.splice(this.subset.candidates.indexOf(id), 1);
			} else {
				this.subset.candidates.push(id);
			}
		},
		toggle_towns: function (id) {
			if (this.subset.towns.indexOf(id) > -1) {
				this.subset.towns.splice(this.subset.towns.indexOf(id), 1);
			} else {
				this.subset.towns.push(id);
			}
		},
		towns_top10: function (list) {
			this.subset.towns = [];

			var arr = [];
			(list || this.data).cis.obce.forEach(x => arr.push(x)) 
			
			arr.sort((a, b) => (b.$data.results.find(x => x.KSTRANA === this.party.KSTRANA) || {HLASU: 0}).HLASU - (a.$data.results.find(x => x.KSTRANA === this.party.KSTRANA) || {HLASU: 0}).HLASU);
			arr = arr.splice(0,10);

			this.subset.towns = arr.map(x => x.obec);
		},
		towns_top10_pct: function (list) {
			this.subset.towns = [];

			var arr = [];
			(list || this.data).cis.obce.forEach(x => arr.push(x)) 
			
			arr.sort((a, b) => (b.$data.results.find(x => x.KSTRANA === this.party.KSTRANA) || {PROCENT: 0}).PROCENT - (a.$data.results.find(x => x.KSTRANA === this.party.KSTRANA) || {PROCENT: 0}).PROCENT);
			arr = arr.splice(0,10);

			this.subset.towns = arr.map(x => x.obec);
		},
		towns_top10_total: function (list) {
			this.subset.towns = [];

			var arr = [];
			(list || this.data).cis.obce.forEach(x => arr.push(x)) 
			
			arr.sort((a, b) => (b.$data.attendance.PLATNYCH - a.$data.attendance.PLATNYCH));
			arr = arr.splice(0,10);

			this.subset.towns = arr.map(x => x.obec);
		},
		towns_min100: function () {
			this.subset.towns = this.data.cis.obce.filter(x => (x.$data.results.find(y => y.KSTRANA === this.party.KSTRANA) || {HLASU: 0}).HLASU > 99).map(x => x.obec);
		},
		towns_byDistrict: function (district) {
			this.subset.towns = this.data.cis.obce.filter(x => x.OKRES === district).map(x => x.obec);
		},
		towns_all: function () {
			this.subset.towns = [];
		},
		cand_top10: function () {
			this.subset.candidates = [1,2,3,4,5,6,7,8,9,10];
		},
		cand_nej10: function () {
			var list = [];
			for (var i = 0; i < 70; i++) {
				list.push({id: i + 1, sum: 0});
			}

			this.data.list.forEach(y => {
				y.forEach((x, i) => {
					if (i > 10 && i < 80) {
						list[i - 11].sum += x;
					}
				})
			});

			var res = list.sort((a, b) => b.sum - a.sum);
			res = res.splice(0, 10);

			this.subset.candidates = res.map(x => x.id);
		},
		cand_nej10_areaLimit: function () {
			var list = [];
			for (var i = 0; i < 70; i++) {
				list.push({id: i + 1, sum: 0});
			}

			this.data.list.forEach(y => {
				if (this.subset.towns.length === 0 || this.subset.towns.indexOf(y[5]) > -1) {
					y.forEach((x, i) => {
						if (i > 10 && i < 80) {
							list[i - 11].sum += x;
						}
					})
				}
			});

			var res = list.sort((a, b) => b.sum - a.sum);
			res = res.splice(0, 10);

			this.subset.candidates = res.map(x => x.id);
		},
		cand_min1000: function () {
			this.subset.candidates = this.data.candidates.filter(x => x.POCHLASU > 999).map(x => x.PORCISLO);
		},
		cand_min200: function () {
			this.subset.candidates = this.data.candidates.filter(x => x.POCHLASU > 199).map(x => x.PORCISLO);
		},
		cand_success: function () {
			this.subset.candidates = this.data.candidates.filter(x => x.MANDAT === 'A').map(x => x.PORCISLO)
		},
		cand_subs: function () {
			this.subset.candidates = this.data.candidates.filter(x => x.MANDAT === 'N' && x.PORADINAHR > 0 && x.PORADINAHR < 6).map(x => x.PORCISLO)
		},
		cand_subs_top: function () {
			this.subset.candidates = [];

			var list = [];
			this.data.candidates.filter(x => x.MANDAT === 'N').forEach(x => list.push(x));

			list.sort((a, b) => b.POCHLASU - a.POCHLASU);

			this.subset.candidates = list.splice(0, 5).map(x => x.PORCISLO)
		},
		cand_all: function () {
			this.subset.candidates = [];
		},
		cand_highlight: function (id) {
			this.highlight = id;

			if (id) {
				var t = this.subset.towns;
				this.subset.towns = [0];

				setTimeout(() => this.subset.towns = t, 10);

				this.showMap = true;
				this.showTable = false;
			} 
		},
		map_filter: function (feature, layer) {
			return this.townsOrderResults.find(x => x.obec === Number(feature.id));
		},
		map_style: function (feature) {
			return {
				fillOpacity: this.townsOrderResults.find(x => x.obec === Number(feature.id)).level > 0 ? this.townsOrderResults.find(x => x.obec === Number(feature.id)).level / 100 : .15,
				className: this.townsOrderResults.find(x => x.obec === Number(feature.id)).level > 0 ? 'p-leaflet-path' : 'p-leaflet-path---empty',
				color: 'var(--blue)'
			}
		},
		map_popup: function (feature, layer, ev) {
			var town = this.townsOrderResults.find(x => x.obec === Number(feature.id));
			var party = this.party;
			var cand = this.data.candidates.find(x => x.PORCISLO === (this.highlight));

			this.$refs.map.popup(
				layer.getCenter(), 
				'<strong>' + town.NAZEV + '</strong>' + (town.UCAST ? '<br>Účast: ' + town.UCAST + '%' : '<br>Souhrnně za celé město') + '<br>Hlasů celkem: ' + number(town.PLATNYCH) + '<hr><strong>' + party.NAZEV + '</strong><br>' + number(town.HLASU) + ' hlasů<br>' + town.PROCENT + ' %' + (this.highlight ? '<hr><strong>' + cand.JMENO + ' ' + cand.PRIJMENI + '</strong><br>' + lang((this.fetch(town.obec, this.highlight, 0)), ['žádný přednostní hlas', '1 přednosní hlas', '%% přednostní hlasy', '%% přednostních hlasů']) : ''),
				{
					autoPan: false
				}
			);
		},
		map_onEachFeature: function (feature, layer) {
			layer.addEventListener('click', (ev) => this.map_popup(feature, layer, ev));
			layer.addEventListener('mouseover', (ev) => this.map_popup(feature, layer, ev));
		},
		map_display_type: function (relative) {
			this.showRelative = relative;

			var t = this.subset.towns;
			this.subset.towns = [0];

			setTimeout(() => this.subset.towns = t, 10);

			this.showMap = true;
		}
	},
	mounted: function () {
	},
	watch: {
		ready: function () {
			if (this.cand) {
				this.subset.candidates = [this.cand.PORCISLO]
				this.towns_all();
				this.showRelative = true;
				this.showTable = false;
				this.showMap = true;
				this.highlight = this.cand.PORCISLO;
			} else {
				
					if (this.data.candidates.find(x => x.MANDAT === 'A')) {
						this.cand_success();
					} else {
						this.cand_top10();
					}	

					this.towns_all();
					this.showRelative = true;
					this.showTable = false;
					this.showMap = true;
				
			}
			
		}
	}
};
