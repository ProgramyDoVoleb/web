import ElectionSimulationImperiali2021 from '@/components/election-simulation-imperiali-2021/do.vue'

import {color, number, round, date, con} from '@/pdv/helpers';
import {db, results2021, coefs} from "@/components/election-simulation-imperiali-2021/helpers/votes-imperiali-2021";
import {useData} from '@/stores/data';
import { useEnums } from '@/stores/enums';
import {ga} from '@/pdv/analytics';

export default {
	name: 'layout-election-simulation',
	props: [],
	data: function () {
		return {
			enums: useEnums(),
			type: -3,
			form: {
				hash: undefined,
				short: null,
				color: "#88888a",
				rs: 0,
				preRS: 0,
				coal: 1
			},
			defined: {
				data: {
					parties: []
				},
				run: {
					distribution: "basic"
				}
			},
			complex: {
				tick: 0,
				attendance: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				valid: [100,100,100,100,100,100,100,100,100,100,100,100,100,100,100],
				parties: [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]]
			},
			useDefined: false,
			useComplex: false,
			showValid: false,
			tick: 0
		}
	},
	components: {
		ElectionSimulationImperiali2021
	},
	computed: {
		$store: function () {
			return useData()
		},
		db: function () {
			return db[0]
		},
		parties: function () {
			return this.$store.getters.pdv('parties/1,5,7,47,53,166,714,720,721,768,1114,1227,1245,1350,1327,1265,1487,1178');
		},
		polls: function () {
			var res = this.$store.getters.pdv('polls/all');
			var d = null;

			if (res) d = {
				list: res.list.filter(x => x.pollofpolls && x.pollofpolls === 1)
			};

			return d;
		},
		votes: function () {
			var regions = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
			var total = 0;
			var att = 0;
			var max = this.db.votersInRegions.reduce((a, b) => a + b, 0) + this.db.overseasCount;

			for (var i = 0; i < 14; i++) {
				regions[i] = Math.floor(this.db.votersInRegions[i] * this.complex.attendance[i] * this.complex.valid[i] / 10000);
			}
			regions[14] = Math.floor(this.db.overseasCount * this.complex.attendance[14] * this.complex.valid[14] / 10000);

			regions.forEach((r, i) => regions[i] = round(r, 4));

			total = regions.reduce((a, b) => a + b, 0);

			att = Math.ceil(10000 * total / max) / 100;

			var tick = this.complex.tick;

			return {regions, total, att, max, tick};
		},
		results: function () {

			var list = [];

			if (this.votes.total > 0) {


				this.complex.parties.forEach((party) => {
					var o = {
						region: [],
						regpct: [],
						votes: 0,
						pct: 0
					}
	
					party.forEach((val, index2) => {
						var region = Math.ceil(val * this.votes.regions[index2] / 100);

						o.votes += region;
						o.region.push(region);
						o.regpct.push(val);
					});
	
					o.pct = Math.ceil(10000 * o.votes / this.votes.total) / 100;
	
					list.push(o);
				})
			}

			return list;
		}
	},
	methods: {
		number, date, con,
		formClear: function () {
			this.form.hash = null;
			this.form.short = null;
			this.form.color = "#88888a";
			this.form.rs = 0;
			this.form.preRS = 0;
			this.form.coal = 1;
		},
		formAdd: function (complex) {
			var o = {
				hash: this.form.hash ? this.$getParty(this.form.hash).VSTRANA : null,
				short: this.form.short,
				// color: color(this.form.short || 'aaa') : this.form.color,
				rs: this.form.rs,
				preRS: this.form.rs
			};

			if (this.form.color) {
				o.color = this.form.color
			} else {
				o.color = color(o.short);

				if (o.hash) o.color = con(this.$getParty(this.form.hash).$data, 'color', '#aaaaaa');
			}

			if (this.form.coal) {
				o.coalition = [];

				for (var i = 0; i < this.form.coal; i++) {
					o.coalition.push(this.$getParty(1).VSTRANA);
				}
			}

			this.defined.data.parties.push(o);

			if (complex) {
				// console.log(this.form);
				this.complexSetParty(this.defined.data.parties.length - 1, this.form.preRS || 0)
			}
			this.formClear();
		},
		pollSet: function (poll, complex) {
			while (this.defined.data.parties.length > 0) this.defined.data.parties.pop();

			poll.entries.forEach(entry => {

				// console.log(entry, this.$getParty(entry.party));

				if (entry.value >= 5) {
					this.partiesAdd(entry.party, this.$getParty(entry.party).ZKRATKA, con(this.$getParty(entry.party).$data, 'color', '#aaaaaa'), entry.value, this.$getParty(entry.party).POCET, complex);
				}			

				// var o = {
				// 	hash: entry.party,
				// 	short: this.$getParty(entry.party).ZKRATKA,
				// 	color: this.$getParty(entry.party).color[0] ? this.$getParty(entry.party).color[0].value : '#aaaaaa',
				// 	coal: this.$getParty(entry.party).POCET,
				// 	rs: entry.value,
				// 	preRS: entry.value
				// };

				// if (o.coal > 1) {
				// 	o.coalition = this.$getParty(entry.party).SLOZENI.split(',').map(x => Number(x));
				// }

				// this.defined.data.parties.push(o);
			});

			if (complex) {
				// console.log(this.form);
				this.complexSetParty(this.defined.data.parties.length - 1, this.form.preRS || 0)
			}
			this.formClear();
		},
		formUse: function () {

			this.defined.data.attendanceCustom = undefined;
			this.defined.data.attendanceVotersInRegister = undefined;
			this.defined.data.attendanceCount = undefined;
			this.defined.data.attendanceSum = undefined;

			this.useDefined = true;
			this.tick++;

			document.querySelector('#scrollHereAfterCustomSetting').scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
		},
		complexSet: function (year) {
			var i;

			if (year) {
				for (i = 0; i < 15; i++) {
					if (i === 5) {
						this.complex.attendance[i] = Math.floor((this.db.voters[i] - this.db.overseasVotes) / this.db.votersInRegions[i] * 10000) / 100
					} else if (i < 14) {
						this.complex.attendance[i] = Math.floor(this.db.voters[i] / this.db.votersInRegions[i] * 10000) / 100
					} else {
						this.complex.attendance[i] = Math.floor(this.db.overseasVoters / this.db.overseasCount * 10000) / 100
					}
				}

				this.setValid(2021);
			} else {
				for (i = 0; i < 15; i++) {
					this.complex.attendance[i] = 0;
				}
			}

			this.$nextTick();
			this.complex.tick++;
		},
		complexSetParty: function (index, value) {
			for (var i = 0; i < 15; i++) {
				this.complex.parties[index][i] = value || Number(this.defined.data.parties[index].preRS);
			}
			this.complex.tick++;

		},
		complexUse: function () {

			this.defined.data.parties.forEach((party, index) => {
				party.sum = this.results[index].total;
				party.sumAll = party.sum;
				party.rs = this.results[index].pct;
				party.votes = [];
				party.regpct = [];

				for (var i = 0; i < 14; i++) {
					var sum = this.results[index].region[i] + (i === 5 ? this.results[index].region[14] : 0);
					// var att = i === 5 ? Math.ceil(10000 * sum / (this.votes.regions[index] + (i === 5 ? this.votes.regions[14] : 0))) / 100 : this.complex.parties[index][i];
					var att = this.complex.parties[index][i];

					party.votes.push(sum);
					party.regpct.push(att);

					// console.log(party.regpct);
				}
			});

			this.defined.data.attendanceCustom = [];
			this.defined.data.attendanceVotersInRegister = [];
			this.defined.data.attendanceCount = [];
			this.defined.data.attendanceSum = this.votes.total;

			for (var i = 0; i < 14; i++) {
				var att = this.votes.regions[i] + (i === 5 ? this.votes.regions[14] : 0);
				var voters = this.db.votersInRegions[i]  + (i === 5 ? this.db.overseasCount : 0);
				var ac = i === 5 ? (10000 * att / voters) / 100 : this.complex.attendance[i];
				
				this.defined.data.attendanceVotersInRegister.push(voters);
				this.defined.data.attendanceCustom.push(ac);
				this.defined.data.attendanceCount.push(att);
			}

			this.defined.data.attendance = (10000 * this.votes.total / this.db.votersInRegions.reduce((a, b) => a + b, this.db.overseasCount)) / 100;
			this.defined.run.distribution = "basic"

			this.useDefined = true;
			this.tick++;

			document.querySelector('#scrollHereAfterCustomSetting').scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
		},
		partiesAdd: function (hash, short, color, rs, coal, complex) {
			this.defined.data.parties.push({short, rs, color: color || color(short), preRS: rs, hash, coal: coal || 1});
			if (complex) {
				this.complexSetParty(this.defined.data.parties.length - 1, rs || 0)
			}
			this.tick++;
		},
		partiesSet: function (type, complex) {
			while (this.defined.data.parties.length > 0) this.defined.data.parties.pop();

			var list;

			if (type === 1) {
				list = [
					[1327, 27.79, 3, '#00a'],
					[1350, 15.62, 2, '#000'],
					[768, 27.12], 
					[7,4.65],
					[47,3.6],
					[1245,4.68],
					[1227,2.76],
					[1114,9.56],
					[5,0.99]
				]	
			}

			if (type === 2) list = [[768, 29.5], [53, 20], [720, 11], [1114, 8], [166, 5.5], [7, 5], [721, 4], [1245, 3.5], [1, 3], [1265, 3]];
			if (type === 3) list = [[768, 29.5], [1327, 27.5, 3, '#00a'], [720, 10.5], [1114, 8], [166, 5.5], [7, 5], [1245, 3.5], [1265, 3], [47, 2.5]];

			list.forEach(party => {
				// console.log(party);
				if (typeof party[0] === 'number') {
					this.partiesAdd(party[0], this.$getParty(party[0]).ZKRATKA, this.$getParty(party[0]).$data.color[0] ? this.$getParty(party[0]).$data.color[0].value : '#aaaaaa', party[1], party[2], complex);
				} else {
					this.partiesAdd(null, party[0], party[3], party[1], party[2], complex);
				}
			})

			if (type === 1 && complex) {

				[3, 4, 0, 1, 2, 5, 6, 7, 8].forEach((party, pindex) => {
					results2021[party].votes.forEach((votes, index) => {
						if (index === 5) {
							this.complex.parties[pindex][index] = (votes - results2021[party].overseas) / this.votes.regions[index] * 100;
						} else {
							this.complex.parties[pindex][index] = votes / this.votes.regions[index] * 100;
						}						
					});
					this.complex.parties[pindex][14] = results2021[party].overseas / this.db.overseasVotes * 100;

					this.complex.parties[pindex].forEach((r, i) => this.complex.parties[pindex][i] = round(r, 4));
				});
			}
		},
		setValid: function (year) {
			var i;

			if (year === 2021) {
				for (i = 0; i < 14; i++) {
					this.complex.valid[i] = this.db.votes[i] / this.db.voters[i] * 100;
				} 
				this.complex.valid[14] = this.db.overseasVotes / this.db.overseasVoters * 100;

				this.complex.valid.forEach((r, i) => this.complex.valid[i] = round(r, 4));
			}
			if (year === 100) {
				for (i = 0; i < 15; i++) {
					this.complex.valid[i] = 100;
				}
			}
			this.complex.tick++;
		},
		$getParty: function (id) {
			return this.parties ? this.parties.list.find(x => x.VSTRANA === id) : {VSTRANA: 0, NAZEV: "---", ZKRATKA: "-", $data: {color: [], logo: []}};
		},
		balanceBasic: function () {
			this.complex.parties.forEach((res, index) => {
				var src = this.defined.data.parties[index];

				if (src) {

					for(var i = 0; i < 15; i++) {
						res[i] = src.preRS;
					}
				}
			});
		},
		balanceComplex: function () {
			this.complex.parties.forEach((res, index) => {
				var src = this.defined.data.parties[index];

				if (src) {

					var party = results2021.find(x => x.VSTRANA === src.hash);
					var coef = coefs.find(x => x.VSTRANA === src.hash);

					if (coef) {
						for(var i = 0; i < 14; i++) {
							res[i] = round(src.preRS * coef.coef[i], 2);
						}
						res[14] = src.preRS;
					} else if (party) {
						for(var i = 0; i < 14; i++) {
							res[i] = round(src.preRS * party.regpct[i] / party.rs, 2);
						}
						res[14] = party.rs;
					} else {
						for(var i = 0; i < 15; i++) {
							res[i] = src.preRS;
						}
					}
				}
			});
		}
	},
	mounted: function () {
		window.scrollTo(0, 1);
		ga("Výpočet mandátů");
		// this.$store.dispatch("ga", {title: "Výpočet mandátů"});
		if (this.polls) {
			this.type = 0;
			this.complexSet(2021);
		}
	},
	watch: {
		type: function () {
			if (this.type > -1 && this.polls) {
				this.pollSet(this.polls.list[this.type], true);

				// setTimeout(() => {
					this.balanceComplex(); 
					this.complexSet(2021);
					this.complexUse();
				// }, 1000);
			}
		},
		polls: function () {
			if (this.type === -3) this.type = 0;
		}
	}
};
