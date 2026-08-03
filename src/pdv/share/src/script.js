import copy from 'copy-to-clipboard';

import QRCodeVue3 from "@/components/qrcode/src";

import {ge} from '@/pdv/analytics'
import {url} from '@/pdv/helpers'

export default {
	name: 'share-block',
	props: ['copy', 'title', 'middle', 'link', 'cta', 'compact', 'pointer'],
	data: function () {
		return {
			copied: false,
			_backupCopy: 'Podívejte se na Programy do voleb',
			type: 1,
			txt: null,
			tick: 1,
			showQR: true
		}
	},
	components: {
		QRCodeVue3
	},
	computed: {
		path: function () {
			return 'https://' + window.location.hostname + (this.link || this.$route.fullPath.split('#')[0]);
		},
		shorthand: function () {
			var s = [];

			if (this.pointer) {
				var p = this.pointer.split(':');

				if (p[0] === 'csu_senat_rk') s.push('sk' + p[1]);
				if (p[0] === 'csu_kv_rk') s.push('ok' + p[1]);
				if (p[0] === 'csu_kv_ros') s.push('os' + p[1]);
			}

			if (this.type === 2 && this.title) {
				// console.log(this.title);
				s.push(url(this.title))
			}

			if (this.type === 3 && this.txt && this.txt.length > 0) {
				// console.log(this.title);
				s.push(url(this.txt))
			}

			this.tick++;

			return "http://dovoleb.cz/" + s.reverse().join('--');
		}
	},
	methods: {
		copyLink: function (path) {
			copy(path || this.path);
			this.copied = true;

			this.report('copy');

			setTimeout(() => this.copied = false, 1000);
		},
		report: function (action) {
			ge({
				value: action,
				event: "share",
				label: this.$route.fullPath
			});
		}
	},
	watch: {
		shorthand: function () {
			this.showQR = false;

			setTimeout(() => this.showQR = true, 50);
		}
	}
};
