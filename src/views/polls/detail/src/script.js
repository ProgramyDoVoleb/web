import {date, number, truncate, color, indicator, con, domain, sortBy, round} from "@/pdv/helpers";
import {useData} from '@/stores/data';
import ResultsPartiesGraph from '@/components/results/parties/graph/do.vue';
import ResultsPartiesGraphShareable from '@/components/results/parties/graph-shareable/do.vue';
import {colorByItem, logoByItem} from '@/pdv/helpers';

import GraphMandatesApex from '@/components/results/graph/mandates-apex/do.vue'
import ElectionSimulationImperiali2021 from '@/components/election-simulation-imperiali-2021/do.vue';
import {db, results2021, coefs} from "@/components/election-simulation-imperiali-2021/helpers/votes-imperiali-2025";
import {ga} from '@/pdv/analytics';

import { defineAsyncComponent } from 'vue';

export default {
	name: 'GraphPollDetail',
	props: ['id'],
	data: function () {
		return {
			mandates: [],
			mandatesPrevious: [],
			mandatesSince: [
				{hash: 768, value: 80},
				{hash: 1327, value: 52},
				{hash: 166, value: 22},
				// {hash: 1114, value: 15},
				{hash: 1114, value: 10},
				// {hash: 720, value: 18},
				{hash: 720, value: 16},
				{hash: 5, value: 2},
				{hash: 1178, value: 13},
				{hash: 53, value: 27},
				{hash: 1, value: 16},
				{hash: 721, value: 9},
				{hash: 1227, value: 2},
				{hash: 714, value: 2},
				{hash: 1265, value: 1}
			],
			selected: [],
			chartOptions: {
				chart: {
					height: 500,
					type: 'line',
					zoom: {
					  type: 'x',
					  enabled: true,
					  autoScaleYaxis: true
					},
					animations: {
					  enabled: true
					},
					locales: [{
					  "name": "cs",
					  "options": {
						"months": ["Leden", "Únor", "Březen", "Duben", "Květen", "Červen", "Červenec", "Srpen", "Září", "Říjen", "Listopad", "Prosines"],
						"shortMonths": ["Led", "Úno", "Bře", "Dub", "Kvě", "Čer", "Čvn", "Srp", "Zář", "Říj", "Lis", "Pro"],
						"days": ["Neděle", "Pondělí", "Úterý", "Středa", "Čtvrtek", "Pátek", "Sobota"],
						"shortDays": ["Ne", "Po", "Út", "St", "Čt", "Pá", "So"],
						"toolbar": {
							"exportToSVG": "Stáhnout SVG",
							"exportToPNG": "Stáhnout PNG",
							"exportToCSV": "Stáhnout CSV",
							"menu": "Menu",
							"selection": "Výběr",
							"selectionZoom": "Přiblížení",
							"zoomIn": "Přiblížit",
							"zoomOut": "Oddálit",
							"pan": "Posun",
							"reset": "Obnovit"
						}
					  }
					}],
					defaultLocale: "cs"
				},
				xaxis: {
				  type: 'datetime'
				},
				stroke: {
				  width: [5,5,4],
				  curve: 'smooth'
				},
				title: {
				  text: 'Vývoj preferencí'
				},
				markers: {
					size: 4
				},
				annotations: {
					yaxis: [
					  {
						y: 5,
						borderColor: 'var(--red)',
						label: {
						  borderColor: 'transparent',
						  style: {
							color: 'var(--red)',
							background: 'transparent'
						  },
						  text: '5% hranice'
						}
					  }
					]
				  }
			},
			series: []
		}
	},
	components: {
		ResultsPartiesGraph,
		ResultsPartiesGraphShareable,
		ElectionSimulationImperiali2021,
		GraphMandatesApex,
		VueApexCharts: defineAsyncComponent(() => import('vue3-apexcharts')),
	},
	methods: {
		date, number, truncate, color, indicator, con, domain, sortBy,
		colorByItem, logoByItem,
		setMandates: function (payload, list) {

			while (this[list || 'mandates'].length > 0) this[list || 'mandates'].pop();

			payload.forEach(item => {
				var o = item;
				var p = this.data.cis.strany.find(x => x.VSTRANA === item.hash);

				if (p) {

					o.color = colorByItem(p, this.data);
					o.short = p.ZKRATKA || '';
	
					this[list || 'mandates'].push(o);
				}
			});
		},
		toggle: function (party) {
			var index = this.selected.indexOf(party.hash);

			if (index > -1) {
				this.selected.splice(index, 1);
			} else {
				this.selected.push(party.hash);
			}
		},
		getDatum: function (poll) {
			if (poll.from && poll.to) {

				var from = new Date(poll.from).getTime();
				var to = new Date(poll.to).getTime();
				var mid = Math.round((to - from) / 2);

				var datum = new Date(from + mid).toISOString().split(' ')[0];

				return datum;
			} else {
				return new Date(new Date(poll.datum).getTime() - 1000*60*60*24*30).toISOString().split(' ')[0];
			}
		}
	},
	computed: {
		$store: function () {
			return useData()
		},
		data: function () {
			var d = this.$store.getters.pdv('polls/detail/' + this.id);

			if (d) {
				ga(d.poll.agency + ' - ' + date(d.poll.datum, 3));
				window.scrollTo(0, 1);

				if (d.history) {
					this.series = []

					d.history.parties.forEach(party => {
						var o = {
							data: [],
							name: d.cis.strany.find(x => x.VSTRANA === party.party).ZKRATKA,
							color: colorByItem(d.cis.strany.find(x => x.VSTRANA === party.party), d),
							hidden: party.entries[0].value < 3
						}

						party.entries.forEach(entry => {
							if (entry.datum > (!!d.poll.volby ? "2024-09-01" : "2000-01-01")) o.data.push({
								x: this.getDatum(entry),
								y: entry.value
							})
						});

						d.history.polls.forEach(poll => {
							if (!o.data.find(x => x.x === poll.datum)) {
								if (poll.datum > (!!d.poll.volby ? "2024-09-01" : "2000-01-01")) o.data.push({
									x: this.getDatum(poll),
									y: null
								})
							}
						});

						this.series.push(o);
					});
				}
			}

			return d;
		},
		list: function () {
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

					if (this.data.previous) {
						o.ref = {
							pct: (this.data.previous.$data.find(x => x.party === item.party && x.name === item.name) || {value: 0}).value,
							mandates: (this.data.previous.$data.find(x => x.party === item.party && x.name === item.name) || {mandates: 0}).mandates,
						}
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
					"attendanceCustom": [], // [70.15,67.95,66.34,64.72,57.09,57.22226689261457,64.59,67.85,67.89,68.93,66.39,64.68,67.43,60.56],
					"attendanceVotersInRegister": [], // [903239,1046147,509749,450478,230692,659149,345623,436939,406428,404630,946509,505836,467403,962930],
					"attendanceCount": [], // [627375,706586,335822,289660,130290,377180,221521,294383,273978,277185,624268,324788,313194,578607],
					"attendanceSum":5621717,
					"attendance":68.95
				},
				run: {distribution: 'basic'}
			}

			db[0].votersInRegions.forEach((x, i) => {
				o.data.attendanceVotersInRegister.push(x);
				o.data.attendanceCustom.push(db[0].voters / x);
			})

			db[0].votes.forEach(x => {
				o.data.attendanceCount.push(x);
			})

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
		definedPrevious: function () {
			if (!this.data || this.data.poll.type != 1 || !this.data.poll.previous) return null;

			var o = {
				data: {
					"parties":[],
					"attendanceCustom": [], // [70.15,67.95,66.34,64.72,57.09,57.22226689261457,64.59,67.85,67.89,68.93,66.39,64.68,67.43,60.56],
					"attendanceVotersInRegister": [], // [903239,1046147,509749,450478,230692,659149,345623,436939,406428,404630,946509,505836,467403,962930],
					"attendanceCount": [], // [627375,706586,335822,289660,130290,377180,221521,294383,273978,277185,624268,324788,313194,578607],
					"attendanceSum":5621717,
					"attendance":68.95
				},
				run: {distribution: 'basic'}
			}

			db[0].votersInRegions.forEach((x, i) => {
				o.data.attendanceVotersInRegister.push(x);
				o.data.attendanceCustom.push(db[0].voters / x);
			})

			db[0].votes.forEach(x => {
				o.data.attendanceCount.push(x);
			})

			this.data.previous.$data.forEach(entry => {
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
		}
	},
	mounted: function () {
	}
};
