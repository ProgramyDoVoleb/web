import {cdn} from '@/stores/core';
import { useEnums } from '@/stores/enums';
import {useData} from '@/stores/data';
import {date, sortBy, number} from '@/pdv/helpers';
import {colorByItem, logoByItem} from '@/components/results/helpers';
import RegionItem from '@/views/volby/detail/senatni-volby/item/do.vue'
import CtaGetAdmin from '@/components/cta/get-admin/do.vue';
import CtaSupport from '@/components/cta/support/do.vue';
import SearchParty from '@/components/search-party/do.vue'

export default {
	name: 'volby-item',
	props: ['data', 'prev'],
	components: {
		RegionItem, CtaGetAdmin, CtaSupport, SearchParty
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
		current: function () {
			return this.data.list[0]
		},
		parties: function () {
			return this.$store.getters.pdv('parties/as-of/' + this.data.list[0].datum + ';1,7,47,53,166,703,720,721,768,1114,714,5,1227,1245,1265,1178');
		}
	},
	methods: {
		date,
		sortBy,
		number,
		colorByItem, logoByItem,
		region: function (index) {
			var o = {}

			o.cis = this.data.cis;
			o.list = [];

			var data = this.data.list[0];
			var el = {}
			el.$kandidatu = data.$kandidatu;

			if (data.$kandidati) {
				el.$kandidati = data.$kandidati.filter(x => x.OBVOD === index);;
			}

			if (data.status === 3) {
				el.$ucast = data.$ucast.filter(x => x.OBVOD === index);
				el.$vysledky = data.$vysledky.filter(x => x.OBVOD === index);
				el.$zvoleni = data.$zvoleni.filter(x => x.OBVOD === index);
			}
			el.status = data.status;

			o.list.push(el);

			return o;
		}
	}
};
