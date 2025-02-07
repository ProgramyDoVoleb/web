import {date, number, truncate, color, indicator, con, round} from "@/pdv/helpers";
import ElectionSimulationImperiali2021 from '@/components/election-simulation-imperiali-2021/do.vue';
import GraphMandates from '@/components/results/graph/mandates-apex/do.vue'
import {useData} from '@/stores/data';
import {db, results2021, coefs} from "@/components/election-simulation-imperiali-2021/helpers/votes-imperiali-2021";

export default {
	name: 'PollsPreview',
	props: ['poll', 'previous', 'parties_generic', 'both'],
	data: function () {
		return {
			showMandates: false,
			mandates: [],
			selected: []
		}
	},
	components: {
		ElectionSimulationImperiali2021,
		GraphMandates
	},
	methods: {
		date, number, truncate, color, indicator, con,
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
				data: {
					"parties":[],
					"attendanceCustom":[70.15,67.95,66.34,64.72,57.09,57.22226689261457,64.59,67.85,67.89,68.93,66.39,64.68,67.43,60.56],
					"attendanceVotersInRegister":[903239,1046147,509749,450478,230692,659149,345623,436939,406428,404630,946509,505836,467403,962930],
					"attendanceCount":[627375,706586,335822,289660,130290,377180,221521,294383,273978,277185,624268,324788,313194,578607],
					"attendanceSum":5374837,
					"attendance":64.94681087591798
				},
				run: {distribution: 'basic'}
			}

			this.poll.entries.forEach(entry => {
				var p = {
					hash: entry.party,
					preRS: entry.value,
					rs: entry.value,
					votes: [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					regpct: [],
					coal: 1,
					short: '-',
					color: '#aaa'
				}

				for (var i = 0; i < 15; i++) {
					p.regpct[i] = entry.value
				}

				var party = results2021.find(x => x.VSTRANA === entry.party);
				var coef = coefs.find(x => x.VSTRANA === entry.party);

				if (coef) {
					p.type = 'coef';
					p.node = coef;
					for(var i = 0; i < 14; i++) {
						p.votes[i] = round(db[0].votes[i] / 100 * entry.value * coef.coef[i], 1);
					}
					// p.votes[14] = 0;
				} else if (party) {
					p.type = 'party';
					p.node = party;
					for(var i = 0; i < 14; i++) {
						p.votes[i] = round(db[0].votes[i] / 100 * entry.value * party.coef[i], 1);
					}
					// p.votes[14] = 0;
				} else {
					p.type = 'new';
					for(var i = 0; i < 14; i++) {
						p.votes[i] = round(db[0].votes[i] / 100 * entry.value, 1);
					}
					// p.votes[14] = 0;
				}

				o.data.parties.push(p);
			});

			o.test = true;

			// o = {"data":{"parties":[{"short":"-","rs":34.96,"color":"#aaaaaa","preRS":35,"hash":768,"coal":1,"votes":[141348,227238,115489,108507,55595,170868,76779,102534,94906,95629,204323,124784,109054,251868],"regpct":[34.96,34.96,34.96,34.96,34.96,34.96,34.96,34.96,34.96,34.96,34.96,34.96,34.96,34.96]},{"short":"-","rs":13.07,"color":"#aaaaaa","preRS":13,"hash":53,"coal":1,"votes":[109289,105635,47149,34643,13889,38150,27070,37504,34192,36755,86836,33356,35422,62432],"regpct":[13.07,13.07,13.07,13.07,13.07,13.07,13.07,13.07,13.07,13.07,13.07,13.07,13.07,13.07]},{"short":"-","rs":10.56,"color":"#aaaaaa","preRS":10.5,"hash":720,"coal":1,"votes":[104082,83095,32105,27083,9850,35782,23503,30910,27343,27663,65548,28322,24680,47388],"regpct":[10.56,10.56,10.56,10.56,10.56,10.56,10.56,10.56,10.56,10.56,10.56,10.56,10.56,10.56]},{"short":"-","rs":8.99,"color":"#aaaaaa","preRS":9,"hash":1114,"coal":1,"votes":[27103,51793,28377,27170,15648,41918,22950,25081,24137,23284,54936,37416,33543,69838],"regpct":[8.99,8.99,8.99,8.99,8.99,8.99,8.99,8.99,8.99,8.99,8.99,8.99,8.99,8.99]},{"short":"-","rs":6.46,"color":"#aaaaaa","preRS":6.5,"hash":166,"coal":1,"votes":[49751,62462,19646,16771,8469,22151,26494,16662,15315,14053,33273,15850,22393,24070],"regpct":[6.46,6.46,6.46,6.46,6.46,6.46,6.46,6.46,6.46,6.46,6.46,6.46,6.46,6.46]},{"short":"-","rs":6.03,"color":"#aaaaaa","preRS":6,"hash":721,"coal":1,"votes":[63239,51298,20552,16163,5550,15860,9437,15720,13808,13804,46446,15005,14470,22566],"regpct":[6.03,6.03,6.03,6.03,6.03,6.03,6.03,6.03,6.03,6.03,6.03,6.03,6.03,6.03]}],"attendanceCustom":[70.15,67.95,66.34,64.72,57.09,57.22226689261457,64.59,67.85,67.89,68.93,66.39,64.68,67.43,60.56],"attendanceVotersInRegister":[903239,1046147,509749,450478,230692,659149,345623,436939,406428,404630,946509,505836,467403,962930],"attendanceCount":[627375,706586,335822,289660,130290,377180,221521,294383,273978,277185,624268,324788,313194,578607],"attendanceSum":5374837,"attendance":64.94681087591798},"run":{"distribution":"basic"}}

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
		},
		remaining: function () {
			var sum = 0;

			this.poll.entries.forEach((x, i) => {
				if (i < 8) sum += x.value;
			});

			return 100 - sum;
		}
	},
	mounted: function () {
	}
};
