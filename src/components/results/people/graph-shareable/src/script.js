import { number, pct, round, truncate, indicator, date, url, logoByItem, colorByItem, sortBy, con } from '@/pdv/helpers';
import { cdn } from '@/stores/core';
import html2canvas from 'html2canvas'
import { useEngagement } from '@/stores/engagement';
import { ge } from '@/pdv/analytics'

export default {
	name: 'results-candidates-graph',
	props: ['list', 'round2', 'winner', 'about', 'username', 'hash'],
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

			if (this.display) {
				if (this.display.length > 9) w = 1280;
				if (this.display.length > 11) w = 1440;
				if (this.display.length > 13) w = 1600;
				if (this.display.length > 15) w = 1920;
			}

			return w;
		},
		display: function () {
			var arr = [];
			
			this.list.forEach(x => arr.push({
				item: x.item,
				name: x.name,
				pty: x.pty,
				filt: x.filt,
				value: x.value,
				rnd2: x.rnd2
			}));

			var rest = [];
			
			var highest = 0;
			var o = {pct: 0};

			arr.forEach(x => {
				if (highest < x.value) highest = x.value;
			})
			
			arr.forEach(x => {
				x.graph = pct(x.value, highest * (highest === o.pct ? 1.4 : 1.2), 2);
				x.logo = logoByItem(x.item, this.about);
				x.color = colorByItem(x.item, this.about);

				if (x.logo.includes('empty') && con(x.item.$data, 'photo')) {
					x.logo = con(x.item.$data, 'photo');
				}
			})

			if (this.round2.length > 0 && arr.find(x => x.rnd2 > 0)) {
				// console.log(this.about.poll.$data.find(y => y.inRnd2 && y.rnd2 === 0));
				var missing = arr.find(x => x.item.id === this.about.poll.$data.find(y => y.inRnd2 && y.rnd2 === 0).cand.id);
				missing.rnd2 = 100 - arr.find(x => x.rnd2 > 0).rnd2;
			}
			
			return sortBy(arr, 'value', 0, false, true);
		}
	},
	methods: {
		round,
		truncate,
		number, indicator, date, url,
		logoByItem,
		onResize: function () {
			this.width = this.$el.getBoundingClientRect().width;
		},
		snapshot: function (ev) {

			// if (this.username) {
				var arr = [];

				this.list.forEach(x => {
					arr.push({
						id: x.item.id,
						rnd1: x.value,
						rnd2: x.rnd2,
						short: x.item.PRIJMENI
					})
				})

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
