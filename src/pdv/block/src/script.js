import {url} from '@/pdv/helpers';

export default {
	name: 'Block',
	props: ['level', 'headline', 'anchor', 'alert', 'subheadline', 'hide'],
	computed: {
		hash: function () {
			return url(this.anchor || this.headline)
		}
	}
};
