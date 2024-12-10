import {beautifyNumber} from "@/common/helpers";

import GraphPeople from "../../../graphs/graph-people/do";
import GraphDuel from "../../../graphs/graph-duel/do";
import TablePeople from "../../../tables/table-people/do";

export default {
	name: 'results-people',
	props: ['global', 'local', 'reg', 'table'],
	components: {
		TablePeople, GraphPeople, GraphDuel
	},
	computed: {
		hasSecondRound: function () {
			return !!this.globalResults.round2;
		},
		globalResults: function () {
			return this.global.data.results.content || this.global.data.results;
		},
		globalEnum: function () {
			return this.global.data.global.files.find(f => f.type === "candidates").content.list;
		},
		round1: function () {
			var data = [];

			this.globalResults.round1.candidates.forEach(candidate => {
				var obj = {
					votes: candidate.votes,
					pct: candidate.pct,
					id: candidate.id,
					name: candidate.name,
					initials: this.getInitials(candidate.name),
					progress: candidate.progress,
					about: this.getAbout(candidate.id, this.reg),
					local: this.getLocal(candidate.id, 'round1')
				}

				obj.party = this.getParty(obj.about);

				data.push(obj);
			});

			data.sort((a, b) => b.pct - a.pct);


			return data;
		},
		round2: function () {
			var data = [];

			if (this.hasSecondRound === true) {

				this.globalResults.round2.candidates.forEach(candidate => {
					var obj = {
						votes: candidate.votes,
						pct: candidate.pct,
						id: candidate.id,
						name: candidate.name,
						initials: this.getInitials(candidate.name),
						progress: candidate.progress,
						about: this.getAbout(candidate.id, this.reg),
						local: this.getLocal(candidate.id, 'round2')
					}

					obj.party = this.getParty(obj.about);

					data.push(obj);
				});
			}

			data.sort((a, b) => b.pct - a.pct);

			return data;
		},
		stats: function () {
			var global = {
				round1: {
					voters: 0,
					attended: 0,
					pct: 0
				},
				round2: {
					voters: 0,
					attended: 0,
					pct: 0
				}
			}

			var local;

			function populateRound (to, from, rnd) {
				to[rnd].voters = from[rnd].voters;
				to[rnd].attended = from[rnd].attended;
				to[rnd].pct = Math.round(10000 * to[rnd].attended / to[rnd].voters)/100;
			}

			function populate (to, from) {
				populateRound(to, from, 'round1');
				if (from.round2) populateRound(to, from, 'round2');
			}

			populate (global, this.globalResults);

			if (this.local && this.local.round1) {
				local = {
					round1: {
						voters: 0,
						attended: 0,
						pct: 0
					},
					round2: {
						voters: 0,
						attended: 0,
						pct: 0
					}
				};

				populate (local, this.local);
			}

			return {
				global,
				local
			}
		}
	},
	methods: {
		beautifyNumber,
		getInitials: function (name) {
			var i = [];
			name[1].split(' ').forEach(s => i.push(s.charAt(0)));
			name[2].split(' ').forEach(s => i.push(s.charAt(0)));
			return i.join('').toUpperCase();
		},
		getParty: function (about) {
			var member = this.$store.state.dynamic.partyList.find(p => p.reg === about.member);
			var nominee = this.$store.state.dynamic.partyList.find(p => p.reg === (about.nominee || about.nomimee));

			return {
				member,
				nominee,
				bezppNZ: member.reg === 99 && [997, 998, 999].indexOf(nominee ? nominee.reg : 999) > -1,
				same: member === nominee,
				use: member && member.reg != 99 ? member : nominee,
				independent: [997, 998, 999].indexOf(nominee) > -1,
				color: member && member.reg != 99 ? member.color : (nominee ? nominee.color : '#aaa')
			};
		},
		getAbout: function (id, reg) {
			if (reg) {
				return this.globalEnum.find(person => person.id === id && person.reg === reg);
			} else {
				return this.globalEnum.find(person => person.id === id);
			}
		},
		getLocal: function (id, round) {
			if (this.local && this.local.round1) {
				var person = this.local[round].candidates.find(person => person.id === id);

				if (person) {
					return {
						votes: person.votes,
						pct: person.pct
					}
				} else {
					return undefined;
				}
			} else {
				return undefined;
			}
		}
	}
};
