import { LPolyline, LMap } from '@vue-leaflet/vue-leaflet';

import MapLeaflet from '@/components/map-leaflet/do.vue'
import {useData} from '@/stores/data';
import {url, date, number, truncate, sortBy, domain, pct, unique} from '@/pdv/helpers';
import { useRoute, useRouter } from 'vue-router'

export default {
	name: 'kv-hero-map',
	props: ['district'],
	data: function () {
		return {
			width: 0,
			$router: useRouter(),
			listOfFeatures: [],
			listOfFeaturesCenter: null,
			recentered: false
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
		list: function () {
			var res = [];

			if (this.towns) {
				res = this.towns.obce.filter(x => x.OKRES == this.district);
			}

			return res;
		},
		uniques: function () {
			return unique(this.list, 'obec').map(x => String(x));
		}
	},
	methods: {
		resize: function () {
			this.width = this.$el.getBoundingClientRect().width
		},
		map_filter: function (feature, layer, ev) {
			var res = this.uniques.indexOf(feature.id) > -1;

			if (res) {

				try {
					var b = [
						Math.min(...feature.geometry.coordinates[0][1]),
						Math.min(...feature.geometry.coordinates[0][0]),
						Math.max(...feature.geometry.coordinates[0][1]),
						Math.max(...feature.geometry.coordinates[0][0]),
					]
	
					if (!isNaN(b[0]) && !isNaN(b[1]) && !isNaN(b[2]) && !isNaN(b[3])) {
						this.listOfFeatures.push(b);
					}
				} catch (e) {
					// 
				}
			};

			setTimeout(() => this.recenter(), 1000);

			return res;
		},
		map_style: function (feature, layer, ev) {

			var item = this.list.find(x => x.obec == feature.id);

			return {
				fillOpacity: item.MANDATY / 80 - .1,
				className: 'p-leaflet-path-all',
				color: 'var(--blue)'
			}
		},
		map_popup: function (feature, layer, ev) {
			var content = [];
				content.push('<a href="/volby/komunalni-volby/176/obec/' + feature.id + '">' + feature.properties.NAZEV + '</a>');

			this.$refs.map.popup(
				layer.getCenter(), 
				content.join(''),
				{
					autoPan: false
				}
			);
		},
		map_click: function (feature, layer, ev) {
			this.$router.push('/volby/komunalni-volby/176/obec/' + feature.id);
		},
		map_onEachFeature: function (feature, layer) {
			layer.addEventListener('click', (ev) => this.map_click(feature, layer, ev));
			layer.addEventListener('mouseover', (ev) => this.map_popup(feature, layer, ev));
		},
		recenter: function () {
			if (this.recentered) return;
			this.recentered = true;

			var bounds = [
				[
					Math.min(...this.listOfFeatures.map(x => x[3] )),
					Math.min(...this.listOfFeatures.map(x => x[1] ))
				],
				[
					Math.max(...this.listOfFeatures.map(x => x[2] )),
					Math.max(...this.listOfFeatures.map(x => x[0] ))				
				]				
			];

			this.listOfFeaturesCenter = bounds;

			this.$refs.map.fitBounds(bounds);
		}
	},
	mounted: function () {
		this.resize();
		window.addEventListener('resize', () => this.resize());
	}
};
