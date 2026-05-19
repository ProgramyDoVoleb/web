import MapLeaflet from '@/components/map-leaflet/do.vue'
import { LMarker, LIcon, LTooltip } from '@vue-leaflet/vue-leaflet';
import { useRoute, useRouter } from 'vue-router'

export default {
	name: 'NewsMap',
	props: ['data'],
	data: function () {
		return {
			$router: useRouter(),
			view: 'republika'
		}
	},
	methods: {
		map_filter: function (feature, layer, ev) {
			if (this.view === 'republika') {
				return true
			} else {
				return this.data.obv && this.data.obv.obvod.find(x => x.OBVOD == feature.properties.OBVOD)
			}
			
		},
		map_style: function (feature, layer, ev) {
			if (this.view === 'republika') {
				return {
					fillOpacity: 0,
					// className: 'p-leaflet-path-all',
					stroke: 'var(--blue)',
					'stroke-width': 4
				}
			} else {
				return {
					fillOpacity: .2 + Math.random() * .8,
					fill: 'var(--blue)',
					'stroke-width': 1,
					stroke: 'var(--blue)',
					className: 'p-leaflet-path-all',
				}
			}
		},
		map_onEachFeature: function (feature, layer) {
			if (this.view === 'senat') {
				layer.addEventListener('click', (ev) => this.map_click(feature, layer, ev));
				layer.addEventListener('mouseover', (ev) => this.map_popup(feature, layer, ev));
			}		
		},
		map_click: function (feature, layer, ev) {
			if (this.view === 'republika') {
				this.$router.push('/volby/komunalni-volby/176/obec/' + feature.id);
			} else {
				this.$router.push('/volby/senatni-volby/173/obvod/' + feature.properties.OBVOD);
			}
			
		},
		map_popup: function (feature, layer, ev) {
			var content = [];
			var data = this.data.obv.obvod.find(x => x.OBVOD == feature.properties.OBVOD);

			content.push(data.OBVOD + ' - ' + data.NAZEV);

		
			this.$refs.map.popup(
				layer.getCenter(), 
				content.join(''),
				{
					autoPan: false
				}
			);
		},
		map_change: function (id) {
			this.view = id;
			this.$refs.map.load(id);
		}
	},
	components: {
		MapLeaflet, LMarker, LIcon, LTooltip
	},
	computed: {
		map_options: function () {
			// var options = {detail: 'obce'}

			// return options;

			return {detail: 'republika'};
			
		},
		
	},
	mounted: function () {
		
	}
};
