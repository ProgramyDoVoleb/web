import { cdn } from '@/stores/core';

export default {
	name: 'icon-element',
	props: ['src', 'size', 'border', 'background', 'icon'],
	computed: {
		_src: function () {
			return this.icon ? (cdn + 'icon/' + this.icon + (this.icon.split('.').length === 1 ? '.svg' : '')) : this.src;
		}
	}
};
