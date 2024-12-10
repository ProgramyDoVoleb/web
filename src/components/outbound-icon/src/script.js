export default {
	name: 'outbound-icon',
	props: ['href', 'type', 'title', 'img', 'category', 'size', 'background'],
	data: function () {
		return {}
	},
	computed: {
		myTitle: function () {
			return this.title || 'přejít na ' + this.type;
		},
		mySrc: function () {
			return this.img || this.$store.state.static + 'icon/' + this.type + '.svg'
		}
	},
	components: {},
	methods: {
		handle_click: function () {
			this.$store.dispatch("ge", {
				path: this.$route.path,
				event: "outbound-icon",
				value: this.href
			});
		}
	},
	mounted: function () {}
};
