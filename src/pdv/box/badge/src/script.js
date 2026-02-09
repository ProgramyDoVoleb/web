import { cdn } from '@/stores/core';

export default {
	name: 'BoxButton',
	props: ['color', 'background', 'full', 'icon', 'logo'],
	data: function () {
		return {
			cdn
		}
	}
};
