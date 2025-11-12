import MapLeaflet from '@/components/map-leaflet/do.vue'
import {useData} from '@/stores/data';
import {url, date, number, truncate, sortBy, domain, pct, unique} from '@/pdv/helpers';
import { useRoute, useRouter } from 'vue-router'

export default {
	name: 'kv-hero-map',
	props: ['district', 'options'],
	data: function () {
		return {
			width: 0,
			all: -1,
			mapClass: null,
			$router: useRouter()
		}
	},
	components: {
		MapLeaflet
	},
	computed: {
		$store: function () {
			return useData()
		},
		towns: function () {
			var d = this.$store.getters.pdv('elections/specific/176/towns');

			if (d) {
				// 
			}

			return d;
		},
		map_options: function () {
			
				return this.all === -1 ? {detail: 'okresy', zoom: this.width > 1024 ? 8 : 7} : {detail: 'obce', geojson: this.options ? this.options.geojson : null}
			
		},
		list: function () {
			var res = [];

			if (this.towns) {
				res = this.towns.obce.filter(x => x.OKRES == this.all);
			}

			return res;
		},
		uniques: function () {
			return unique(this.list, 'obec').map(x => String(x));
		}
	},
	methods: {
		resize: function () {
			this.width = this.$el.getBoundingClientRect().width;
			this.$nextTick(() => {
				setTimeout(() => {
					if (this.$refs.map) this.$refs.map.invalidateSize();
				}, 250);
			})
		},
		resizeMap: function (c) {
			this.mapClass = c;
			this.resize();
		},
		map_style: function (feature, layer, ev) {
			if (this.all === -1) {
				return {
					fillOpacity: ['CZ0100', 'CZ0323', 'CZ0642', 'CZ0806'].indexOf(feature.properties.NUTS4) > -1 ? null : Math.random() / 4 + 0.1,
					className: ['CZ0100', 'CZ0323', 'CZ0642', 'CZ0806'].indexOf(feature.properties.NUTS4) > -1 ? 'p-leaflet-path-main' : 'p-leaflet-path-all',
				}
			} else {
				var item = this.list.find(x => x.obec == feature.id && x.OKRES == this.all);

				if (item) {
					return {
						fillOpacity: ((item || {}).MANDATY || 0) / 80 - .1,
						className: 'p-leaflet-path-all',
						color: item ? 'var(--blue)' : 'var(--red)'
					}
				}
			}
		},
		map_filter: function (feature, layer, ev) {
			if (this.all === -1) {
				return true;
			} else {
				return this.uniques.indexOf(feature.id) > -1;		
			}
		},
		map_popup: function (feature, layer, ev) {
			var content = [];

			if (this.all === -1 && this.width > 1024 && this.mapClass != '_map-mid') {
				content.push('<strong>okres ' + feature.properties.name + '</strong>');
				content.push('<div class="p-line"></div>');
				content.push('<div class="p-list smaller">');

				var list = this.towns.obce.filter(x => x.OKRES === this.towns.okresy.find(y => y.NUTS === feature.properties.NUTS4).NUMNUTS);

				if (feature.properties.NUTS4 === 'CZ0100') {
					content.push('<div class="strong"><a href="/volby/komunalni-volby/176/obec/554782">Praha</a></div>');

					list = this.towns.obce.filter(x => x.OKRES === 1100);
				}

				if (list.find(x => x.DRUHZASTUP === 3)) {
					content.push('<div>');
				}

				[3].forEach(type => {
					if (list.find(x => x.DRUHZASTUP === type)) {
						content.push('<div class="columns-2 strong">');
						sortBy(list.filter(x => x.DRUHZASTUP === type), 'NAZEVZAST', null, true).forEach(town => {
							content.push('<div><a href="/volby/komunalni-volby/176/obec/' + town.obec + '">' + town.NAZEVZAST + '</a></div>')
						});
						content.push('</div>');
					}
				});

				[5].forEach(type => {
					if (list.find(x => x.DRUHZASTUP === type)) {
						content.push('<div class="mapleaflet-popup-list">Části: ');
						sortBy(list.filter(x => x.DRUHZASTUP === type), 'NAZEVZAST', null, true).forEach(town => {
							content.push('<span><a class="keep" href="/volby/komunalni-volby/176/obec/' + town.obec + '">' + (town.NAZEVZAST.includes('-') && !town.NAZEVZAST.includes('Plzeň') ? town.NAZEVZAST.split('-')[1] : town.NAZEVZAST) + '</a></span>')
						});
						content.push('</div>');
					}
				});

				if (list.find(x => x.DRUHZASTUP === 3)) {
					content.push('</div>');
				}

				// if (list.filter(x => x.DRUHZASTUP === 5).length > 0) {
				// 	content.push('<div>' + list.filter(x => x.DRUHZASTUP === 5).length + ' městských částí</div>');
				// }

				[2].forEach(type => {
					if (list.find(x => x.DRUHZASTUP === type)) {
						content.push('<div>');
						content.push('<div class="smallest strong mb05">Města</div>');
						content.push('<div class="columns-2">');
						sortBy(list.filter(x => x.DRUHZASTUP === type), 'NAZEVZAST', null, true).forEach(town => {
							content.push('<div><a href="/volby/komunalni-volby/176/obec/' + town.obec + '">' + town.NAZEVZAST + '</a></div>')
						});
						content.push('</div>');
						content.push('</div>');
					}
				});

				if (list.find(x => x.DRUHZASTUP === 6 || (x.DRUHZASTUP === 1 && x.MANDATY > 14))) {
					content.push('<div>');
					content.push('<div class="smallest strong mb05">Další větší obce</div>');
					content.push('<div class="mapleaflet-popup-list">');
					sortBy(list.filter(x => x.DRUHZASTUP === 6 || (x.DRUHZASTUP === 1 && x.MANDATY > 14)), 'NAZEVZAST', null, true).forEach(town => {
						content.push('<span><a class="keep" href="/volby/komunalni-volby/176/obec/' + town.obec + '">' + (town.NAZEVZAST.includes('-') && !town.NAZEVZAST.includes('Plzeň') ? town.NAZEVZAST.split('-')[1] : town.NAZEVZAST) + '</a></span>')
					});
					content.push('</div>');
					content.push('</div>');
				}

				content.push('<div class="p-offset reverse">');
				if (list.filter(x => x.DRUHZASTUP === 1 && x.MANDATY < 15).length > 0) {
					content.push('<div>' + list.filter(x => x.DRUHZASTUP === 1 && x.MANDATY < 15).length + ' dalších obcí</div>');
				}
				content.push('<div><a href="/volby/komunalni-volby/176/okres/' + list[0].OKRES + '" class="strong">Přehledně o okresu</a></div>')
				content.push('</div>');
				content.push('</div>');

			} else if (this.all === -1) {
				var list = this.towns.obce.filter(x => x.OKRES === this.towns.okresy.find(y => y.NUTS === feature.properties.NUTS4).NUMNUTS);
				content.push('<div class="smaller"><a href="/volby/komunalni-volby/176/okres/' + list[0].OKRES + '" class="strong">okres ' + feature.properties.name + '</a></div>')
			} else {
				content.push('<a href="/volby/komunalni-volby/176/obec/' + feature.id + '" class="strong">' + feature.properties.NAZEV + '</a>');
				
				var obj = this.towns.obce.find(x => x.obec == feature.id);

				if (obj) {
					content.push('<div class="smallest dimm mt05">Volí ' + obj.MANDATY + ' zastupitelů</div>');

					if (this.towns.obce.find(x => x.NADRZASTUP == feature.id)) {
						content.push('<div class="p-line"></div>');
						content.push('<div class="mapleaflet-popup-list smaller">Části: ');
						sortBy(this.towns.obce.filter(x => x.NADRZASTUP == feature.id), 'NAZEVZAST', null, true).forEach(town => {
							content.push('<span><a class="keep" href="/volby/komunalni-volby/176/obec/' + town.obec + '">' + (town.NAZEVZAST.includes('-') && !town.NAZEVZAST.includes('Plzeň') ? town.NAZEVZAST.split('-')[1] : town.NAZEVZAST) + '</a></span>')
						});
						content.push('</div>');
					}
				}
			}

			this.$refs.map.popup(
				layer.getCenter(), 
				content.join(''),
				{
					autoPan: false
				}
			);
		},
		map_click: function (feature, layer, ev) {
			if (this.all === -1 && feature.properties.NUTS4 === 'CZ0100') {
				this.$router.push('/volby/komunalni-volby/176/okres/1100');
			} else if (this.all === -1) {
				this.all = this.towns.okresy.find(x => x.NUTS === feature.properties.NUTS4).NUMNUTS;	
				this.$refs.map.fitBounds(layer._bounds);
				this.$refs.map.load('obce', true);
			} else {
				this.$router.push('/volby/komunalni-volby/176/obec/' + feature.id);
			}
			
		},
		map_onEachFeature: function (feature, layer) {
			layer.addEventListener('click', (ev) => this.map_click(feature, layer, ev));
			layer.addEventListener('mouseover', (ev) => this.map_popup(feature, layer, ev));
		},
		map_reset: function () {
			this.all = -1;
			this.$refs.map.load('okresy');
		}
	},
	mounted: function () {

		if (this.options && this.district) {
			this.all = this.district;	
		}

		this.resize();
		window.addEventListener('resize', () => this.resize());
	}
};
