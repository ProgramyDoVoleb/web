import { number, pct, round, truncate, indicator, date, url } from '@/pdv/helpers';
import { cdn } from '@/stores/core';
import html2canvas from 'html2canvas'

export default {
	name: 'results-parties-graph',
	props: ['list', 'diff', 'mandates', 'mandatesPrevious', 'mandatesSince', 'about'],
	data: function () {
		return {
			show: true,
			width: 400,
			bg: true,
			imagedata: null
		}
	},
	computed: {
		passed: function () {
			return this.list.filter(x => x.passed).length
		},
		missed: function () {
			return this.list.filter(x => !x.passed).length
		},
		detectWidth: function () {
			var w = 1080;

			if (this.display) {
				if (this.display.length > 9) w = 1280;
				if (this.display.length > 11) w = 1440;
				if (this.display.length > 13) w = 1600;
				if (this.display.length > 15) w = 1920;
			}

			return w;
		},
		display: function () {
			var arr = this.list.filter(x => x.passed);
			var rest = [];

			// console.log(this.$el);

			this.list.filter(x => !x.passed).forEach(item => {

				var limit = 70;

				// if (this.width > 800) limit = 10;
				// if (this.width > 1200) limit = 15;

				if (arr.length < limit) {
					arr.push(item);
				} else {
					rest.push(item);
				}
			});
			
			var o = {
				label: 'ostatní',
				short: 'ostatní',
				link: null,
				color: '#ddd',
				logo: cdn + 'empty.png',
				votes: 100 - arr.reduce((a, b) => a + b.pct, 0),
				pct: 100 - arr.reduce((a, b) => a + b.pct, 0),
				mandates: null,
				passed: false
			}

			// if (arr[0].ref) {
				o.ref = {
					votes: 100 - arr.reduce((a, b) => a + b.ref.pct, 0),
					pct: 100 - arr.reduce((a, b) => a + b.ref.pct, 0)
				}
			// }

			arr.push(o);
			
			var highest = 0;

			arr.forEach(x => {
				if (highest < x.pct) highest = x.pct;

				if (x.ref && x.ref.pct > highest) highest = x.ref.pct;
			})
			
			arr.forEach(x => {
				x.graph = pct(x.pct, highest * (highest === o.pct ? 1.4 : 1.2), 2);

				if (x.ref) {
					x.ref.graph = pct(x.ref.pct, highest * (highest === o.pct ? 1.4 : 1.2), 2);
				}
			})
			
			return arr;
		}
	},
	methods: {
		round,
		truncate,
		number, indicator, date, url,
		onResize: function () {
			this.width = this.$el.getBoundingClientRect().width;
		},
		snapshot: function (ev) {
			html2canvas(this.$el.querySelector('._rendered'),{
				allowTaint: true,
				useCORS : true,
				backgroundColor:null,
				alpha: false
			}).then((canvas) => {
				this.$refs.canvas.appendChild(canvas);
				this.imagedata = canvas.toDataURL("image/png");

				canvas.style.width = '100%';
				canvas.style['max-width'] = canvas.width + 'px';
				canvas.style.height = 'auto';
			})
		}
	},
	mounted: function () {
		setTimeout(() => {
			this.show = true
		}, 150)
		this.onResize();
		window.addEventListener("resize", () => this.onResize());
	},
	watch: {
		list: function () {
			// this.show = false;
			
			setTimeout(() => {
				this.show = true
			}, 150)
		}
	}
};
