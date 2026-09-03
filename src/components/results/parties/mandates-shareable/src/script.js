import { number, pct, round, truncate, indicator, date, url, logoByItem, colorByItem, sortBy } from '@/pdv/helpers';
import { cdn } from '@/stores/core';
import html2canvas from 'html2canvas'
import { useEngagement } from '@/stores/engagement';
import { ge } from '@/pdv/analytics'

import parliamentSvg from '@/components/results/chart';
// import toHtml from 'to-html';
import { toHtml as toSvg } from 'hast-util-to-html'

export default {
	name: 'results-parties-mandates',
	props: ['list', 'about', 'username', 'hash'],
	data: function () {
		return {
			show: true,
			width: 400,
			bg: true,
			imagedata: null,
			generating: false,
			error: null,
			graphDataConverted: null
		}
	},
	computed: {
		graphData: function () {
			return this.imagedata || 'https://static.programydovoleb.cz/empty.png';
		},
		engagement: function () {
			return useEngagement();
		},
		passed: function () {
			return this.list.filter(x => x.passed).length
		},
		missed: function () {
			return this.list.filter(x => !x.passed).length
		},
		detectWidth: function () {
			var w = 1080;

			// if (this.display) {
			// 	if (this.display.length > 9) w = 1280;
			// 	if (this.display.length > 11) w = 1440;
			// 	if (this.display.length > 13) w = 1600;
			// 	if (this.display.length > 15) w = 1920;
			// }

			return w;
		},
		chart: function () {
			var res = '<div></div>';
			var virtualSVG = null;

			if (this.list.reduce((a, b) => a + b.mandates, 0) > 0) {

				var seatData = {};

				sortBy(this.list.filter(x => x.mandates > 0), 'mandates', 0, null, true).forEach(party => {
					seatData[url(party.item.NAZEV).split('-').join('')] = {
						seats: party.mandates,
						color: colorByItem(party.item, this.about, null, true)
					}
				});

				const chartData = {};
  
				for (const [party, info] of Object.entries(seatData)) {
					chartData[party] = {
						seats: info.seats,
						colour: info.color
					};
				}

				virtualSVG = parliamentSvg(chartData, {seatCount: true});

				res = toSvg(virtualSVG);

				// console.log(seatData, virtualSVG, res);
			} else {
				// console.log('nothing to do');
			}

			return res;
		}
	},
	methods: {
		round,
		truncate,
		number, indicator, date, url,
		logoByItem, sortBy, colorByItem,
		onResize: function () {
			this.width = this.$el.getBoundingClientRect().width;
		},
		snapshot: function (ev) {

			// if (this.username) {
				var arr = [];

				this.list.forEach(x => {
					arr.push({
						id: x.item.id,
						mandates: x.mandates,
						short: truncate(x.item.NAZEV, 24, true)
					})
				})

				if (this.list.length > 0 && this.list[0].item.KODZASTUP) {
					arr = {
						obec: this.list[0].item.KODZASTUP,
						volby: this.list[0].item.volby,
						tip: arr
					}
				}

				this.engagement.add(this.$route.fullPath, this.hash || 'psp25-tip-1', JSON.stringify(arr), 'Ukládám tip');
			// }			
			
			while (this.$refs.canvas.children.length > 0) {
				this.$refs.canvas.children[0].remove();
			}
			
			var el = this.$el.querySelector('._rendered');
			if (window.innerWidth < 640) el.classList.add('generation');

			this.generating = true;

			var imgs = document.querySelectorAll('[loading]');

			for (var i = 0; i < imgs.length; i++) {
				imgs[i].setAttribute('loading', 'auto');
			}

			setTimeout(() => {
				html2canvas(el,{
					allowTaint: true,
					useCORS : true,
					backgroundColor:null,
					alpha: false,
					ignoreElements: function (e) {
						// Here, ignore external URL links and lazyload images
						if ((e.tagName === "A" && e.host !== window.location.host) || e.getAttribute('loading') === "lazy") {
							return true;
						} else {
							return false;
						}
					}
				}).then((canvas) => {
					this.$refs.canvas.appendChild(canvas);
					this.imagedata = canvas.toDataURL("image/png");

					canvas.style.width = '100%';
					canvas.style['max-width'] = canvas.width + 'px';
					canvas.style.height = 'auto';

					ge({
						event: "graph-generated",
						value: this.username ? 'Tip na výsledek' : 'Průzkum'
					})

					el.classList.remove('generation');
					this.generating = false;
				}).catch(e => {
					this.error = e;
				});
			}, 500);
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
