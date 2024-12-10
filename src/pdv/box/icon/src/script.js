import { cdn } from '@/stores/core';

export default {
	name: 'BoxIcon',
	props: ['type','background', 'link', 'png'],
	computed: {
		src: function () {
			if (this.link) {
				return this.link
			} else {
				return cdn + 'icon/' + this.type + (this.png ? '.png' : '.svg');
			}
		}
	}
};
