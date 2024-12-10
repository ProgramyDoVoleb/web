import {truncate} from '@/pdv/helpers';

export default {
	name: 'TruncatedText',
	props: ['content', 'compact', 'size', 'unbreak'],
	data: function () {
		return {
			full: false,
			hideable: false,
			truncated: undefined
		}
	},
	computed: {
		txt: function () {
			var txt = (!this.hideable || this.full) ? this.content : this.truncated;

			if (this.hideable && !this.full) txt = this.removeBreaks(txt); 
			if (this.unbreak) txt = this.removeBreaks(txt);

			return txt;
		}
	},
	methods: {
		test: function () {
			this.truncated = truncate(this.content, this.size || (typeof this.compact != "undefined" ? 30 : 120));
			if (this.truncated && this.truncated.length != this.content.length) this.hideable = true;
		},
		changeText: function () {
			if (this.full) {
				this.full = false;
				setTimeout(() => {
					this.$el.scrollIntoView({behavior: "smooth", block: "center"});
				}, 100);
			} else {
				this.full = true;
			}
		},
		removeBreaks: function (txt) {
			return (txt || '').split('<br>').join(' ');
		}
	},
	mounted: function () {
		this.test();
	},
	watch: {
		content: function () {
			this.test();
		}
	}
};
