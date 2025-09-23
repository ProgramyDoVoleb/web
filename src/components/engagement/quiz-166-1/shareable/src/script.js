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
			// this.show = true
			this.snapshot();
		}, 450)
		this.onResize();
		window.addEventListener("resize", () => this.onResize());
		
		
	}
};
