import {cdn} from '@/stores/core';
import { useEnums } from '@/stores/enums';
import {date} from '@/pdv/helpers';
import TownItem from '@/views/volby/detail/komunalni-volby/item/do.vue'
import SearchTown from '@/components/search-town/do.vue'

export default {
	name: 'volby-item',
	props: ['data', 'prev'],
	components: {
		TownItem, SearchTown
	},
	data: function () {
		return {
			cdn
		}
	},
	computed: {
		enums: function () {
			return useEnums()
		}
	},
	methods: {
		date,
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
