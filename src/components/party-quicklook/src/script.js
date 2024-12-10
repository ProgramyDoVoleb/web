import {useData} from '@/stores/data';
import { colorByItem, logoByItem } from '@/components/results/helpers';
import { type, domain } from '@/pdv/helpers';
import { useCore, cdn } from '@/stores/core';

export default {
	name: 'party-quicklook',
	props: ['VSTRANA', 'datum', 'region'],
	data: function () {
		return {
			cdn
		}
	},
	computed: {
		$store: function () {
			return useData()
		},
		data: function () {
			var d = this.$store.getters.pdv('party/meta/' + this.VSTRANA + ';' + (this.datum || '') + ';social,web' + (this.region ? ';' + this.region : ''));

			return d ? d.list[0] : null;
		},
		meta: function () {
			return this.data ? this.data.$data : null;
		}
	},
	methods: {
		colorByItem, type, domain
	}
};
