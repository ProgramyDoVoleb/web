	import { LMap, LTileLayer, LMarker, LPopup, LGeoJson } from '@vue-leaflet/vue-leaflet';
import { useNotifications } from '@/stores/notifications'

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
		load: async function (id, skipCenter, prefilter) {

			if (this.listOfGeoJSON.selected === id) return;

			this.listOfGeoJSON.selected = id || this.listOfGeoJSON.selected;

			if (this.options && this.options.geojson) {
				this.geojson = this.options.geojson;
			} else {

				const notify = useNotifications();
				var note = notify.add('Načítám mapu');
	
				const response = await fetch(this.listOfGeoJSON.list[this.listOfGeoJSON.selected]);
				const data = await response.json();
	
				if (this.prefilter) {
					var obj = {
						type: "FeatureCollection",
						features: []
					}
	
					data.features.filter(x => x.properties[this.prefilter.key] == this.prefilter.val).forEach(x => obj.features.push(x));
	
					this.geojson = obj;
				} else {
					this.geojson = data;
				}
	
				notify.update(note, 'Mapa připravena', 'green');
				
			}
			
			if (!skipCenter) this.$nextTick(() => {
				// console.log(this.$refs.map);

				var list = [];

				if (this.$refs.map && this.$refs.map.leafletObject && this.$refs.map.leafletObject._targets) {
				
					Object.keys(this.$refs.map.leafletObject._targets).forEach(key => {
						var obj = this.$refs.map.leafletObject._targets[key];
	
						if (obj._bounds) {
							list.push(obj._bounds);	
						}
					})
				}

				if (list.length > 0) {
				
					var bounds = {
						_northEast: {
							lat: Math.max(...list.map(x => x._northEast.lat)), 
							lng: Math.max(...list.map(x => x._northEast.lng))
						},
						_southWest: {
							lat: Math.min(...list.map(x => x._southWest.lat)), 
							lng: Math.min(...list.map(x => x._southWest.lng))
						},
					};

					// console.log(bounds);

					this.fitBounds(bounds);
				} else {
					this.centerAfterLoad();
				}
				
			});
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
		fitBounds: function (item) {
			setTimeout(() => {
				if (this.$refs.map) this.$refs.map.leafletObject.fitBounds([[item._northEast.lat, item._northEast.lng], [item._southWest.lat, item._southWest.lng]]);
			}, 250);			
		},
		setView: function (center, zoom) {
			this.$refs.map.leafletObject.setView(center, zoom);
		},
		invalidateSize: function (center, zoom) {
			this.$nextTick(() => {
				if (this.$refs.map && this.$refs.map.leafletObject) this.$refs.map.leafletObject.invalidateSize();
			})			
		}
	},
	mounted: function () {
		setTimeout(() => this.processOptions(), 100);
	},
	watch: {
		// options: function () {
		// 	setTimeout(() => this.processOptions(), 100);
		// }
	}
};
