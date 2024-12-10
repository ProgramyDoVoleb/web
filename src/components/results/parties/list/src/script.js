import { cdn } from '@/stores/core';
import { sortByPorCislo, date, unique } from '@/pdv/helpers';

export default {
	name: 'results-parties-list',
	props: ['list'],
	data: function () {
		return {
			cdn
		}
	},
	computed: {
		hasObvody: function () {
			return !!this.list.find(x => x.obvod && x.obvod === 2)
		}
	},
	methods: {
		sortByPorCislo, date, unique
	}
};
