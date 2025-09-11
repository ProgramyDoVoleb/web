import {elections, attendance, votes, chairs, results2021, scrutinize, turnout, db} from '../helpers/votes-imperiali-2021';
import {number, date, con, color, unique} from '@/pdv/helpers';

import GraphMandates from '@/components/results/graph/mandates/do.vue'
import {useData} from '@/stores/data';
import { useEnums } from '@/stores/enums';

export default {
	name: 'election-simulation-imp21',
	props: ['defined', 'hide', 'tickDefined'],
	data: function () {
		return {
			enums: useEnums(),
			selectedElectionID: 0,
			selectedOverseasID: 5,
			attendanceCustom: [],
			attendanceCommon: 60,
			distribution: 'weighted',
			results: [],
			defaults: [],
			remaining: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			tick: 0,
			sourceSelectedID: 12,
			coalitions: [],
			definedTest: {
				data: { 
					// attendance: 40,
					parties: [
						{hash: 'ano-2011', rs: 25.5},
						{hash: 'ceska-strana-socialne-demokraticka', rs: 5.6},
						{hash: 'komunisticka-strana-cech-a-moravy', rs: 4.1},
						{hash: 'svoboda-a-prima-demokracie---spd', rs: 9},
						{hash: 'pirati-a-starostove', rs: 19.3, coalition: ['ceska-piratska-strana', 'starostove-a-nezavisli']},
						{hash: 'spolu-ods-kducsl-top09', rs: 20.3, coalition: ['obcanska-demokraticka-strana', 'kdu-csl', 'top-09']},
						{hash: 'trikolora-svobodni-soukromnici', rs: 3.9},
						{hash: 'prisaha', rs: 4},
						{hash: 'strana-zelenych', rs: 2},
						{hash: 'aliance-pro-budoucnost', rs: 2}
					]
				},
				run: {
					distribution: 'weighted'
				}
			},
			candRegion: -1,
			candParty: null,
			genomCoalitions: false
		}
	},
	components: {
		GraphMandates
	},
	computed: {
		$store: function () {
			return useData()
		},
		parties: function () {
			return this.$store.getters.pdv('parties/1,5,7,47,53,166,714,720,721,768,1114,1227,1245,1298,1350,1327,1265,1487,100010,1178');
		},
		polls: function () {
			return this.$store.getters.pdv('polls/last-10')
		},
		_genom: function () {
			return null; this.$store.getters.pdv('candidate/genom')
		},
		genom: function () {
			if (!this._genom || this.hide) return undefined;

			this._genom.list.sort((a, b) => (a.position || 99) - (b.position || 99));

			return this._genom;
		},
		genom2025: function () {
			if (this.hide) return undefined;

			return this.$store.getters.pdv('elections/specific/166/genom');
		},
		turnout: function () {
			return turnout(this.attendanceCustom, undefined, this.tick, this.selectedOverseasID, this.defined)
		},
		electionList: function () {
			return elections;
		},
		selectedElectionName: function () {
			return elections[this.selectedElectionID]
		},
		selectedVotesData: function () {
			return votes(this.selectedElectionID, (this.defined && this.defined.data.attendanceCount ? this.defined.data.attendanceCount : null), this.tick, this.selectedOverseasID);
		},
		selectedChairsData: function () {
			var data = this.selectedVotesData;

			return chairs(data.votes, data.perMandate, this.tick);
		},
		sum: function () {
			var s = 0;

			this.selectedChairsData.forEach(c => {
				s += c.chairs + c.extra;
			});

			return s;
		},
		firstScrutinize: function () {
			var votesForValidPartiesInRegions = [];
			var regionalImperiali = [];
			var regionalMandateNumber = [];
			var regionalDistributedSum = [];
			var totalDistributedSum = 0;
			var totalRemainingSum = 0;
			var parties = [];

			// valid votes in region
			this.enums.regions.forEach((region, index) => {
				if (region === 'xxx') return;

				votesForValidPartiesInRegions.push(this.results.reduce((a, b) => a + (b.rs < b.requires ? 0 : b.votes[index]), 0));
			});

			this.enums.regions.forEach((region, index) => {
				if (region === 'xxx') return;

				regionalImperiali.push(this.selectedChairsData[index].chairs + this.selectedChairsData[index].extra + 2);
			});

			// mandate imperiali quota in region
			votesForValidPartiesInRegions.forEach((val, index) => {
				var x = val / regionalImperiali[index];
				var roundedX = Math.floor(10 * x) / 10;
				regionalMandateNumber.push(roundedX);
			});

			this.results.forEach(party => {
				var obj = {
					party,
					region: [],
					remaining: 0
				}

				party.votes.forEach((vote, index) => {

					var o = {
						mandates: 0,
						remaining: 0,
						valid: false
					};

					if (party.rs >= party.requires) {

						o.mandates = Math.floor(vote / regionalMandateNumber[index]);
						o.remaining = Math.floor(vote % regionalMandateNumber[index]);
						o.reduced = 0;
						o.valid = true;
					}

					obj.region.push(o)
				})

				obj.mandates = obj.region.reduce((a, b) => a + b.mandates, 0);

				parties.push(obj);
			});

			this.enums.regions.forEach((region, index) => {
				if (region === 'xxx') return;

				var sum = parties.reduce((a, b) => a + b.region[index].mandates, 0);

				var overflow = sum - this.selectedChairsData[index].total;

				if (overflow > 0) {
					var list = [];

					parties.forEach(party => {
						if (party.mandates > 0 && party.region[index].mandates > 0) {
							list.push(party);
						}
					});

					list.sort((a, b) => a.region[index].remaining - b.region[index].remaining);

					var inx = 0;

					while (overflow > 0) {
						list[inx].region[index].remaining += regionalMandateNumber[index];
						list[inx].region[index].mandates--;
						list[inx].region[index].reduced++;
						overflow--;
						sum--;
						inx++;

						if (inx === list.length) inx = 0;
					}

				}

				regionalDistributedSum.push(sum);
			});

			parties.forEach(party => {
				party.remaining = party.region.reduce((a, b) => a + b.remaining, 0);
				party.mandates = party.region.reduce((a, b) => a + b.mandates, 0);
			})

			totalDistributedSum = regionalDistributedSum.reduce((a, b) => a + b, 0);

			totalRemainingSum = parties.reduce((a, b) => a + b.remaining, 0);

			return {votesForValidPartiesInRegions, regionalImperiali, regionalMandateNumber, parties, regionalDistributedSum, totalDistributedSum, totalRemainingSum}
		},
		secondScrutiny: function () {
			if (!this.firstScrutinize.totalDistributedSum) return undefined;

			var countryMandateNumber = 200 -  this.firstScrutinize.totalDistributedSum + 1;
			var countryVotingNumber = Math.floor(this.firstScrutinize.totalRemainingSum / countryMandateNumber);
			var sumDistributed = 0;

			var parties = [];

			this.firstScrutinize.parties.forEach(party => {
				var obj = {
					party: party.party,
					remaining: party.remaining,
					firstMandates: party.mandates,
					mandates: 0,
					extra: 0,
					total: 0,
					rest: 0
				}

				if (obj.remaining > 0) {
					obj.mandates = Math.floor(obj.remaining / countryVotingNumber);
					obj.rest = obj.remaining % countryVotingNumber;
				}

				parties.push(obj);
			});

			sumDistributed = parties.reduce((a, b) => a + b.mandates, 0);

			var distributionDiff = 200 -  this.firstScrutinize.totalDistributedSum - sumDistributed;

			parties.sort((a, b) => b.rest - a.rest);
			var inx = 0;

			while (distributionDiff > 0) {
				parties[inx].extra++;
				distributionDiff--;

				inx++;
				if (inx === parties.length) inx = 0;
			}

			return {
				countryMandateNumber,
				countryVotingNumber,
				parties,
				sumDistributed
			}
		},
		secondDistribution: function () {
			if (!this.secondScrutiny) return;

			var parties = [];

			this.firstScrutinize.parties.forEach(party => {
				var obj = {
					hash: party.party.hash,
					short: party.party.short,
					color: party.party.color,
					regions: []
				}

				party.region.forEach((region, index) => {
					var o = {
						index,
						remaining: region.remaining,
						mandates: {
							first: region.mandates,
							second: 0,
							total: region.mandates
						}
					}

					obj.regions.push(o);
				});

				obj.regions.sort((a, b) => b.remaining - a.remaining);

				parties.push(obj);
			});

			this.secondScrutiny.parties.forEach(party => {
				var mandatesToGive = party.extra + party.mandates;

				if (mandatesToGive > 0) {
					var p = parties.find(x => x.hash === party.party.hash);

					if (p) {
						p.mandatesToGive = mandatesToGive;

						for (var i = 0; i < mandatesToGive; i++) {
							p.regions[i].mandates.second++;
							p.regions[i].mandates.total++;
						}
					}
				}
			});

			parties.forEach(party => {
				party.regions.sort((a, b) => a.index - b.index);
				party.mandates = party.regions.reduce((a, b) => a + b.mandates.total, 0);
			});

			var regions = [];

			this.enums.regions.forEach((region, index) => {
				var obj = {
					name: region,
					index,
					mandates: parties.reduce((a, b) => a + b.regions[index].mandates.total, 0),
					parties: []
				}

				parties.forEach(party => {
					if (party.regions[index].mandates.total > 0) {
						var o = {
							hash: party.hash,
							mandates: party.regions[index].mandates.total
						}

						obj.parties.push(o);
					}
				});

				regions.push(obj);
			});

			parties.sort((a, b) => b.mandates - a.mandates);

			parties.forEach(party => {
				// party.sex = {
				// 	male: 0,
				// 	female: 0
				// }

				if (party.hash === 'spolu-ods-kducsl-top09') {
					party.members = {
						ods: 0,
						kducsl: 0,
						top09: 0
					}
				}

				if (party.hash === 'pirati-a-starostove') {
					party.members = {
						pirati: 0,
						stan: 0
					}
				}

				party.regions.forEach((reg, i) => {
					// console.log(party.hash, reg.mandates.total, i, 1, true);
					// party.sex.male += this.getSexCount(party.hash, reg.mandates.total, i, 1, true);
					// party.sex.female += this.getSexCount(party.hash, reg.mandates.total, i, 2, true);

					if (party.members) {
						if (typeof party.members.pirati === 'number') party.members.pirati += this.getNomineeCount(party.hash, reg.mandates.total, i, 720, true);
						if (typeof party.members.stan === 'number') party.members.stan += this.getNomineeCount(party.hash, reg.mandates.total, i, 166, true);
						if (typeof party.members.ods === 'number') party.members.ods += this.getNomineeCount(party.hash, reg.mandates.total, i, 53, true);
						if (typeof party.members.kducsl === 'number') party.members.kducsl += this.getNomineeCount(party.hash, reg.mandates.total, i, 1, true);
						if (typeof party.members.top09 === 'number') party.members.top09 += this.getNomineeCount(party.hash, reg.mandates.total, i, 721, true);
					}
				});
			})

			return {
				parties,
				regions,
				checksum: regions.reduce((a, b) => a + b.mandates, 0)
			}
		},
		mandateTotal: function () {
			if (!this.secondScrutiny) return undefined;

			var list = [];

			if (this.genomCoalitions) {
				this.secondDistribution.parties.forEach(party => {
					if (party.members) {
						Object.keys(party.members).forEach(key => {
							var obj = {
								party: null,
								mandates: party.members[key]
							}

							if (key === 'pirati') obj.party = this.$getParty(720);
							if (key === 'stan') obj.party = this.$getParty(166);
							if (key === 'ods') obj.party = this.$getParty(53);
							if (key === 'kducsl') obj.party = this.$getParty(1);
							if (key === 'top09') obj.party = this.$getParty(721);

							list.push(obj);
						});
					} else {
						var obj = {
							party: this.$getParty(party.hash),
							mandates: party.mandates,
						}

						obj.short = party.hash ? obj.party.short : party.short;

						list.push(obj);
					}
				});
			} else {
				this.secondScrutiny.parties.forEach(party => {
					var obj = {
						party: party.party,
						mandates: party.firstMandates + party.mandates + party.extra
					}

					list.push(obj);
				});
			}

			while (this.coalitions.length > 0) this.coalitions.pop();

			list.forEach(party => {
				if (party.mandates > 0) {
					this.coalitions.push({
						hash: party.party.hash,
						short: this.$getParty(party.party.hash).short,
						color: this.$getParty(party.party.hash).color || color('a' + Math.random() + 'c'),
						logo: this.$getParty(party.party.hash).logo,
						value: party.mandates,
						selected: false
					})
				}
			});

			this.coalitions.sort((a, b) => b.value - a.value);
			list.sort((a, b) => b.mandates - a.mandates);

			this.$emit('update', this.coalitions);

			this.tick++;

			return list;
		},

		scrutinize: function () {
			return scrutinize(this.selectedChairsData, this.results, this.tick);
		},
		over2: function () {
			return this.coalitions.reduce((a, b) => a + (b.selected ? 1 : 0), 0) > 1
		},
		coalitionSum: function () {
			return this.coalitions.reduce((a, b) => a + (b.selected ? b.value : 0), 0)
		},
		circles: function () {
			var list = [];

			var c = [];

			this.coalitions.forEach(x => c.push(x));

			c.sort((x, y) => (y.selected === x.selected) ? 0 : !y.selected ? -1 : 1);

			// console.log('a');

			c.forEach((item) => {
				var party = this.$getParty(item.hash, item.short, item.color);

				for (var a = 0; a < item.value; a++) {
					var obj = {
						name: party.name || item.short,
						color: party.color || item.color,
						selected: item.selected
					}

					list.push(obj);

					// var el = this.$refs.svg.querySelector('circle:nth-child(' + (list.length) + ')');
					// el.style.fill = obj.color;
					// el.style.opacity = obj.selected ? 1 : .05;

					// console.log(el);
				}
			});

			return list;
		}
	},
	methods: {
		number, date,
		recalc: function () {
			this.results.forEach(party => {
				party.sum = 0;

				party.regpct.forEach((pct, i) => {
					try {
						if (this.sourceSelectedID > 0) {
							party.votes[i] = results2021.find(x => x.hash === party.hash).votes[i]; // Math.round(this.turnout.voters[i] * pct / 100);
						} else if (!this.defined.data.attendanceSum) {
							party.votes[i] = Math.floor(db[0].votes[i] * party.rs / 100);
						}
						
					} catch (e) {
						if (this.sourceSelectedID > 0) {
							if (party.hash === 'obcanska-demokraticka-strana') {
								party.votes[i] = Math.round(results2021.find(x => x.hash === 'spolu-ods-kducsl-top09').votes[i] * .7);
							}
							if (party.hash === 'kdu-csl'|| party.hash === 'top-09') {
								party.votes[i] = Math.round(results2021.find(x => x.hash === 'spolu-ods-kducsl-top09').votes[i] * .15);
							}
							if (party.hash === 'ceska-piratska-strana') {
								party.votes[i] = Math.round(results2021.find(x => x.hash === 'pirati-a-starostove').votes[i] * .4);
							}
							if (party.hash === 'starostove-a-nezavisli') {
								party.votes[i] = Math.round(results2021.find(x => x.hash === 'pirati-a-starostove').votes[i] * .6);
							}
							if (party.hash === 'trikolora-hnuti-obcanu') {
								party.votes[i] = Math.round(results2021.find(x => x.hash === 'trikolora-svobodni-soukromnici').votes[i] * 1);
							}
						} else if (!this.defined.data.attendanceSum) {
							party.votes[i] = Math.floor(db[0].votes[i] * party.rs / 100); //Math.round(results2021.find(x => x.hash === 'trikolora-svobodni-soukromnici').votes[i] * 1);
						}
					}

					party.sum += party.votes[i];
				});

				if (party.sum === 0) {
					// console.log(db[0].votes);
					party.sum = Math.floor(db[0].votes.reduce((a, b) => a + b, 0) * party.rs);
				}

				party.pct = Math.round(party.sum / this.turnout.sum * 10000) / 100;
			});

			this.attendanceCustom.forEach((a, i) => {

				var regionVotes = 0;

				this.results.forEach(party => {
					regionVotes += party.votes[i];
				});

				this.remaining[i] = this.turnout.voters[i] - regionVotes;
			});

			// while (this.coalitions.length > 0) this.coalitions.pop();
			//
			// this.scrutinize.parties.forEach(party => {
			// 	if (party.sum > 0) {
			// 		this.coalitions.push({
			// 			hash: party.hash,
			// 			value: party.sum,
			// 			selected: false
			// 		})
			// 	}
			// });
			//
			// this.coalitions.sort((a, b) => b.value - a.value);

			this.tick++;
		},
		setDefaultAttendance: function () {
			while (this.attendanceCustom.length > 0) this.attendanceCustom.pop();

			attendance.forEach(a => {
				this.attendanceCustom.push(a);
			})
		},
		setDefaultResults: function () {
			results2021.forEach(r => {
				this.results.push(r);
				this.defaults.push(r);
			})
		},
		setAttendanceToCommon: function () {
			this.remaining.forEach((r, i) => {
				this.attendanceCustom[i] = this.attendanceCommon;
			});

			this.tick++;
			this.recalc();
		},
		changeDistribution: function () {
			if (this.distribution === 'basic') {
				this.redistributeWeighted();
			} else {
				this.redistributeBasic();
			}
		},
		redistributeBasic: function () {
			this.distribution = 'basic';

			this.results.forEach(party => {
				party.regpct.forEach((r, i) => party.regpct[i] = party.rs);
			});

			this.recalc();
		},
		getRedistributionCoef: function (hash, coalition) {
			var res = results2021.find(x => x.hash === hash);

			if (!res) {
				if (coalition) {
					res = {
						coef: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
					}
					coalition.forEach(hash => {
						var member = results2021.find(x => x.hash === hash);

						if (member) {
							member.coef.forEach((v, i) => {
								res.coef[i] += v;
							});
						}
					})

					res.coef.forEach((x, i) => res.coef[i] = res.coef[i] / coalition.length);
				}
			}

			if (!res) {
				res = {
					coef: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
				}
			}

			return res.coef;
		},
		redistributeWeighted: function () {
			this.distribution = 'weighted';

			this.results.forEach(party => {

				var coefs = this.getRedistributionCoef(party.hash, party.coalition);

				coefs.forEach((coef, i) => {
					party.regpct[i] = party.rs * coef;
				})
			});

			this.recalc();
		},
		redistribute: function () {
			if (this.distribution === 'weighted') {
				this.redistributeWeighted();
			}
			if (this.distribution === 'basic') {
				this.redistributeBasic();
			}
		},
		redistributeWithDelay: function () {
			this.results.forEach(party => {
				party.pct = party.rs;
			});
			this.redistribute();
		},
		parseSource: function (src) {
			if (src.data) {

				// attendance

				if (this.defined && src.data.attendanceCustom) {
					this.attendanceCustom = src.data.attendanceCustom;
					this.attendance = src.data.attendance;
				} else if (src.data.attendanceCustom && !this.defined) {
					this.selectedElectionID = 4;
					this.attendanceCustom = src.data.attendanceCustom;
				} else if (src.data.attendance && !this.defined) {
					this.selectedElectionID = 4;
					this.attendanceCommon = src.data.attendance;
					this.setAttendanceToCommon();
				} else {
					this.setDefaultAttendance();
				}

				// parties

				if (src.data.parties) {
					src.data.parties.forEach(party => {
						var obj = {
							hash: party.hash,
							short: party.short,
							pct: party.rs,
							rs: party.rs,
							requires: 5,
							color: party.color,
							regpct: party.regpct || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
							votes: party.votes || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
							coef: party.coef || this.getRedistributionCoef(party.hash, party.coalition),
							sum: 0,
							coalition: party.coalition
						}

						if (party.coalition) {
							if (party.coalition.length === 2) obj.requires = 8;
							if (party.coalition.length > 2) obj.requires = 11;
						}

						if (party.coal) {
							if (party.coal === 2) obj.requires = 8;
							if (party.coal > 2) obj.requires = 11;
						}

						this.results.push(obj);
					});
				} else {
					this.setDefaultResults();
				}

			}

			if (src.run) {
				if (src.run.attendance) {
					if (src.run.attendance === 'common') {
						this.setAttendanceToCommon();
					}
					if (src.run.attendance === 'legacy') {
						this.setDefaultAttendance();
					}
				}

				if (src.run.distribution) {
					this.distribution = src.run.distribution;
				}
			}

			this.redistribute();
		},
		setSource: function () {
			while (this.results.length > 0) this.results.pop();

			if (this.sourceSelectedID === 0) {
				this.parseSource(this.defined);
				// this.setDefaultAttendance();
			} else if (this.sourceSelectedID === 11) {
				this.parseSource(this.definedTest);
				this.setDefaultAttendance();
			} else if (this.sourceSelectedID === 12) {
				this.setDefaultResults();
				this.setDefaultAttendance();
			} else {
				var obj = {
					data: {
						parties: []
					},
					run: {
						distribution: 'weighted'
					}
				}

				var poll = this.polls.list[this.sourceSelectedID - 1];

				Object.keys(poll).forEach(key => {
					if (['agency', 'date', 'link', 'type', 'error', 'collect_from', 'collect_to', 'attendance'].indexOf(key) === -1 && poll[key]) {
						if (key === 'spolu-ods-kducsl-top09') {
							obj.data.parties.push({hash: key, rs: poll[key], coalition: ['obcanska-demokraticka-strana', 'kdu-csl', 'top-09']})
						} else if (key === 'pirati-a-starostove') {
							obj.data.parties.push({hash: key, rs: poll[key], coalition: ['ceska-piratska-strana', 'starostove-a-nezavisli']})
						} else {
							obj.data.parties.push({hash: key, rs: poll[key]});
						}
					}
				});

				this.parseSource(obj);
			}

			this.tick++;
			this.recalc();
		},
		getSexCount: function (party, limit, region, sex, keep) {
			var x = this.genom.list.filter(x => x[0] === party && (x[2] || 99) < limit + 1 && x[4] === sex && x[1] === (typeof region === 'number' ? region : x[1])).length;
			return x > 0 ? x : (keep ? 0 : '');
		},
		getNomineeCount: function (party, limit, region, nominee, keep) {
			var x = this.genom.list.filter(x => x[0] === party && (x[2] || 99) < limit + 1 && x[3] === nominee && x[1] === (typeof region === 'number' ? region : x[1])).length;
			return x > 0 ? x : (keep ? 0 : '');
		},
		changeGenomCoalitions: function () {
			this.genomCoalitions = !this.genomCoalitions;
		},
		$getParty: function (id, short, color2) {
			var item = this.parties && this.parties.list.find(x => x.VSTRANA === id) ? this.parties.list.find(x => x.VSTRANA === id) : {VSTRANA: 0, NAZEV: short, ZKRATKA: short, color: [], logo: []};

			var o = {
				reg: item.VSTRANA,
				name: item.NAZEV,
				short: item.ZKRATKA,
				color: item.VSTRANA > 0 ? con(item.$data, 'color', '#aaaaaa') : (color2 || color('a' + Math.random() + 'c')), // item.$data.color[0] ? item.$data.color[0].value : '#aaaaaa',
				logo: item.VSTRANA > 0 ? con(item.$data, 'logo') : null //item.$data.logo[0] ? item.$data.logo[0].value : null
			}

			return o;
		},
		getGenomSexCount: function (pty, sex, regionSelected) {
			var regions = regionSelected ? [regionSelected] : [1,2,3,4,5,6,7,8,9,10,11,12,13,14];
			var count = 0;
			var genom = this.genom2025.list[0];
			var party = genom.$strany.find(x => x.VSTRANA === pty.hash);

			regions.forEach(r => {
				var total = pty.regions[r-1].mandates.total;
				var sub = genom.$kandidati.filter(x => x.VOLKRAJ === r && x.KSTRANA === party.KSTRANA && x.POHLAVI === sex && x.PORCISLO <= total).length;

				count += sub;
			});

			return count;
		},
		getGenomMemberCount: function (pty, member, regionSelected) {
			var regions = regionSelected ? [regionSelected] : [1,2,3,4,5,6,7,8,9,10,11,12,13,14];
			var count = 0;
			var genom = this.genom2025.list[0];
			var party = genom.$strany.find(x => x.VSTRANA === pty.hash);

			regions.forEach(r => {
				var total = pty.regions[r-1].mandates.total;
				var sub = genom.$kandidati.filter(x => x.VOLKRAJ === r && x.KSTRANA === party.KSTRANA && x.PSTRANA === member && x.PORCISLO <= total).length;

				count += sub;
			});

			return count;
		},
		getGenomPartyMemberList: function (pty) {
			var genom = this.genom2025.list[0];
			var party = genom.$strany.find(x => x.VSTRANA === pty.hash);

			var arr = [];

			function onlyUnique(value, index, array) {
				return array.indexOf(value) === index;
			  }

			var uniqueList = [].concat(unique(genom.$kandidati.filter(x => x.KSTRANA === party.KSTRANA), 'NSTRANA'), unique(genom.$kandidati.filter(x => x.KSTRANA === party.KSTRANA), 'PSTRANA')).filter(onlyUnique);

			uniqueList.forEach(item => {
				if (item != 99)	arr.push(this.genom2025.cis.strany.find(x => x.VSTRANA === item));
			});

			return arr;
		}
	},
	mounted: function () {
		if (this.defined) {
			this.sourceSelectedID = 0;
		}

		this.setSource();

		this.tick++;
		this.recalc();

		setTimeout(() => {
			if (!this.defined) {
				this.selectedOverseasID = 5;
				// this.selectedElectionID = 0;
				// this.sourceSelectedID = 1;
				this.distribution = "weighted";

				this.setSource();

				this.tick++;
				this.recalc();
			}
		}, 1000);
	},
	watch: {
		defined: function () {
			this.sourceSelectedID = this.defined ? 0 : 12;
			this.setSource();

			this.tick++;
			this.recalc();
		},

		tickDefined: function () {
			this.sourceSelectedID = this.defined ? 0 : 12;
			this.setSource();

			this.tick++;
			this.recalc();
		},
		parties: function () {
			this.tick++;
		}
	}
};
