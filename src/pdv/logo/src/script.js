export default {
	name: 'logo-item',
	props: ['reg', 'size', 'data', 'alt'],
	data: function () {
		return {
			windowSize: 0
		}
	},
	computed: {
		sizeValue: function () {
			if (this.size) {
				if (typeof this.size === 'object') {
					if (this.windowSize < 16 * this.size.breakpoint) {
						return this.size.small + 'rem'
					} else {
						return this.size.large + 'rem'
					}
				} else if (typeof this.size === 'string') {
					return this.size;
				} else {
					if (this.size < 10) {
						return this.size + 'rem';
					} else {
						return this.size + 'px';
					}
				}
			} else {
				return '2rem';
			}
		},
		party: function () {
			if (this.data && this.data.logo && this.data.logo.charAt(0) === '/' && this.data.logo.split('/static/').length > 1) {
				return this.data.logo;
			} else if (this.data && this.data.logo && this.data.logo.charAt(0) === 'h') {
				return this.data.logo;
			} else if ((this.data || this.$store.getters.party(Number(this.reg))).logo) {
				return this.$store.state.server + (this.data || this.$store.getters.party(Number(this.reg))).logo;
			} else {
				return 'https://data.programydovoleb.cz/obecne/strany/loga/missing.png';
			}
		},
		coalition: function () {
			if (!this.party.coalition) return null;

			var list = [];

			this.party.coalition.forEach(reg => {
				var party = this.$store.getters.party(reg.reg || reg);

				if (party) list.push(party);
			});

			return list;
		}
	},
	methods: {},
	mounted: function () {
		this.windowSize = window.innerWidth;

		window.addEventListener("resize", () => this.windowSize = window.innerWidth);
	}
};
