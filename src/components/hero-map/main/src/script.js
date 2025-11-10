import MapLeaflet from '@/components/map-leaflet/do.vue'
import {useData} from '@/stores/data';
import {url, date, number, truncate, sortBy, domain, pct, unique} from '@/pdv/helpers';
import { useRoute, useRouter } from 'vue-router'

export default {
	name: 'kv-hero-map',
	props: [],
	data: function () {
		return {
			width: 0,
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
		}
	},
	methods: {
		resize: function () {
			this.width = this.$el.getBoundingClientRect().width
		},
		map_style: function (feature, layer, ev) {
			return {
				className: ['CZ0100', 'CZ0323', 'CZ0642', 'CZ0806'].indexOf(feature.properties.NUTS4) > -1 ? 'p-leaflet-path-main' : 'p-leaflet-path-all',
			}
		},
		map_popup: function (feature, layer, ev) {
			var content = [];
				content.push('okres ' + feature.properties.name);
				content.push('<div class="p-line"></div>');
				content.push('<div class="p-list smaller">');

				var list = this.towns.obce.filter(x => x.OKRES === this.towns.okresy.find(y => y.NUTS === feature.properties.NUTS4).NUMNUTS);

				if (feature.properties.NUTS4 === 'CZ0100') {
					content.push('<div class="strong"><a href="/volby/komunalni-volby/176/obec/554782">Praha</a></div>');

					list = this.towns.obce.filter(x => x.OKRES === 1100);
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

				if (list.filter(x => x.DRUHZASTUP === 5).length > 0) {
					content.push('<div>' + list.filter(x => x.DRUHZASTUP === 5).length + ' městských částí</div>');
				}

				[2,6].forEach(type => {
					if (list.find(x => x.DRUHZASTUP === type)) {
						content.push('<div class="columns-2">');
						sortBy(list.filter(x => x.DRUHZASTUP === type), 'NAZEVZAST', null, true).forEach(town => {
							content.push('<div><a href="/volby/komunalni-volby/176/obec/' + town.obec + '">' + town.NAZEVZAST + '</a></div>')
						});
						content.push('</div>');
					}
				});

				if (list.filter(x => x.DRUHZASTUP === 1).length > 0) {
					content.push('<div>' + list.filter(x => x.DRUHZASTUP === 1).length + ' dalších obcí</div>');
				}

				content.push('</div>');

			this.$refs.map.popup(
				layer.getCenter(), 
				content.join(''),
				{
					autoPan: false
				}
			);
		},
		map_click: function (feature, layer, ev) {
			this.$router.push('/volby/komunalni-volby/176/okres/' + (this.towns.okresy.find(y => y.NUTS === feature.properties.NUTS4) || {NUMNUTS: 1100}).NUMNUTS);
		},
		map_onEachFeature: function (feature, layer) {
			layer.addEventListener('click', (ev) => this.map_click(feature, layer, ev));
			layer.addEventListener('mouseover', (ev) => this.map_popup(feature, layer, ev));
			layer.addEventListener('wheel', (ev) => ev.preventDefault());
		},
	},
	mounted: function () {
		this.resize();
		window.addEventListener('resize', () => this.resize());
	}
};
