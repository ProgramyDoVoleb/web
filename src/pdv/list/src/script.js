export default {
	name: 'List',
	props: ['padding', 'height'],
	data: function () {
		return {
			isSet: false,
			timer: null
		}
	},
	computed: {
		_padding: function () {
			var value = '1em';

			if (this.padding || this.padding === 0) {
				value = this.padding
			}

			if (typeof value === 'number' || isNaN(value) === false) value += 'em';

			return this.height ? null : value;
		}
	},
	mounted: function () {
		if (this.height) {

			this.setHeight();

			if (!this.isSet) {
				this.timer = setInterval(() => this.setHeight(), 100);
			}			
		}
	},
	methods: {
		setHeight: function () {
			var val = typeof this.height === "number" || !isNaN(Number(this.height)) ? this.height + 'em' : this.height;
	
			if (this.$el.children.length > 0) {
				for (var i = 0, el; i < this.$el.children.length; i++) {
					el = this.$el.children[i];
					// if (i > 0) el.style.paddingTop = val;
					// if (i < this.$el.children.length - 1) el.style.paddingBottom = val;
				}
	
				clearInterval(this.timer);
				this.isSet = true;
			}
		}
	},
	watch: {
		height: function () {
			this.setHeight();
		}
	}
};
