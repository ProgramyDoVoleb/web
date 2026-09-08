import copy from 'copy-to-clipboard';

export default {
	name: 'widget-block',
	props: ['link', 'open'],
	data: function () {
		return {
			copied: false
		}
	},
	computed: {
		path: function () {
			return 'https://2022.programydovoleb.cz' + (this.link || this.$route.fullPath.split('#')[0]);
		},
		vars: function () {
			return this.link;
		},
		sample: function () {
			var code = [];
			code.push('<script src="https://embed.programydovoleb.cz/js/iframeResizer.min.js"></script>');
			code.push('<iframe id="pdv-widget" src="https://embed.programydovoleb.cz?' + this.vars + '" style="width: 1px; min-width: 100%; border: 0 none" onload="iFrameResize({}, "#pdv-widget")"></iframe>');
			// code.push('<script>iFrameResize({}, "#pdv-widget")</script>');

			return code.join('\n');
		},
		sampleDemo: function () {
			return this.sample.split('<').join('&lt;').split('>').join('&gt;')
		}
	},
	methods: {
		copyLink: function () {
			copy(this.sample);
			this.copied = true;

			setTimeout(() => this.copied = false, 1000);
		},
		enc: function (s) {
			return encodeURIComponent(s);
		},
		openme: function () {
			this.$refs.ce.opened = true;
		}
	}
};
