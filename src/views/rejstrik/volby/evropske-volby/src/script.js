import ElectionResults from '@/views/history/volby/detail/do.vue';
import {colorByItem, logoByItem} from '@/pdv/helpers';
import {number, pct} from '@/pdv/helpers';
import { cdn } from '@/stores/core';

/* eslint-disable */

export default {
	name: 'party-elections-european',
	props: ['data', 'type', 'parties', 'focus'],
	data: function () {
		return {
			limitOfTowns: 2,
			cdn
		}
	},
	components: {
		ElectionResults
	},
	methods: {
		colorByItem,
		logoByItem,
		number,
		pct,
		filteredList: function (okres) {
			return this.data.list.length < this.limitOfTowns ? this.data.list : this.data.list.filter(x => x.OKRES === okres)
		}
	}
};
