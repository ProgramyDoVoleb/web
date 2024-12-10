import ReportForm from '@/components/report-form/do.vue';

export default {
	name: 'LayoutDivided',
	props: ['keep'],
	components: {
		ReportForm
	},
	data: function () {
		return {
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
	methods: {
		scroll: function () {
			this.scrollTop = document.documentElement.scrollTop;

			var pageTopOffset = 0;

			this.offset.aside = pageTopOffset;
			this.offset.nav = pageTopOffset;

			if (this.height.main - this.scrollTop < this.height.aside) {
				this.offset.aside = this.height.main - this.scrollTop - this.height.aside + pageTopOffset;
			}

			if (this.height.main - this.scrollTop < this.height.nav) {
				this.offset.nav = this.height.main - this.scrollTop - this.height.nav + pageTopOffset;
			}

			// if (this.offset.nav + this.height.nav > this.height.main) {
			// 	this.offset.nav = this.height.main - this.height.nav;
			// }
			//
			// if (this.offset.aside + this.height.aside > this.height.main) {
			// 	this.offset.aside = this.height.main - this.height.aside;
			// }
		},
		resize: function () {
			if (this.$refs['main']) this.height.main = this.$refs['main'].getBoundingClientRect().height;
			if (this.$refs['aside']) this.height.aside = this.$refs['aside'].getBoundingClientRect().height;
			if (this.$refs['nav']) this.height.nav = this.$refs['nav'].getBoundingClientRect().height;

			this.scroll();
		}
	},
	mounted: function () {
		window.addEventListener("scroll", () => this.scroll());
		window.addEventListener("resize", () => this.resize());

		this.resize();
		this.scroll();

		setInterval(() => this.resize(), 1000);
	}
};
