var viewBox = {
	CZ010: '300 180 100 100',
	CZ020: '150 80 500 300',
	CZ031: '150 300 500 300',
	CZ032: '0 200 500 300',
	CZ041: '-50 120 300 150',
	CZ042: '0 0 500 200',
	CZ051: '300 10 300 100',
	CZ052: '400 80 350 150',
	CZ053: '450 200 300 150',
	CZ063: '350 290 400 200',
	CZ064: '500 350 400 200',
	CZ071: '500 130 500 300',
	CZ072: '700 385 300 100',
	CZ080: '650 180 400 200'
}

export default {
	name: 'map-element',
	props: ['highlight', 'points', 'areas', 'width', 'zoom'],
	data: function () {
		return {
			e: 18.8591456,
			s: 48.5519972,
			w: 12.0906633,
			n: 51.0556997,
			h: 18.8591456 - 12.0906633,
			v: 51.0556997 - 48.5519972,
			widthValue: 0,
			heightValue: 0,
			zoomValue: 'CZ01',
			lastEmit: {
				time: 0,
				data: undefined
			}
		}
	},
	computed: {
		viewBox: function () {
			return (viewBox[this.zoomValue] || viewBox[this.zoomValue.substring(0, 5)]) || '-50 -50 1100 680';
		},
		calculatedPoints: function () {
			var list = [];

			if (this.points) {
				this.points.forEach(point => {
					var obj = {
						e: 0,
						n: 0,
						x: 0,
						y: 0
					}

					obj.e = (point.lng - this.w) / this.h;
					obj.n = (point.lnt - this.s) / this.v;

					obj.x = 0 + obj.e * 1021;
					obj.y = 587 - (0 + obj.n * 587);

					obj.fill = point.color;
					obj.opacity = point.opacity || 1;
					obj.r = point.size || 10;

					obj.num = point.num;

					list.push(obj);
				});
			}

			return list;
		}
	},
	methods: {
		clear: function () {
			if (this.$refs) {
				Object.keys(this.$refs).forEach(ref => {
					this.$refs[ref].classList.remove('highlight');
					this.$refs[ref].style = "";
					this.$refs[ref].removeEventListener('mouseover', function () {});
				})
			}
		},
		populate: function () {
			this.clear();

			if (this.highlight) {
				this.$refs[this.highlight].classList.add('highlight');
			}
			if (!this.highlight && this.zoomValue.length > 4) {
				this.$refs[this.zoomValue].classList.add('highlight');
			}
			if (this.areas) {
				this.areas.forEach(area => {
					if (this.$refs[area.nuts] && area.color && area.opacity) {
						this.$refs[area.nuts].style = 'fill:' + area.color + ';opacity:' + area.opacity;

						this.$refs[area.nuts].title = area.value;

						this.$refs[area.nuts].addEventListener('mouseover', (e) => this.select(area, e));
					} else {
						// console.log(area);
					}
				});
			}
		},
		resize: function () {
			this.widthValue = this.width || 256;
			this.heightValue = Math.round(this.$el.parentNode.getBoundingClientRect().width / 256 * 149);
		},
		select: function (data, e) {
			this.$emit('select', {data, e});
		},
		selectPoint: function (e) {
			this.select({id: Number(e.target.attributes.point.value)}, e);
		}
	},
	mounted: function () {

		this.zoomValue = this.zoom || 'CZ01';

		this.populate();
		this.resize();

		window.addEventListener("resize", () => this.resize());

		setTimeout(() => this.resize(), 100);
		setTimeout(() => this.resize(), 1000);
	},
	watch: {
		points: function () {
			this.populate();
		},
		highlight: function () {
			this.populate();
		},
		areas: function () {
			this.populate();
		},
		zoom: function () {
			this.zoomValue = this.zoom || 'CZ01';
		}
	}
};
