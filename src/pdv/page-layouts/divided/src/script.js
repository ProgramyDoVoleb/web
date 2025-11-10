import ReportForm from '@/components/report-form/do.vue';
import { useCore } from '@/stores/core';

export default {
	name: 'LayoutDivided',
	props: ['keep'],
	components: {
		ReportForm
	},
	data: function () {
		return {
			core: useCore(),
			height: {
        		main: 0,
				aside: 0,
				nav: 0
			},
			offset: {
				aside: 0,
				nav: 0
			},
			scrollTop: 0
		}
	},
	computed: {
		isHuman: function () {
			return !this.core.isBanned || this.$route.path === '/' || this.$route.path.includes('o-projektu')
		}
	},
	methods: {
		scroll: function () {

			if (this.$refs['main']) this.height.main = this.$refs['main'].getBoundingClientRect().height;
			if (this.$refs['aside']) this.height.aside = this.$refs['aside'].getBoundingClientRect().height;
			if (this.$refs['nav']) this.height.nav = this.$refs['nav'].getBoundingClientRect().height;

			var start = this.$el.getBoundingClientRect().y;
			var end = start + this.$el.getBoundingClientRect().height;
			var header = document.querySelector('header').getBoundingClientRect().height;
			var offset = 20;

			// console.log(end, this.offset.aside, this.height.aside);

			if (start < header) {
				this.offset.aside = header + offset - start;
				this.offset.nav = header + offset - start;

				if (this.height.aside > end - header) {
					this.offset.aside = this.height.main - this.height.aside + header + offset;
				}

				if (this.height.nav > end - header) {
					this.offset.nav = this.height.main - this.height.nav + header + offset;
				}
			} else {
				this.offset.aside = offset;
				this.offset.nav = offset;
			}
		},
		resize: function () {
			if (this.$refs['main']) this.height.main = this.$refs['main'].getBoundingClientRect().height;
			if (this.$refs['aside']) this.height.aside = this.$refs['aside'].getBoundingClientRect().height;
			if (this.$refs['nav']) this.height.nav = this.$refs['nav'].getBoundingClientRect().height;

			this.scroll();
		},
		getPageData: function () {
			var title = document.title;
			var description = document.querySelector('meta[name="description"]');
			description = description ? description.getAttribute('content') : 'Nestranný přehled pro české volby. Strany, koalice, kandidáti, volební programy. Průzkumy, mandáty, výsledky.';

			return {title, description};
		}
	},
	mounted: function () {
		window.addEventListener("scroll", () => this.scroll());
		window.addEventListener("resize", () => this.resize());

		this.resize();
		this.scroll();

		// setInterval(() => this.resize(), 1000);
	}
};
