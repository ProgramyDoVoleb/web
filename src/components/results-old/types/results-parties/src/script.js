import GraphParties from "../../../graphs/graph-parties/do";
import TableParties from "../../../tables/table-parties/do";
import TablePeople from "../../../tables/table-people/do";
import ResultsElectedList from "@/components/results/elected/list/do";

import {beautifyDate, beautifyNumber} from "@/store/helpers";

export default {
	name: 'results-parties',
	props: ['global', 'local', 'reg', 'table'],
	components: {
		TableParties, TablePeople, GraphParties, ResultsElectedList
	},
	computed: {
		globalResults: function () {
			return this.global.data.results.content || this.global.data.results;
		},
		globalEnum: function () {
			return this.global.data.global.files.find(f => f.type === "parties").content.list;
		},
		results: function () {
			var data = [];

			this.globalResults.parties.forEach(party => {
				var obj = {
					votes: party.votes,
					pct: (party.ptc || party.pct) || 0,
					id: party.id,
					reg: party.reg,
					name: party.name,
					short: party.short,
					about: this.getAbout(party.reg),
					local: this.getLocal(party.reg),
					party: this.getParty(party.reg),
					elected: [80, 90].indexOf(party.reg) > -1 ? (party.list ? party.list.length : 0) :this.getElected(party.reg)
				}

				if (obj.name === undefined) {
					obj.name = obj.about.name;
					obj.short = obj.about.short;
				}

				data.push(obj);
			});

			data.sort((a, b) => b.pct - a.pct);

			return data;
		},
		stats: function () {
			var global = {
				voters: 0,
				attended: 0,
				pct: 0
			}

			var local;

			function populate (to, from) {
				to.voters = from.voters;
				to.attended = from.attended || from.votes;
				to.pct = Math.round(10000 * to.attended / to.voters)/100;
			}

			if (this.global.data.stats) {
				global.voters = this.global.data.stats.voters;
				global.pct = this.global.data.stats.pct;
				global.attended = Math.round(global.voters * global.pct / 100);
			} else {
				populate (global, this.globalResults);
			}

			if (this.local) {
				local = {
					voters: 0,
					attended: 0,
					pct: 0
				};

				local.voters = this.local.stats.voters;
				local.pct = this.local.stats.pct;
				local.attended = Math.round(local.voters * local.pct / 100);
			}

			return {
				global,
				local
			}
		}
	},
	methods: {
		beautifyNumber,
		getElected: function (reg) {

			var party = this.globalResults.parties.find(p => p.reg === reg);

			if (party.elected) {
				return party.elected.length;
			} else if (party.list) {
				return party.list.length;
			} else {
				return 0;
			}
		},
		getParty: function (reg) {
			return this.$store.state.dynamic.partyList.find(p => p.reg === reg) || this.$store.state.dynamic.partyList.find(p => p.reg === 9999)
		},
		getAbout: function (reg) {
			return this.globalEnum.find(party => party.reg === reg);
		},
		getLocal: function (reg) {
			if (this.local && this.local.result) {
				var party = this.local.result.find(res => res.reg === reg);

				if (party) {
					return {
						votes: party.votes,
						pct: party.pct
					}
				} else {
					return {votes: 0, pct: 0}
				}
			} else {
				return undefined;
			}
		}
	}
};
