import {domain} from '@/pdv/helpers';
import {ge} from '@/pdv/analytics';
import {cdn} from '@/stores/core';

export default {
	name: 'outbound-link',
	props: ['href', 'title', 'content', 'addon', 'look', 'category'],
	data: function () {
		return {
			cdn
		}
	},
	computed: {
		hasAddon: function () {
			if (typeof this.addon === "undefined") return undefined;
			if (typeof this.addon === "boolean") return 'link'; 
			
			return this.addon;
		},
		link: function () {
			var link = this.href;
			if (this.href && this.href.split('http').length === 1 && this.href.split('mailto:').length === 1) {
				link = 'http://' + this.href;
			}
			return link;
		},
		error: function () {
			return !this.href;
		}
	},
	components: {},
	methods: {
		domain,
		handle_click: function () {
			ge({
				event: "outbound-link",
				value: this.href
			});
		}
	},
	mounted: function () {}
};
