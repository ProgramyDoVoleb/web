import {useData} from '@/stores/data';
import {useEnums} from '@/stores/enums';
import HeroMap from '@/components/hero-map/main/do.vue';
import { cdn, today } from '@/stores/core';
import {sortBy} from '@/pdv/helpers';
import {ga} from '@/pdv/analytics';

export default {
	name: 'layout-volby-okres',
	props: ['id', 'district'],
	data: function () {
		return {
			cdn,
			enums: useEnums(),
			options: null,
			showMap: false,
			mapPrep: false,
		}
	},
  components: {
	HeroMap
  },
	computed: {
		$store: function () {
			return useData()
		},
		geojson: function () {
			var d = this.$store.getters.json('https://data.gov.cz/p%C5%99%C3%ADlohy/%C4%8Dl%C3%A1nky/kartogram-choropleth/data/obce-simple.json');
		},
		towns: function () {
			var d = this.$store.getters.pdv('elections/specific/176/towns');

			if (d) {
				if (this.district != 1100) {
					this.toggleMap();
				}
			}

			return d;
		},
	},
  methods: {
	sortBy,
	load: async function () {
		var d = await fetch('https://data.gov.cz/p%C5%99%C3%ADlohy/%C4%8Dl%C3%A1nky/kartogram-choropleth/data/obce-simple.json');
			var data = await d.json();

			var obj = {
				"type":"FeatureCollection",
				"features": []
			};

			var rep = this.towns.obce.find(x => x.OKRES == this.district).obec;
			var lau = data.features.find(x => x.id == rep).properties.LAU1_KOD;

			data.features.forEach(item => {
				if (item.properties.LAU1_KOD === lau) {
					obj.features.push(item);
				}
			});
			
		var options = {
			rep,
			lau,
			geojson: obj,
			detail: 'obce',
			style: {'max-height': '50vh', 'margin-top': 0}
		}

		this.options = options;
	},
	toggleMap: function () {
		if (!this.options && !this.mapPrep) {
			this.mapPrep = true;
			this.load();
		}
	}
  },
  mounted: function () {
    window.scrollTo(0, 1);
	ga("Zastupitelstva v okrese " + this.enums.okresy.find(x => x.id == this.district).name);
  }
};
