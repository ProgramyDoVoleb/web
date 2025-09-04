import {useData} from '@/stores/data';
import { api, today } from '@/stores/core';
import { useEnums } from '@/stores/enums';
import {url, date, number, truncate, sortBy, unique, slide, domain, con, round} from '@/pdv/helpers';
import { colorByItem, logoByItem } from '@/components/results/helpers';
import {ga} from '@/pdv/analytics';
import {db, results2021, coefs} from "@/components/election-simulation-imperiali-2021/helpers/votes-imperiali-2021";
import ResultsPartiesGraphShareable from '@/components/results/parties/graph-shareable/do.vue';
import ElectionSimulationImperiali2021 from '@/components/election-simulation-imperiali-2021/do.vue';

export default {
	name: 'aktivity-guide-25-snemovna',
	props: [],
	data: function () {
		return {
			today,
			username: null,
			list: [],
			mandates: [],
			mandatesSince: [
				{hash: 768, value: 72},
				{hash: 1327, value: 71},
				{hash: 166, value: 33},
				{hash: 1114, value: 20},
				{hash: 720, value: 4}
			],
			tick: 0
		}
	},
	components: {
		ResultsPartiesGraphShareable,
		ElectionSimulationImperiali2021
	},
	computed: {
		$store: function () {
			return useData()
		},
		enums: function () {
			return useEnums()
		},
		parties: function () {
			return this.$store.getters.pdv('elections/fetch/166');
		},
		valid: function () {
			return this.list.length > 7 && this.list.find(x => x.value > 10) && this.list.reduce((a, b) => a + b.value, 0) <= 100;
		},
		data: function () {
			var d = {
				$data: [],
				agency: 'Můj tip',
				datum: today,
				amount: 1,
				type: 1
			};

			this.list.forEach(item => {
				d.$data.push({
					party: item.item.VSTRANA,
					value: item.value
				});
			});

			var datalist = {
				poll: d,
				cis: this.parties.cis
			}

			return datalist;
		},
		listOfParties: function () {
			var list = [];

			if (this.data) {
				this.data.poll.$data.forEach(item => {

					var party = item.party ? this.data.cis.strany.find(x => x.VSTRANA === item.party) : null;

					var o = {
						id: party.VSTRANA,
						label: party.NAZEV,
						short: party.ZKRATKA,
						link: '/rejstrik/' + party.VSTRANA,
						color: colorByItem(party, this.data),
						logo: logoByItem(party, this.data),
						votes: item.value,
						pct: item.value,
						mandates: item.mandates,
						passed: item.value >= 5
					}

					list.push(o);
				})
			}

			return list;
		},
		defined: function () {
			if (!this.data || this.data.poll.type != 1) return null;

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

			this.data.poll.$data.forEach(entry => {
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
	},
	methods: {
		date, sortBy, logoByItem, colorByItem, truncate, slide, unique, domain, con, url,
		toggle: function (list, id) {
			if (list.find(x => x === id)) {
				list.splice(list.findIndex(x => x === id), 1)
			} else if (list.length < 3) {
				list.push(id);
			}
		},
		swap: function (from, to) {
			this.toggle(this.partyList, from);
			this.toggle(this.partyList, to);
		},
		addItem: function (item) {
			this.list.push({
				item,
				value: 0
			});
			this.tick++;
		},
		addMainEight: function () {
			var ids = [229,227,230,231,226,234,232,236];
			this.list = [];

			ids.forEach(x => {
				this.addItem(this.parties.list[0].$strany.find(y => y.id === x));
			});
		},
		removeItem: function (item) {
			this.list.splice(this.list.findIndex(x => x.item.id === item.item.id), 1);
			this.tick++;
		},
		generate: function () {
			if (!this.valid) return;


		},
		setMandates: function (payload, list) {

			while (this[list || 'mandates'].length > 0) this[list || 'mandates'].pop();

			payload.forEach(item => {
				var o = item;
				var p = this.data.cis.strany.find(x => x.VSTRANA === item.hash);

				o.color = colorByItem(p, this.data);
				o.short = p.ZKRATKA;

				this[list || 'mandates'].push(o);
			});
		},
	},
	mounted: function () {
	  window.scrollTo(0, 1);
	  ga('Můj tip na výsledek 2025');
	},
	watch: {
	}
};
