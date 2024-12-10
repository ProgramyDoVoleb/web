import {createColorByName} from "@/common/helpers";

export default {
	name: 'results-graph-people',
	props: ['data', 'local'],
	data: function () {
		return {
			loaded: false,
			bg: []
		}
	},
	components: {},
	methods: {
		party: function (reg) {
			return this.$store.state.dynamic.partyList.find(p => p.reg === reg);
		},
		selectParty: function (item) {
			var m = this.party(item.about.member);
			var n = this.party(item.about.nominee || item.about.nomimee);

			return item.about.member === 99 ? n : m;
		},
		background: function (item) {
			if (item.about.member != 99) {
				return item.party.color;
			} else {
				return createColorByName(item.name.join(' '));
			}
		},
		coef: function (local) {
			var max = 0;

			this.data.forEach(result => {
				if (local === true) {
					if ((result.local ? result.local : {pct: 0}).pct > max) max = result.local.pct;
				} else {
					if (result.pct > max) max = result.pct;
				}
			})

			return 100 / max * .95;
		}
	},
	computed: {
		showCount: function () {
			return this.data.length - this.rest.count - (this.rest.count > 0 ? 1 : 0)
		},
		coefHigher: function () {
			return this.local === true ? (this.coef1 > this.coef2 ? this.coef2 : this.coef1) : this.coef1;
		},
		coef1: function () {
			return this.coef(false);
		},
		coef2: function () {
			if (this.local === true) {
				return this.coef(true);
			} else {
				return 1;
			}
		},
		rest: function () {
			var obj = {
				count: 0,
				votes: 0,
				pct: 0,
				local: {
					votes: 0,
					pct: 0
				}
			}

			this.data.forEach((party, index) => {
				if (index > 8) {
					obj.count++;
					obj.votes += party.votes;
					obj.pct += party.pct;

					if (this.coef2 != 1) {
						obj.local.votes += party.local.votes;
						obj.local.pct += party.local.pct;
					}
				}
			});

			obj.pct = Math.round(obj.pct * 100) / 100;
			obj.local.pct = Math.round(obj.local.pct * 100) / 100;

			return obj;
		}
	},
	mounted: function () {
		this.loaded = true;

		this.data.forEach(item => {

			var n = item.about.nominee || item.about.nomimee;

			if (item.about.member === 99 && n && [997, 998, 999].indexOf(n) > -1) {
				this.bg.push(createColorByName(item.name.join(' ')));
			} else {
				this.bg.push(item.party.color);
			}
		});

		setTimeout(() => {
			this.$el.querySelectorAll('.graph-bar').forEach(el => el.classList.remove("zero"));
		}, 200);
	}
};
