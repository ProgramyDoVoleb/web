import {useData} from '@/stores/data';
import {useEnums} from '@/stores/enums';
import { colorByItem, logoByItem } from '@/pdv/helpers';
import { type, domain, date, truncate, sortBy, lang, number, firstOfUnique, con, untag, unique } from '@/pdv/helpers';
import { useCore, cdn } from '@/stores/core';
import ReportForm from '@/components/report-form/do.vue';
import PersonPreviewLinear from '@/components/person-preview-linear/do.vue';

export default {
	name: 'party-preview-full',
	props: ['party', 'candidates', 'elections', 'election', 'link', 'amount', 'more'],
	data: function () {
		return {
			cdn,
			enums: useEnums(),
			width: window.innerWidth
		}
	},
	computed: {
		snemovni: function () {
			return !this.amount && (this.candidates && this.candidates.find(x => typeof x.VOLKRAJ !== 'undefined'));
		},
		extended: function () {
			return (this.party.$priority && this.party.$priority > 0) || (this.party.$odpovedi && this.party.$odpovedi > 0) || (this.party.$program && this.party.$odpovedi.length > 0)
		}
	},
	components: {
		ReportForm, PersonPreviewLinear
	},
	methods: {
		colorByItem, logoByItem, date, truncate, type, sortBy, lang, number, firstOfUnique, con, untag, unique,
		sortByPorCislo: function (list) {
			var arr = [];

			list.forEach(x => arr.push(x));

			arr.sort((a, b) => (a.PORCISLO || 1000) - (b.PORCISLO || 1000));

			return arr;
		}
	},
	mounted: function () {
	}
};
