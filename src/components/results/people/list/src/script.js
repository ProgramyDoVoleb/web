import { cdn } from '@/stores/core';

export default {
	name: 'results-parties-list',
	props: ['list'],
	data: function () {
		return {
			cdn
		}
	}
};
