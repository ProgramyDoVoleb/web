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

			// console.log(link);
			try {
				var url = URL.parse(link);
			} catch (e) {
				var url = new URL(link);
			}
			
			var query = url.search != "" ? url.search.split('?')[1].split('&').map(x => x.split('=')) : [];

			if (query.length > 0) {
				var qutm = query.find(x => x[0] === 'utm_source');
				if (qutm) {
					qutm[1] = 'programydovoleb.cz';
				} else {
					query.push(['utm_source', 'programydovoleb.cz']);
				}

				var qarr = [];

				query.forEach(x => qarr.push(x.join('=')));

				link = url.origin + url.pathname + '?' + qarr.join('&');
			} else {
				link = url.origin + url.pathname + '?utm_source=programydovoleb.cz';
			} 

			// console.log('=>', link);

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
