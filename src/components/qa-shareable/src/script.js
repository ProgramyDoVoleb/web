import { number, pct, round, truncate, indicator, date, url, con, czechify } from '@/pdv/helpers';
import html2canvas from 'html2canvas'
import { useEnums } from '@/stores/enums';
import { colorByItem, logoByItem } from '@/components/results/helpers';
import { ge } from '@/pdv/analytics'

export default {
	name: 'qa-shareable',
	props: ['answer', 'question', 'display', 'datum', 'current', 'data', 'quick', 'important', 'id'],
	data: function () {
		return {
			show: true,
			preview: true,
			width: 400,
			bg: true,
			imagedata: null,
			fontsize: 40,
			txt: null,
			enums: useEnums(),
			image: [null, null, null, null],
			splits: []
		}
	},
	computed: {
	},
	methods: {
		round,
		truncate,
		number, indicator, date, url,
		czechify, 
		onResize: function () {
			this.width = this.$el.getBoundingClientRect().width;
		},
		snapshot: function (ev) {
			this.preview = false;
			while (this.$refs.canvas.children.length > 0) {
				this.$refs.canvas.children[0].remove();
			}

			setTimeout(() => {
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

					ge({
						event: "quote-generated",
						value: this.data.pointer + ':' + this.id
					})
				})
			}, 500);

		},
		destroy: function () {
			this.preview = true;
			this.imagedata = null;

			while (this.$refs.canvas.children.length > 0) {
				this.$refs.canvas.children[0].remove();
			}
		}
	},
	mounted: function () {
		setTimeout(() => {
			this.show = true
		}, 150)
		this.onResize();
		window.addEventListener("resize", () => this.onResize());
		this.txt = this.answer;

		if (this.current.NAZEV) {
			this.image[3] = logoByItem(this.current, this.data);
		} else {
			if (con(this.current.$data, 'photo')) {
				this.image[0] = con(this.current.$data, 'photo', null, null, true).value;
				this.image[1] = logoByItem(this.current.$strana[0], this.data);

				if (this.current.$strana[0].VSTRANA != this.current.PSTRANA && this.current.PSTRANA != 99) {
					this.image[2] = logoByItem(this.current, this.data, 'PSTRANA');
				}
			} else {
				this.image[3] = logoByItem(this.current.$strana[0], this.data);
				if (this.current.$strana[0].VSTRANA != this.current.PSTRANA && this.current.PSTRANA != 99) {
					this.image[1] = logoByItem(this.current, this.data, 'PSTRANA');
				}
			}
		}

		this.splits = this.answer ? this.answer.split('<br>').filter(x => x != '') : this.answer;

		if (!this.answer) this.fontsize = 64;
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
