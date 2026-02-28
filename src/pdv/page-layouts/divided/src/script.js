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
			if (this.$refs['asideHolder']) this.height.aside = this.$refs['asideHolder'].getBoundingClientRect().height;
			if (this.$refs['navHolder']) this.height.nav = this.$refs['navHolder'].getBoundingClientRect().height;

			var start = this.$el.getBoundingClientRect().y;
			var end = start + this.$el.getBoundingClientRect().height;
			var header = document.querySelector('header').getBoundingClientRect().height;
			var offset = 20;

			var aside = {
				position: 'fixed',
				height: this.height.aside,
				top: header
			}

			var nav = {
				position: 'fixed',
				height: this.height.nav,
				top: header
			}

			if (start > header) {
				aside.top = start;
				nav.top = start;
			}

			if (aside.height > end - header) {
				aside.top = aside.top + (end - aside.height - header);
			}

			if (nav.height > end - header) {
				nav.top = nav.top + (end - nav.height - header);
			}

			if (this.$refs['asideHolder']) this.$refs.asideHolder.style = 'position: ' + aside.position + '; top: ' + (aside.top + offset) + 'px';
			if (this.$refs['navHolder']) this.$refs.navHolder.style = 'position: ' + nav.position + '; top: ' + (nav.top + offset) + 'px';
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

		this.$nextTick(() => {
			this.resize();
		});

		for (var i = 0; i < 5; i++) {
			setTimeout(() => this.resize(), 1000 * (i + 1));
		}
		
		// this.scroll();

		// setInterval(() => this.resize(), 1000);
	}
};
