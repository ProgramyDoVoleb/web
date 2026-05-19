import MapLeaflet from '@/components/map-leaflet/do.vue'
import { LMarker, LIcon } from '@vue-leaflet/vue-leaflet';
import { useRoute, useRouter } from 'vue-router'

export default {
	name: 'NewsMap',
	props: ['data'],
	data: function () {
		return {
			$router: useRouter(),
		}
	},
	methods: {
		map_filter: function (feature, layer, ev) {
			return true
		},
		map_style: function (feature, layer, ev) {
			return {
				fillOpacity: 0,
				// className: 'p-leaflet-path-all',
				stroke: 'var(--blue)',
				'stroke-width': 4
			}
		},
		map_onEachFeature: function (feature, layer) {
			// layer.addEventListener('click', (ev) => this.map_click(feature, layer, ev));
			// layer.addEventListener('mouseover', (ev) => this.map_popup(feature, layer, ev));
		},
		map_click: function (feature, layer, ev) {
			this.$router.push('/volby/komunalni-volby/176/obec/' + feature.id);
		},
	},
	components: {
		MapLeaflet, LMarker, LIcon
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
