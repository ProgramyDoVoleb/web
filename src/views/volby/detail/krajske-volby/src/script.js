import {cdn} from '@/stores/core';
import { useEnums } from '@/stores/enums';
import {useData} from '@/stores/data';
import { date, sortBy } from '@/pdv/helpers';
import RegionItem from '@/views/volby/detail/krajske-volby/item/do.vue'
import { colorByItem, logoByItem } from '@/pdv/helpers';
import CtaGetAdmin from '@/components/cta/get-admin/do.vue';
import CtaSupport from '@/components/cta/support/do.vue';
import SearchParty from '@/components/search-party/do.vue'

export default {
	name: 'volby-item',
	props: ['data', 'prev', 'id'],
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
		regions: function () {
			var arr = [];

			this.enums.regions.forEach((x, i) => {
				arr.push({
					index: i,
					name: x
				})
			})

			arr = sortBy(arr, 'name', null, true);

			return arr;
		},
		parties: function () {
			return this.$store.getters.pdv('parties/as-of/' + this.data.list[0].datum + ';1,7,47,53,166,703,720,721,768,1114,714,5,1227,1245,1265');
		},
		mandates: function () {
			var d = this.$store.getters.pdv('elections/kz-counts/162');

			return d;
		},
		mandatesData: function () {

			var d = this.mandates;

			if (d) {
				var results = {
					parties: [],
					regions: []
				};

				[3,11,5,8,7,14,12,9,4,2,6,10,13].forEach(id => {
					results.regions.push({
						kraj: id,
						parties: []
					})
				})

				d.cis.strany.forEach(party => {
					var o = {
						party,
						nominees: d.list.filter(x => x.NSTRANA === party.VSTRANA && x.MANDAT === 'A'),
						members: d.list.filter(x => x.PSTRANA === party.VSTRANA && x.MANDAT === 'A'),
					}

					results.parties.push(o);

					results.regions.forEach((region, index) => {
						var p = {
							party,
							nominees: d.list.filter(x => x.NSTRANA === party.VSTRANA && x.KRZAST === region.kraj && x.MANDAT === 'A'),
							members: d.list.filter(x => x.PSTRANA === party.VSTRANA && x.KRZAST === region.kraj && x.MANDAT === 'A'),
						}

						region.parties.push(p);
					})
				});

				results.parties.sort((a, b) => a.party.NAZEV.localeCompare(b.party.NAZEV, 'cs'));

				d = results;
			}

			return d;
		}
	},
	methods: {
		date, sortBy,logoByItem, colorByItem,
		region: function (index) {
			var o = {}

			o.cis = this.data.cis;
			o.list = [];

			var data = this.data.list[0];
			var el = {}
			el.$kandidatu = data.$kandidatu;
			el.$obce = data.$obce;
			el.$strany = data.$strany.filter(x => x.KRZAST === index);

			if (data.$kandidati) {
				el.$kandidati = data.$kandidati.filter(x => x.KRZAST === index);;
			}

			if (data.status === 3) {
				el.$ucast = data.$ucast.filter(x => x.KRZAST === index);
				el.$vysledky = data.$vysledky.filter(x => x.KRZAST === index);
				el.$zvoleni = data.$zvoleni.filter(x => x.KRZAST === index);
			}
			el.status = data.status;

			o.list.push(el);

			return o;
		}
	}
};
