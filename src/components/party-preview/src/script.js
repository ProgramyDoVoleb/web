import {useData} from '@/stores/data';
import { colorByItem, logoByItem } from '@/components/results/helpers';
import { type, domain, date, sortBy } from '@/pdv/helpers';
import { useCore, cdn } from '@/stores/core';
import ReportForm from '@/components/report-form/do.vue';

export default {
	name: 'party-preview',
	props: ['party', 'candidates', 'candidatesCount', 'elections', 'election', 'link'],
	data: function () {
		return {
			cdn
		}
	},
	components: {
		ReportForm
	},
	computed: {
		extended: function () {
			return (this.party.$priorit && this.party.$priorit > 0) || (this.party.$priority && this.party.$priority.length > 0) || (this.party.$odpovedi && this.party.$odpovedi > 0) || (this.party.$program && this.party.$program.length > 0)
		}
	},
	methods: {
		colorByItem, logoByItem, date, sortBy,
		sortByPorCislo: function (list) {
			var arr = [];

			list.forEach(x => arr.push(x));

			arr.sort((a, b) => (a.PORCISLO || 1000) - (b.PORCISLO || 1000));

			// console.log(list, arr);

			return arr;
		}
	}
};
