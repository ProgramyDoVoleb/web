// import MapElement from '@/components/map/do.vue';
import SearchTown from "@/components/search-town/do.vue";
import {colorByItem} from '@/pdv/helpers';
import {useData} from '@/stores/data';
import {useEnums} from '@/stores/enums';
import {indicator, number, truncate} from '@/pdv/helpers';
import { defineAsyncComponent } from 'vue';
import MapLeaflet from '@/components/map-leaflet/do.vue'
import { useNotifications } from '@/stores/notifications'
import { nextTick } from "vue";

export default {
	name: 'map-pro',
	props: ['current', 'cis', 'spec', 'column'],
	components: {
		// MapElement: defineAsyncComponent(() => import('@/components/map/do.vue')),
		SearchTown,
		MapLeaflet
	},
	data: function () {
		return {
			enums: useEnums(),
			notifications: useNotifications(),
			showDetail: undefined,
			showType: 'ucast',
			showDiff: -1,
			showParty: null,
			showRegion: null
		}
	},
	computed: {
		$store: function () {
			return useData()
		},
		$cis: function () {
			var d = this.$store.getters.pdv('elections/map-leaflet/cis/' + this.current.id + (this.spec ? ':' + this.spec : ''));
			var o = null;

			if (this.showRegion) {
				o = {cis: {obce: []}};
				d.cis.obce.filter(x => x[5] == this.showRegion).forEach(x => o.cis.obce.push(x));
			}

			return o || d;
		},
		$ucast: function () {
			var d = this.$store.getters.pdv('elections/map-leaflet/ucast/' + this.current.id + (this.spec ? ':' + this.spec : ''));
			var o = null;

			if (this.showRegion && this.$cis) {
				o = {list: [{$ucast: []}, {$ucast: []}]};
				
				d.list[0].$ucast.forEach(town => {
					if (this.$cis.cis.obce.find(x => x[0] === town[0])) {
						o.list[0].$ucast.push(town);
						if (d.list.length > 1) o.list[1].$ucast.push(d.list[1].$ucast.find(x => x[0] === town[0]));
					}
				});
			}

			return o || d;
		},
		$vysledky: function () {
			var d = this.$store.getters.pdv('elections/map-leaflet/vysledky/' + this.current.id + (this.spec ? ':' + this.spec : ''));
			var o = null;

			if (this.showRegion && this.$cis) {
				o = {list: [{$vysledky: [], $obce: []}]};
				
				d.list[0].$vysledky.forEach(town => {
					if (this.$cis.cis.obce.find(x => x[0] === town[0])) {
						o.list[0].$vysledky.push(town);
					}
				});
				
				d.list[0].$obce.forEach(town => {
					if (this.$cis.cis.obce.find(x => x[0] === town[0])) {
						o.list[0].$obce.push(town);
					}
				});
			}

			return o || d;
		},
		isReady: function () {
			return this.$cis && this.$ucast && this.$vysledky;
		},
		options: function () {
			var obj = {
				focus: this.spec, 
				detail: this.showDetail, 
				type: this.showType, 
				diff: this.showDiff,
				party: this.showParty,
				region: this.showRegion,
				zoom: 7
			}
			
			return obj;
		},
		top5: function () {
			var list = [];

			this.current.$vysledky.forEach(x => list.push(x));
			list.sort((a, b) => b.HLASU - a.HLASU);

			return list.filter(x => x.PROCENT >= 5);
		}
	},
	methods: {
		map_switch: function (detail, type, diff, party, region) {

			const notify = useNotifications();

			var note = notify.add('Aktualizuji mapu');

			this.showDetail = detail || this.showDetail;
			this.showType = type || this.showType;
			this.showDiff = diff || this.showDiff;
			this.showParty = party || null;
			this.showRegion = region || null;

			if (this.$refs.partyPicker) this.$refs.partyPicker.opened = false;
			if (this.$refs.regionPicker) this.$refs.regionPicker.opened = false;

			nextTick(() => {
				setTimeout(() => {
					notify.update(note, 'Mapa je připravena', 'green');
				},500);
			});
		},
		autoscale: function (key, obj, list) {
			var min = Math.min(...list.map(x => x[key]));
			var max = Math.max(...list.map(x => x[key]));

			// console.log(obj[key], min, max, list);

			return ((obj[key] - min) / (max - min)) * .8 + .1;
		},
		map_filter: function (feature, layer) {
			var res = false;

			if (this.isReady) {

				if (this.showDetail === 'okresy' || this.showDetail === 'kraje') {

					if (this.showType === 'ucast') {

						if (this.showDetail === 'okresy' && this.$ucast.list[0].$okresy.find(x => x.OKRES === feature.properties.NUTS4)) {

							res = true;
						}

						if (this.showDetail === 'kraje' && this.$ucast.list[0].$kraje.find(x => x.KRAJ === feature.properties.NUTS3_KOD)) {

							res = true;
						}
					}
					if (this.showType === 'top5' || this.showType === 'strana') {

						if (this.$vysledky.list[0].$okresy.find(x => x.OKRES === feature.properties.NUTS4)) {

							res = true;
						}

						if (this.$vysledky.list[0].$kraje.find(x => x.KRAJ === feature.properties.NUTS3_KOD)) {

							res = true;
						}
					}
				}
				if (this.showDetail === 'obce') {

					if (this.showType === 'ucast') {

						if (this.$ucast.list[0].$ucast.find(x => x[0] == feature.properties.KOD)) {
							res = true;
						}
					}

					if (this.showType === 'top5' || this.showType === 'strana') {

						if (this.$vysledky.list[0].$obce.find(x => x[0] == feature.properties.KOD)) {

							res = true;
						}
					}
				}
			}

			return res;
		},
		map_style: function (feature) {
			var fillOpacity = 1;
			var color = 'var(--blue)';
			var empty = false;

			if (this.isReady) {

				if (this.showDetail === 'kraje') {
					if (this.showType === 'ucast' && this.showDiff === -1) {
						var obj = this.$ucast.list[0].$kraje.find(x => x.KRAJ == feature.properties.NUTS3_KOD);

						if (obj) {
							if (obj.UCAST === 0) {
								empty = true;
							} else {
								fillOpacity = this.autoscale('UCAST', obj, this.$ucast.list[0].$kraje);
							}
						}
					}
					if (this.showType === 'ucast' && this.showDiff === 1 && this.$ucast.list[1]) {
						var curr = this.$ucast.list[0].$kraje.find(x => x.KRAJ == feature.properties.NUTS3_KOD);
						var prev = this.$ucast.list[1].$kraje.find(x => x.KRAJ == feature.properties.NUTS3_KOD);

						if (curr && prev) {
							if (curr.UCAST > prev.UCAST + .25) {
								color = 'var(--green)';
							} else if (curr.UCAST < prev.UCAST - .25) {
								color = 'var(--red)';
							} else {
								color = 'var(--blue)';
							}
							fillOpacity = Math.abs((curr.UCAST - prev.UCAST) / prev.UCAST) * 4;
							// fillOpacity = fillOpacity < .9 ? fillOpacity : .9;
						} else {
							empty = true;
						}
					}
					if (this.showType === 'top5') {
						var list = [];
						this.$vysledky.list[0].$kraje.filter(x => x.KRAJ === feature.properties.NUTS3_KOD).forEach(x => list.push(x));
						list.sort((a, b) => b.HLASU - a.HLASU);

						var obj = list[0];
						color = colorByItem(this.current.$strany.find(x => x[this.column] === obj.CAND), {cis: this.cis}, null, true);
						fillOpacity = .9;
					}
					if (this.showType === 'strana' && this.showDiff === -1) {
						var list = [];
						var obj = this.$vysledky.list[0].$kraje.find(x => x.KRAJ === feature.properties.NUTS3_KOD && x.CAND === this.showParty);

						if (obj) {
							if (obj.HLASU === 0) {
								empty = true;
							} else {
								fillOpacity = this.autoscale('PROCENT', obj, this.$vysledky.list[0].$kraje.filter(x => x.CAND === this.showParty && x.KRAJ.length === 5));
								color = colorByItem(this.current.$strany.find(x => x[this.column] === obj.CAND), {cis: this.cis}, null, true);
							}
						} else {
							empty = true;
						}
					}
					if (this.showType === 'strana' && this.showDiff === 1) {
						var curr = this.$vysledky.list[0].$kraje.find(x => x.KRAJ === feature.properties.NUTS3_KOD && x.CAND === this.showParty);
						var prev = this.current.$vysledky.find(x => x[this.column] === this.showParty);

						if (curr && prev) {
							if (curr.PROCENT > prev.PROCENT + .25) {
								color = 'var(--green)';
							} else if (curr.PROCENT < prev.PROCENT - .25) {
								color = 'var(--red)';
							} else {
								color = 'var(--blue)';
							}
							fillOpacity = Math.abs((curr.PROCENT - prev.PROCENT) / prev.PROCENT) * 4;
							// fillOpacity = fillOpacity < .9 ? fillOpacity : .9
						} else {
							empty = true;
						}
					}
				}

				if (this.showDetail === 'okresy') {
					if (this.showType === 'ucast' && this.showDiff === -1) {
						var obj = this.$ucast.list[0].$okresy.find(x => x.OKRES === feature.properties.NUTS4);

						if (obj) {
							if (obj.UCAST === 0) {
								empty = true;
							} else {
								fillOpacity = this.autoscale('UCAST', obj, this.$ucast.list[0].$okresy);
							}
						}
					}
					if (this.showType === 'ucast' && this.showDiff === 1 && this.$ucast.list[1]) {
						var curr = this.$ucast.list[0].$okresy.find(x => x.OKRES === feature.properties.NUTS4);
						var prev = this.$ucast.list[1].$okresy.find(x => x.OKRES === feature.properties.NUTS4);

						if (curr && prev) {
							if (curr.UCAST > prev.UCAST + .25) {
								color = 'var(--green)';
							} else if (curr.UCAST < prev.UCAST - .25) {
								color = 'var(--red)';
							} else {
								color = 'var(--blue)';
							}
							fillOpacity = Math.abs((curr.UCAST - prev.UCAST) / prev.UCAST) * 4;
							// fillOpacity = fillOpacity < .9 ? fillOpacity : .9
						} else {
							empty = true;
						}
					}
					if (this.showType === 'top5') {
						var list = [];
						this.$vysledky.list[0].$okresy.filter(x => x.OKRES === feature.properties.NUTS4).forEach(x => list.push(x));
						list.sort((a, b) => b.HLASU - a.HLASU);

						var obj = list[0];
						color = colorByItem(this.current.$strany.find(x => x[this.column] === obj.CAND), {cis: this.cis}, null, true);
						fillOpacity = .9;
					}
					if (this.showType === 'strana' && this.showDiff === -1) {
						var list = [];
						var obj = this.$vysledky.list[0].$okresy.find(x => x.OKRES === feature.properties.NUTS4 && x.CAND === this.showParty);

						if (obj) {
							if (obj.HLASU === 0) {
								empty = true;
							} else {
								fillOpacity = this.autoscale('PROCENT', obj, this.$vysledky.list[0].$okresy.filter(x => x.CAND === this.showParty && x.OKRES.length === 6));
								color = colorByItem(this.current.$strany.find(x => x[this.column] === obj.CAND), {cis: this.cis}, null, true);
							}
						} else {
							empty = true;
						}
					}
					if (this.showType === 'strana' && this.showDiff === 1) {
						var curr = this.$vysledky.list[0].$okresy.find(x => x.OKRES === feature.properties.NUTS4 && x.CAND === this.showParty);
						var prev = this.current.$vysledky.find(x => x[this.column] === this.showParty);

						if (curr && prev) {
							if (curr.PROCENT > prev.PROCENT + .25) {
								color = 'var(--green)';
							} else if (curr.PROCENT < prev.PROCENT - .25) {
								color = 'var(--red)';
							} else {
								color = 'var(--blue)';
							}
							fillOpacity = Math.abs((curr.PROCENT - prev.PROCENT) / prev.PROCENT) * 4;
							// fillOpacity = fillOpacity < .9 ? fillOpacity : .9
						} else {
							empty = true;
						}
					}
				}

				if (this.showDetail === 'obce') {
					if (this.showType === 'ucast' && this.showDiff === -1) {
						// if (this.current.typ === 'KZ' || this.$cis.cis.obce.find(x => x[0] == feature.properties.KOD && x[4] > 5000)) {
							
							var obj = this.$ucast.list[0].$ucast.find(x => x[0] == feature.properties.KOD);

							if (obj) {
								if (obj.UCAST === 0) {
									empty = true;
								} else {
									fillOpacity = this.autoscale(3, obj, this.$ucast.list[0].$ucast);
								}
							}
						// } else {
							// empty = true;
						// }
					}

					if (this.showType === 'ucast' && this.showDiff === 1 && this.$ucast.list[1]) {
						var curr = this.$ucast.list[0].$ucast.find(x => x[0] == feature.properties.KOD);
						var prev = this.$ucast.list[1].$ucast.find(x => x[0] == feature.properties.KOD);

						if (curr && prev) {
							if (curr[3] > prev[3] + .25) {
								color = 'var(--green)';
							} else if (curr[3] < prev[3] - .25) {
								color = 'var(--red)';
							} else {
								color = 'var(--blue)';
							}
							fillOpacity = Math.abs((curr[3] - prev[3]) / prev[3]) * 4;
							// fillOpacity = fillOpacity < .9 ? fillOpacity : .9
						} else {
							empty = true;
						}
					}
					if (this.showType === 'top5') {
						var list = [];
						this.$vysledky.list[0].$vysledky.filter(x => x[0] == feature.properties.KOD).forEach(x => list.push(x));
						list.sort((a, b) => b.HLASU - a.HLASU);

						var obj = list[0];
						color = colorByItem(this.current.$strany.find(x => x[this.column] === obj[1]), {cis: this.cis}, null, true);
						fillOpacity = .9;
					}
					if (this.showType === 'strana' && this.showDiff === -1) {
						var list = [];
						var obj = this.$vysledky.list[0].$vysledky.find(x => x[0] == feature.properties.KOD && x[1] === this.showParty);

						if (obj) {
							if (obj[2] === 0) {
								empty = true;
							} else {
								fillOpacity = this.autoscale([3], obj, this.$vysledky.list[0].$vysledky.filter(x => x[1] === this.showParty));
								color = colorByItem(this.current.$strany.find(x => x[this.column] === obj[1]), {cis: this.cis}, null, true);
							}
						} else {
							empty = true;
						}
					}
					if (this.showType === 'strana' && this.showDiff === 1) {
						var curr = this.$vysledky.list[0].$vysledky.find(x => x[0] == feature.properties.KOD && x[1] === this.showParty);
						var prev = this.current.$vysledky.find(x => x[this.column] === this.showParty);

						if (curr && prev) {
							if (curr[3] > prev.PROCENT + .25) {
								color = 'var(--green)';
							} else if (curr[3] < prev.PROCENT - .25) {
								color = 'var(--red)';
							} else {
								color = 'var(--blue)';
							}
							fillOpacity = Math.abs((curr[3] - prev.PROCENT) / prev.PROCENT) * 4;
							// fillOpacity = fillOpacity < .9 ? fillOpacity : .9
						} else {
							empty = true;
						}
					}
				}
			}

			fillOpacity = fillOpacity < .9 ? fillOpacity : .9;
			fillOpacity = fillOpacity > .2 ? fillOpacity : .2;

			return {
				fillOpacity: empty ? null : fillOpacity * .75,
				className: empty ? 'p-leaflet-path---empty' : 'p-leaflet-path',
				color: empty ? null : color
			}
		},
		map_popup: function (feature, layer, ev) {

			var content = [];
				content.push('<strong>' + (this.showDetail === 'okresy' ? 'okr. ' : '') + (feature.properties.NAZEV || feature.properties.name) + '</strong><br>');
				content.push('<hr>');
				content.push('volilo ' + number(this.fetchVolicu(feature.properties, this.showDetail)) + ' lidí<br>');
				
				if (this.$ucast.list[1] && this.$ucast.list[1].$ucast.length > 0) {
					content.push('<div class="p-offset reverse balanced"><div>' + 'účast ' + this.fetchUcast(feature.properties, this.showDetail) + ' %</div><div class="indicator ' + indicator(this.fetchUcast(feature.properties, this.showDetail), this.fetchUcast(feature.properties, this.showDetail, true)) + '">' + number(this.fetchUcast(feature.properties, this.showDetail) - this.fetchUcast(feature.properties, this.showDetail, true), 2) + ' pb</div></div>');
				} else {
					content.push('<div class="p-offset reverse balanced"><div>' + 'účast ' + this.fetchUcast(feature.properties, this.showDetail) + ' %</div></div>');
				}
				
				
				content.push('<hr>');			

			if (this.showParty && this.showType === 'strana') {

				var res = this.current.$vysledky.find(x => x[this.column] === this.showParty);
				content.push('<strong>' + this.current.$strany.find(x => x[this.column] === this.showParty).NAZEV + '</strong><br>');

				var list = this.fetchParty(feature.properties, this.showDetail, this.showParty);
				content.push('<div class="p-offset reverse balanced"><div>dílčí výsledek</div><div>' + number((list[0] || {pct: 0}).pct, 2) + ' %</div></div>');

				content.push('<div class="p-offset reverse balanced"><div>celkově</div><div>' + res.PROCENT + ' %</div></div>');
				content.push('<div class="p-offset reverse balanced"><div>rozdíl</div><div class="indicator ' + indicator((list[0] || {pct: 0}).pct, res.PROCENT) + '">' + number((list[0] || {pct: 0}).pct - res.PROCENT, 2) + ' pb</div></div>');
			} else {
				this.fetchTop5(feature.properties, this.showDetail).forEach(party => {
					content.push('<div class="p-offset reverse balanced"><div>' + truncate(party.name, 16, true) + '</div><div>' + number(party.pct, 2) + ' %</div></div>');
				});
			}

			this.$refs.map.popup(
				layer.getCenter(), 
				content.join(''),
				{
					autoPan: false
				}
			);
		},
		map_onEachFeature: function (feature, layer) {
			layer.addEventListener('click', (ev) => this.map_popup(feature, layer, ev));
			layer.addEventListener('mouseover', (ev) => this.map_popup(feature, layer, ev));
		},
		fetchVolicu: function (props, detail) {
			switch (detail) {
				case 'kraje': {
					return this.$ucast.list[0].$kraje.find(x => x.KRAJ == props.NUTS3_KOD).VOLILO;
				}
				case 'okresy': {
					return this.$ucast.list[0].$okresy.find(x => x.OKRES == props.NUTS4).VOLILO;
				}
				case 'obce': {
					return this.$ucast.list[0].$ucast.find(x => x[0] == props.KOD)[2];
				}
			}
			return 0;
		},
		fetchUcast: function (props, detail, prev) {
			switch (detail) {
				case 'kraje': {
					return this.$ucast.list[prev ? 1 : 0].$kraje.find(x => x.KRAJ == props.NUTS3_KOD).UCAST;
				}
				case 'okresy': {
					return this.$ucast.list[prev ? 1 : 0].$okresy.find(x => x.OKRES == props.NUTS4).UCAST;
				}
				case 'obce': {
					return this.$ucast.list[prev ? 1 : 0].$ucast.find(x => x[0] == props.KOD)[3];
				}
			}
			return 0;
		},
		fetchTop5: function (props, detail) {
			var list = [];

			switch (detail) {
				case 'kraje': {
					this.$vysledky.list[0].$kraje.filter(x => x.KRAJ === props.NUTS3_KOD).forEach(x => list.push(x));
					break;
				}
				case 'okresy': {
					this.$vysledky.list[0].$okresy.filter(x => x.OKRES === props.NUTS4).forEach(x => list.push(x));
					break;
				}
				case 'obce': {
					this.$vysledky.list[0].$vysledky.filter(x => x[0] == props.KOD).forEach(x => list.push(x));
					break;
				}
			}

			list.sort((a, b) => b.HLASU - a.HLASU);

			var arr = [];

			list.splice(0, 5).forEach(party => {
				var party_id = party.CAND || party[1];
				var party_name = this.current.$strany.find(x => x[this.column] === party_id).ZKRATKA;	

				arr.push({
					name: party_name,
					pct: party.PROCENT || party[3]
				})
			});

			return arr;
		},
		fetchParty: function (props, detail, party) {
			var list = [];

			switch (detail) {
				case 'kraje': {
					this.$vysledky.list[0].$kraje.filter(x => x.KRAJ === props.NUTS3_KOD && x.CAND == party).forEach(x => list.push(x));
					break;
				}
				case 'okresy': {
					this.$vysledky.list[0].$okresy.filter(x => x.OKRES === props.NUTS4 && x.CAND == party).forEach(x => list.push(x));
					break;
				}
				case 'obce': {
					this.$vysledky.list[0].$vysledky.filter(x => x[0] == props.KOD && x[1] == party).forEach(x => list.push(x));
					break;
				}
			}

			list.sort((a, b) => b.HLASU - a.HLASU);

			var arr = [];

			list.splice(0, 5).forEach(party => {
				var party_id = party.CAND || party[1];
				var party_name = this.current.$strany.find(x => x[this.column] === party_id).ZKRATKA;	

				arr.push({
					name: party_name,
					pct: party.PROCENT || party[3]
				})
			});

			return arr;
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
