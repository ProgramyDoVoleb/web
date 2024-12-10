import {url} from '@/pdv/helpers';

export default {
	name: 'Block',
	props: ['level', 'headline', 'anchor', 'alert', 'subheadline', 'hide', 'anchorLabel', 'editable'],
	computed: {
		hash: function () {
			return url(this.anchor || this.headline)
		}
	},
	methods: {
		url
	}
};
