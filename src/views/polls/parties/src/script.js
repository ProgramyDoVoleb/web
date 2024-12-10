import {date, number, truncate, color, indicator, con} from "@/pdv/helpers";
// import ElectionSimulationImperiali2021 from '@/components/election-simulation-imperiali-2021/do';
// import GraphMandates from '@/components/results/graphs/graph-mandates/do'
// import {date, number, truncate, color, indicator, con} from "@/pdv/helpers";
import {useData} from '@/stores/data';
import {colorByItem} from '@/components/results/helpers';

export default {
	name: 'GraphPollsParties',
	props: ['poll', 'previous', 'parties_generic'],
	data: function () {
		return {
			showMandates: false,
			mandates: [],
			selected: []
		}
	},
	components: {
		// ElectionSimulationImperiali2021,
		// GraphMandates
	},
	methods: {
		date, number, truncate, color, indicator, con, colorByItem,
		setMandates: function (payload) {

			while (this.mandates.length > 0) this.mandates.pop();

			payload.forEach(item => this.mandates.push(item));
		},
		toggle: function (party) {
			var index = this.selected.indexOf(party.hash);

			if (index > -1) {
				this.selected.splice(index, 1);
			} else {
				this.selected.push(party.hash);
			}
		}
	},
	computed: {
		$store: function () {
			return useData()
		},
		parties: function () {
			if (this.parties_generic) return this.parties_generic;

			var list = [];

			this.poll.entries.forEach(x => {
				if (list.indexOf(x.party) === -1) list.push(x.party);
			});

			if (this.previous) {
				this.previous.entries.forEach(x => {
					if (list.indexOf(x.party) === -1) list.push(x.party);
				});
			}

			return this.$store.getters.pdv('parties/as-of/' + this.poll.datum + ';' + list.join(','));
		},
		defined: function () {
			if (!this.poll || this.poll.type != 1) return null;

			var o = {
				data: {parties: []},
				run: {distribution: 'basic'}
			}

			this.poll.entries.forEach(entry => {
				var p = {
					hash: entry.party,
					preRS: entry.value,
					rs: entry.value
				}

				o.data.parties.push(p);
			});

			return o;
		},
		circles: function () {
			if (this.mandates.length === 0) return null;

			var list = [];

			this.mandates.forEach(item => {
				for (var i = 0; i < item.value; i++) {
					list.push({color: item.color, selected: this.selected.length === 0 || this.selected.indexOf(item.hash) > -1});
				}
			});

			list.sort((a, b) => b.selected - a.selected);

			return list;
		}
	},
	mounted: function () {
	}
};
