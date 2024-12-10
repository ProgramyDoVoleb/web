import { cdn } from '@/stores/core';

export default {
	name: 'results-parties-grid',
	props: ['list'],
	data: function () {
		return {
			cdn
		}
	}
};
