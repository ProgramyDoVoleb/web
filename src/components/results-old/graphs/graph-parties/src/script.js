import LogoItem from "@/components/logo-item/do";
import {createColorByName, checkCandidateName} from "@/store/helpers";

export default {
	name: 'results-graph-parties',
	props: ['data', 'local'],
	data: function () {
		return {
			loaded: false
		}
	},
	components: {
		LogoItem
	},
	methods: {
		checkCandidateName,
		coef: function (local) {
			var max = 0;

			this.data.forEach(result => {
				if (local === true) {
					if (result.local.pct > max) max = result.local.pct;
				} else {
					if (result.pct > max) max = result.pct;
				}
			})

			return 100 / max * .95;
		},
		color: function (party, name) {
			var color = party.color;

			if (party.color === "#aaa" && party.coalition) {
				var arr = [];
				var clr = [];

				party.coalition.forEach(reg => {
					arr.push(this.$store.getters.getPartyByReg(reg).color);
				});

				arr.forEach((a, i) => {
					clr.push(a + " " + i / (arr.length - 1) * 100 + "%");
				});

				var css = "linear-gradient(20deg, " + clr.join(", ") + ")";

				return css;

			} else if (party.reg === 80 || party.reg === 90) {
				return createColorByName(name);
			} else {
				return party.color;
			}
		}
	},
	computed: {
		showCount: function () {
			return this.data.length - this.rest.count + (this.rest.count > 0 ? 1 : 0)
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

			this.data.forEach(party => {
				if (party.pct < 3) {
					obj.count++;
					obj.votes += party.votes;
					obj.pct += party.pct;

					if (this.coef2 != 1) {
						obj.local.votes += party.local.votes;
						obj.local.pct += party.local.pct;
					}
				}
			});

			obj.pct = Math.round(obj.pct * 100) / 100;
			obj.local.pct = Math.round(obj.local.pct * 100) / 100;

			return obj;
		}
	},
	mounted: function () {
		this.loaded = true;

		setTimeout(() => {
			this.$el.querySelectorAll('.graph-bar').forEach(el => el.classList.remove("zero"));
		}, 200);
	}
};
