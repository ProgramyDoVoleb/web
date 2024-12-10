import {beautifyNumber, createColorByName} from "@/common/helpers";

export default {
	name: 'results-people-table',
	props: ['data'],
	data: function () {
		return {
			bg: []
		}
	},
	computed: {
		coef1: function () {
			return this.coef(false);
		},
		coef2: function () {
			if (this.data[0].local) {
				return this.coef(true);
			} else {
				return 1;
			}
		},
		anyLocal: function () {
			var local = false;

			this.data.some(result => {
				if (result.local) local = true;
			});

			return local;
		}
	},
	methods: {
		beautifyNumber,
		coef: function (local) {
			var max = 0;

			this.data.forEach(result => {
				if (local === true && result.local) {
					if ((result.local.pct || 0) > max) max = result.local.pct || 0;
				} else if (local === false) {
					if ((result.pct || 0) > max) max = result.pct || 0;
				}
			})

			return 100 / max * .75;
		}
	},
	mounted: function () {

		this.data.forEach(item => {

			var n = item.about.nominee || item.about.nomimee;

			if (item.about.member === 99 && n && [997, 998, 999].indexOf(n) > -1) {
				this.bg.push(createColorByName(item.name.join(' ')));
			} else {
				this.bg.push(item.party.color);
			}
		});
	}
};
