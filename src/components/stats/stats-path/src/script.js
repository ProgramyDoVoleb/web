import {beautifyNumber} from "@/store/helpers";

export default {
	name: 'stats-path',
	props: ['data', 'inline', 'color', 'minV', 'maxV', 'minL', 'maxL', 'size', 'hideLines'],
	data: function () {
		return {
			textOffset: 0
		}
	},
	computed: {
		minValue: function () {
			var m = this.data.values[0].value;

			this.data.values.forEach(d => {
				if (m > d.value) m = d.value;
			});

			return this.minV || m;
		},
		maxValue: function () {
			var m = this.data.values[0].value;

			this.data.values.forEach(d => {
				if (m < d.value) m = d.value;
			});

			return this.maxV || m;
		},
		minLabel: function () {
			return this.minL || this.data.values[0].label;
		},
		maxLabel: function () {
			return this.maxL || this.data.values[this.data.values.length - 1].label;
		},
		points: function () {
			var list = [];
			var min = this.size / 10;
			var sizeX = this.size * 2 - 2 * min;
			var sizeY = this.size - 4 * min;

			function make (self, v) {
				var point = {node: v};

				point.x = min + (v.label - self.minLabel)/(self.maxLabel - self.minLabel) * sizeX;
				point.y = min * 2 + sizeY - (v.value - self.minValue)/(self.maxValue - self.minValue) * sizeY;

				list.push(point);
			}

			// make (this, {label: this.minLabel, value: this.minValue});

			this.data.values.forEach((v, i) => make(this, v));

			// make (this, {label: this.maxLabel, value: this.maxValue});

			return list;
		},
		lines: function () {
			var list = [];

			this.points.forEach((from, i) => {
				if (i < this.points.length - 1) {
					var to = this.points[i + 1];

					var line = {x1: from.x, x2: to.x, y1: from.y, y2: to.y};

					list.push(line);
				}
			});

			return list;
		},
		last: function () {
			var line = this.lines[this.lines.length - 1];

			var data = {
				point: {x: line.x2, y: line.y2},
				above: line.y1 > line.y2,
				value: this.data.values[this.data.values.length - 1].value
			}

			data.point.y += data.above === false ? 10 : -2;

			return data;
		},
		first: function () {
			var line = this.lines[0];

			var data = {
				point: {x: line.x1, y: line.y1},
				above: line.y1 < line.y2,
				value: this.data.values[0].value
			}

			data.point.y += data.above === false ? 10 : -2;

			return data;
		}
	},
	methods: {
		beautifyNumber,
		resize: function () {
			setTimeout(() => {
				if (!this.inline) this.textOffset = this.$el.querySelector(".text-last").getComputedTextLength();
			}, 1000);
		},
		path: function (line) {
			var s = [];
			var off = (this.last.point.x - this.first.point.x) / this.lines.length / 2;
			s.push('M');
			s.push(line.x1);
			s.push(line.y1);
			s.push('C');
			s.push(line.x1 + off);
			s.push(line.y1);
			s.push(line.x2 - off);
			s.push(line.y2);
			s.push(line.x2);
			s.push(line.y2);

			return s.join(' ');
		}
	},
	mounted: function () {
		this.resize();
		window.addEventListener('resize', () => this.resize());
	}
};
