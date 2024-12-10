export default {
	name: 'BoxWrapper',
	props: ['href', 'to', 'click', 'title', 'target'],
	computed: {
		_click: function () {
			return this.click || function () {};
		}
	},
	methods: {
		slideTo: function (name, ev) {
			ev.preventDefault();
			document.querySelector("a[name=" + name.split('#')[1] + "]").scrollIntoView({behavior: "smooth", block: "center"});
		},
		isClicked: function (ev) {
			if (this.href && this.href.charAt(0) === '#') {
				this.slideTo(href, ev);
			} else {
				this._click();
			}
		}
	}
};
