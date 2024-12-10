import { cdn } from '@/stores/core';
import { type, sortBy } from '@/pdv/helpers'

export default {
	name: 'results-parties-grid',
	props: ['list'],
	data: function () {
		return {
			cdn
		}
	},
	methods: {
		type, sortBy
	}
};
