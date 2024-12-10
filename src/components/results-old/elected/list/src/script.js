import ResultsElectedItem from "@/components/results/elected/item/do";
import {createColorByName, checkCandidateName} from "@/store/helpers";

export default {
	name: 'results-elected-list',
	props: ['data'],
	data: function () {
		return {
			loaded: false,
			sorted: [],
			bg: [],
			party: []
		}
	},
	components: {
		ResultsElectedItem
	},
	methods: {
		prepare: function () {

			this.sorted = [];
			this.bg = [];
			this.party = [];

			this.data.forEach(item => {
				if (item.list || (item.elected && item.elected.length > 0)) this.sorted.push(item)
			});

			this.sorted.sort((a, b) => b.votes - a.votes);

			this.sorted.forEach(item => {
				if (item.reg === 90) {
					this.bg.push(createColorByName(item.name));
					this.party.push({
						name: item.name,
						type: 1
					});
				} else if (item.reg === 80) {
					this.bg.push(createColorByName(checkCandidateName(item.name)));
					this.party.push({
						name: checkCandidateName(item.name),
						type: 0
					});
				} else {

					var party = this.$store.getters.getPartyByReg(item.reg);

					this.bg.push(this.$store.getters.getGradientForCoalition(party));
					this.party.push({
						name: item.name,
						about: party,
						type: 2
					})
				}
			});
		}
	},
	mounted: function () {
		this.prepare();
	},
	watch: {
		data: function () {
			this.prepare();
		}
	}
};
