import PollsPreview from '@/components/polls-preview/do.vue';
// import {date, beautifyNumber, truncate, createColorByName, indicator} from "@/common/helpers";

export default {
	name: 'PollOfPolls',
	props: ['polls', 'remap'],
	data: function () {
		return {
			
		}
	},
	components: {
		PollsPreview
	},
	computed: {
		latest: function () {
			return this.calculate(this.polls);
		}
	},
	methods: {
		// date, beautifyNumber, truncate, createColorByName, indicator,
		checkForRemap: function (party) {
			var x;

			if (this.remap) {
				x = this.remap.find(x => x[0] === party);

				console.log(x, party);
			}

			return x ? x[1] : party;
		},
		calculate: function (polls) {
			var list = [];		
			var prelist = [];	
			var parties = [];



			polls.filter(x => x.id > 227).forEach((poll, index) => {
				var o = {
					poll,
					mid: new Date((new Date(poll.to || poll.datum).getTime() + new Date(poll.from || poll.datum).getTime()) / 2),
					diff: 1,
					coef: 1,
					entries: poll.entries,
					values: [],
					final: 0
				}

				prelist.push(o);
			});

			prelist.sort((a, b) => b.mid - a.mid);

			prelist.forEach((o, index) => {
				o.diff = Math.floor((o.mid.getTime() - prelist[0].mid.getTime()) / 1000 / 3600 / 24 / 7);

				if (o.diff > -10) {
					o.coef = - (1 / (o.diff - .5));

					if (index === 0) o.coef = 1;

					o.coef = Math.floor(o.coef * 100);

					o.entries.forEach(entry => {
						o.values.push({party: this.checkForRemap(entry.party), entry: entry.value, value: entry.value * o.coef});
					});

					list.push(o);
				}

				o.values.forEach(val => {
					var party = parties.find(x => x.party === val.party);

					if (!party) {
						party = {
							party: val.party,
							values: [],
							entries: [],
							sum: 0,
							value: 0
						}

						parties.push(party);
					}

					party.sum += val.value;
					party.values.push(val.value);
					party.entries.push(val.entry);
				});
			});

			var coef = list.reduce((a, b) => a + b.coef, 0);

			parties.forEach(party => {
				party.value = Math.round(10 * party.sum / coef) / 10;
			});

			parties.sort((a, b) => b.value - a.value);

			var graph = {
				agency: 'Poll of Polls',
				datum: list[0].mid.toISOString().split('T')[0],
				entries: parties,
				type: 1,
				id: 999999
			}

			return {polls: list, parties, graph};
		}
	}
};
