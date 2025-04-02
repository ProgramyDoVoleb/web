import {useData} from '@/stores/data';
import {useEnums} from '@/stores/enums';
import { colorByItem, logoByItem } from '@/components/results/helpers';
import { type, domain, date, truncate, sortBy } from '@/pdv/helpers';
import { useCore, cdn } from '@/stores/core';
import ReportForm from '@/components/report-form/do.vue';

export default {
	name: 'party-preview',
	props: ['party', 'candidates', 'elections', 'election', 'link', 'amount', 'more'],
	data: function () {
		return {
			cdn,
			enums: useEnums()
		}
	},
	computed: {
		snemovni: function () {
			return !this.amount && (this.candidates && this.candidates.find(x => typeof x.VOLKRAJ !== 'undefined'));
		},
		extended: function () {
			return (this.party.$priorit && this.party.$priorit > 0) || (this.party.$odpovedi && this.party.$odpovedi > 0) || (this.party.$program && this.party.$odpovedi.length > 0)
		}
	},
	components: {
		ReportForm
	},
	methods: {
		colorByItem, logoByItem, date, truncate, type, sortBy,
		sortByPorCislo: function (list) {
			var arr = [];

			list.forEach(x => arr.push(x));

			arr.sort((a, b) => (a.PORCISLO || 1000) - (b.PORCISLO || 1000));

			return arr;
		}
	}
};
