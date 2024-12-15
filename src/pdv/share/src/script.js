import copy from 'copy-to-clipboard';
import {ge} from '@/pdv/analytics'

export default {
	name: 'share-block',
	props: ['copy', 'title', 'middle', 'link', 'cta', 'compact'],
	data: function () {
		return {
			copied: false,
			_backupCopy: 'Podívejte se na Programy do voleb'
		}
	},
	computed: {
		path: function () {
			return 'https://' + window.location.hostname + (this.link || this.$route.fullPath.split('#')[0]);
		}
	},
	methods: {
		copyLink: function () {
			copy(this.path);
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
	}
};
