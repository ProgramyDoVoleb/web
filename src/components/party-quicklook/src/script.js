import {useData} from '@/stores/data';
import { colorByItem, logoByItem } from '@/pdv/helpers';
import { type, domain } from '@/pdv/helpers';
import { useCore, cdn } from '@/stores/core';

export default {
	name: 'party-quicklook',
	props: ['VSTRANA', 'datum', 'region', 'prefetch', 'volby', 'volbyType'],
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
			var d = this.prefetch || this.$store.getters.pdv('party/meta/' + this.VSTRANA + ';' + (this.datum || '') + ';social,web;' + (this.region || '') + ';' + ((this.volby || '')));

			return this.prefetch || (d ? d.list[0] : null);
		},
		meta: function () {
			return this.data ? this.data.$data : null;
		},
		globs: function () {
			return this.data ? this.data.$globs : null;
		}
	},
	methods: {
		colorByItem, type, domain
	}
};
