import {url} from '@/pdv/helpers';

export default {
	name: 'BlockExpandable',
	props: ['level', 'headline', 'anchor', 'alert', 'subheadline', 'label', 'open', 'anchorLabel'],
	data: function () {
		return {
			opened: false
		}
	},
	mounted: function () {
		if (this.open) this.opened = this.open;
	},
	computed: {
		hash: function () {
			return url(this.anchor || this.headline)
		}
	},
	watch: {
		open: function () {
			if (this.open && this.open === true) this.opened = true;
			if (this.open && this.open === false) this.opened = false;
			if (!this.open) this.opened = false;
		}
	}
};
