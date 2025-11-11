import { LMap, LTileLayer, LMarker, LPopup, LGeoJson } from '@vue-leaflet/vue-leaflet';

export default {
	name: 'map-leaflet',
	props: ['options', 'map_filter', 'map_style', 'map_onEachFeature'],
	components: {
		LMap, LTileLayer, LMarker, LPopup, LGeoJson
	},
	data: function () {
		return {
			center: [50, 15],
			zoom: 7,
			geojson: null,
			listOfGeoJSON: {
				selected: 'republika',
				list: {
					republika: 'https://data.gov.cz/p%C5%99%C3%ADlohy/%C4%8Dl%C3%A1nky/kartogram-choropleth/data/cr-simple.json',
					kraje: 'https://data.gov.cz/p%C5%99%C3%ADlohy/%C4%8Dl%C3%A1nky/kartogram-choropleth/data/kraje-simple.json',
					okresy: 'https://static.programydovoleb.cz/2024/distictsCzechiaLow.json',
					// orp: 'https://data.gov.cz/p%C5%99%C3%ADlohy/%C4%8Dl%C3%A1nky/kartogram-choropleth/data/orp-simple.json',
					regiony: 'https://data.gov.cz/p%C5%99%C3%ADlohy/%C4%8Dl%C3%A1nky/kartogram-choropleth/data/regiony_soudrznosti-simple.json',
					obce: 'https://data.gov.cz/p%C5%99%C3%ADlohy/%C4%8Dl%C3%A1nky/kartogram-choropleth/data/obce-simple.json',
					okrsky: 'https://static.programydovoleb.cz/2025/vol_okrsky_2025_g100_20250701.geojson',
					senat: 'https://www.volby.cz/opendata/se2025leden/geo/VO_Senat_2022g300.geojson'
				}
			}
		}
	},
	computed: {
		$store: function () {
			return useData()
		}
	},
	methods: {
		centerAfterLoad: function () {
			if (this.$refs.map && this.$refs.map.leafletObject) {
				this.$refs.map.leafletObject.setView(this.options.center || this.center, this.options.zoom || this.zoom);
			} else {
				setTimeout(() => {
					this.centerAfterLoad();
				}, 1000);
			}
		},
		load: async function (id, skipCenter) {

			if (this.$refs.geojson) {
				console.log(this.$refs.geojson);
			}

			this.listOfGeoJSON.selected = id || this.listOfGeoJSON.selected;

			const response = await fetch(this.listOfGeoJSON.list[this.listOfGeoJSON.selected]);
			this.geojson = await response.json();
			
			if (!skipCenter) this.centerAfterLoad();
		},
		processOptions: function () {
			this.load(this.options.detail);
		},
		popup: function (markerLatLng, content, options) {

			var _options = options || {};
				_options.className = "p-leaflet-map-popup";

			this.$refs.map.leafletObject.openPopup(
				content,
				markerLatLng,
				_options
			)
		},
		fitBounds: function (list) {
			this.$refs.map.leafletObject.fitBounds(list);
		},
		setView: function (center, zoom) {
			this.$refs.map.leafletObject.setView(center, zoom);
		}
	},
	mounted: function () {
		setTimeout(() => this.processOptions(), 100);
	},
	watch: {
		options: function () {
			setTimeout(() => this.processOptions(), 100);
		}
	}
};
