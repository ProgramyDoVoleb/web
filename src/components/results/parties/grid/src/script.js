import { cdn } from '@/stores/core';
import { sortByPorCislo, date } from '@/pdv/helpers';
import ReportForm from '@/components/report-form/do.vue'

export default {
	name: 'results-parties-grid',
	props: ['list', 'leaders'],
	data: function () {
		return {
			cdn
		}
	},
	methods: {
		sortByPorCislo, date
	},
	components: {
		ReportForm
	}
};
