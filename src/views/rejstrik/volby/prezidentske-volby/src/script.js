import ElectionResults from '@/views/history/volby/detail/do.vue';
import {colorByItem, logoByItem} from '@/components/results/helpers';
import {number, pct, con} from '@/pdv/helpers';
import { cdn } from '@/stores/core';

/* eslint-disable */

export default {
	name: 'party-elections-president',
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
		con,
		filteredList: function (okres) {
			return this.data.list.length < this.limitOfTowns ? this.data.list : this.data.list.filter(x => x.OKRES === okres)
		}
	}
};
