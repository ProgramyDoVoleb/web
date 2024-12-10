import { data } from '@/stores/core';

export default {
	name: 'BoxImage',
	props: ['src', 'border', 'rounded'],
	computed: {
		link: function () {
			var l = this.src;

			if (!l) l = '/static/missing.png';

			var s = l.split('/');

			if (s[0] != 'https:') {
				return data + this.src;
			}

			return this.src;
		}
	}
};
