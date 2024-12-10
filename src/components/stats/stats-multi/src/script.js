import {beautifyNumber} from "@/store/helpers";
import StatsLine from "../../stats-line/do";

export default {
	name: 'stats-multi',
	props: ['data', 'title', 'width', 'axisX'],
	data: function () {
		return {
			height: 0,
			viewBox: '0 0 0 0'
		}
	},
	components: {
		StatsLine
	},
	computed: {
		labelX: function () {
			var axis = {
				count: 0,
				lines: []
			};

			if (this.axisX && this.axisX.step && this.axisX.range) {

				var list = [];
				var min = this.height / 10;
				var sizeX = this.height * 2 - 2 * min;

				for (var i = this.axisX.range[0]; i <= this.axisX.range[1]; i += this.axisX.step) {

					var obj = {
						label: i,
						x: 0,
						timestamp: new Date(i, 0, 1).getTime()/100000
					};

					obj.x = min + (obj.timestamp - this.minLabel)/(this.maxLabel - this.minLabel) * sizeX;

					axis.lines.push(obj);
				}
			}

			return axis;
		},
		minValue: function () {
			var m;
			this.all.values.forEach(d => {
				if (!m) m = d.value;
				if (m > d.value) m = d.value;
			});

			return m;
		},
		maxValue: function () {
			var m;
			this.all.values.forEach(d => {
				if (!m) m = d.value;
				if (m < d.value) m = d.value;
			});

			return m;
		},
		minLabel: function () {
			return this.all.values[0].label;
		},
		maxLabel: function () {
			return this.all.values[this.all.values.length - 1].label;
		},
		all: function () {
			var obj = {
				title: '',
				addLabel: '',
				values: []
			};

			this.data.forEach(type => type.values.forEach(v => obj.values.push(v)));

			obj.values.sort((a, b) => a.label - b.label);

			return obj;
		}
	},
	methods: {
		beautifyNumber,
		resize: function () {
			setTimeout(() => {
				this.height = this.$el.querySelector("svg").clientWidth / 2;
				this.viewBox = '0 0 ' + this.height * 2 + ' ' + this.height;
			}, 100);
		}
	},
	mounted: function () {
		this.resize();
		window.addEventListener('resize', () => this.resize());
	}
};
