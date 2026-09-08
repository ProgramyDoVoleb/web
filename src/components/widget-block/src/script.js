import copy from 'copy-to-clipboard';

export default {
	name: 'widget-block',
	props: ['id'],
	data: function () {
		return {
			copied: false,
			size: [300,450],
			autoheight: false,
			own: false
		}
	},
	methods: {
		copyLink: function () {
			var code = [];

			if (this.autoheight) {
				code.push('<script src="https://embed.programydovoleb.cz/js/iframeResizer.min.js"></script>');
			}
			
			code.push('<iframe src="https://embed.programydovoleb.cz/' + this.id + '" frameborder="0" width="' + this.size[0] + '" height="' + (this.autoheight ? 'auto' : this.size[1]) + '" style="width: ' + this.size[0] + 'px; height: ' + (this.autoheight ? 'auto' : this.size[1] + 'px') + '" loading="lazy" referrerpolicy="strict-origin" id="pdv-iframe-' + this.id + '" onload="iFrameResize({}, \'#pdv-iframe-' + this.id + '\')"></iframe>');
			// code.push('<script>iFrameResize({}, "#pdv-widget")</script>');

			copy(code.join('\n'));
			this.copied = true;

			setTimeout(() => this.copied = false, 1000);
		},
		enc: function (s) {
			return encodeURIComponent(s);
		}
	}
};
