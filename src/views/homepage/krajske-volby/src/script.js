import {useData} from '@/stores/data';
import { useEnums } from '@/stores/enums';

import PartyPreview from '@/components/party-preview/do.vue';
import PartyPreviewTiny from '@/components/party-preview-tiny/do.vue';
import {url, date, number, truncate, domain, con, sortBy} from '@/pdv/helpers';
import { colorByItem, logoByItem } from '@/components/results/helpers';

export default {
	name: 'HomepageKZ',
	props: ['elections'],
	data: function () {
		return {
			width: window.innerWidth,
			list: [
				0,16,14,13,19,14,13,13,12,13,15,13,15,13
			]
		}
	},
	components: {
	  PartyPreview, PartyPreviewTiny
	},
	computed: {
		$store: function () {
			return useData()
		},
		enums: function () {
			return useEnums()
		},
		election: function () {
			return this.$store.getters.pdv('elections/fetch/' + this.elections.id);
		}
	},
	methods: {
		sortBy,
		logoByItem, colorByItem,
		sortByPorCislo: function (list) {
			list.sort((a, b) => (a.PORCISLO || 1000) - (b.PORCISLO || 1000));

			return list;
		}
	}
};
