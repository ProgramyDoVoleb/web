import {cdn} from '@/stores/core';
import { useEnums } from '@/stores/enums';
import {useData} from '@/stores/data';
import {date, sortBy} from '@/pdv/helpers';
import { colorByItem, logoByItem } from '@/pdv/helpers';
import TownItem from '@/views/volby/detail/komunalni-volby/item/do.vue'
import SearchTown from '@/components/search-town/do.vue'
import SearchParty from '@/components/search-party/do.vue'
import HeroMap from '@/components/hero-map/main/do.vue';

export default {
	name: 'volby-item',
	props: ['data', 'prev'],
	components: {
		TownItem, SearchTown, SearchParty, HeroMap
	},
	data: function () {
		return {
			cdn
		}
	},
	computed: {
		$store: function () {
			return useData()
		},
		enums: function () {
			return useEnums()
		},
		parties: function () {
			return this.$store.getters.pdv('parties/as-of/' + this.data.list[0].datum + ';1,7,47,53,166,703,720,721,768,1114,714,5,1227,1245,1265,1178,1298');
		}
	},
	methods: {
		date, sortBy,
		colorByItem, logoByItem,
		town: function (index) {
			var o = {}

			o.cis = this.data.cis;
			o.list = [];

			var data = this.data.list[0];
			var el = {}

			el.$kandidatu = data.$kandidatu;
			el.$obce = data.$dotcene.filter(x => x.obec === index);
			el.$strany = data.$strany.filter(x => x.KODZASTUP === index);

			if (data.$kandidati) {
				el.$kandidati = data.$kandidati.filter(x => x.KODZASTUP === index);;
			}

			if (data.status === 3) {
				el.$ucast = data.$ucast.filter(x => x.KODZASTUP === index);
				el.$vysledky = data.$vysledky.filter(x => x.KODZASTUP === index);
				el.$zvoleni = data.$zvoleni.filter(x => x.KODZASTUP === index);
			}

			el.status = data.status;

			o.list.push(el);

			return o;
		}
	}
};
