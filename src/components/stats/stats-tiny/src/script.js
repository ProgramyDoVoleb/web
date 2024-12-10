import {number} from "@/pdv/helpers";
import StatsLine from "../../stats-line/do.vue";

export default {
	name: 'stats-tiny',
	props: ['data', 'color', 'allLabels', 'inline', 'width'],
	data: function () {
		return {
			height: 0,
			textOffset: 0,
			viewBox: '0 0 0 0'
		}
	},
	components: {
		StatsLine
	},
	computed: {
		minValue: function () {
			var m;
			this.data.values.forEach(d => {
				if (!m) m = d.value;
				if (m > d.value) m = d.value;
			});

			return m;
		},
		maxValue: function () {
			var m;
			this.data.values.forEach(d => {
				if (!m) m = d.value;
				if (m < d.value) m = d.value;
			});

			return m;
		}
	},
	methods: {
		number,
		resize: function () {
			setTimeout(() => {
				this.height = this.$el.querySelector("svg").clientWidth / 2;
				this.viewBox = '0 0 ' + this.height * 2 + ' ' + this.height;
			}, 1000);
		}
	},
	mounted: function () {
		this.resize();
		window.addEventListener('resize', () => this.resize());
	}
};
