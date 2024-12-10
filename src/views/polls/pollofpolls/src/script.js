import PollsPreview from '@/components/polls-preview/do.vue';
// import {date, beautifyNumber, truncate, createColorByName, indicator} from "@/common/helpers";

export default {
	name: 'PollOfPolls',
	props: ['polls'],
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
		calculate: function (polls) {
			var list = [];			
			var parties = [];

			polls.forEach((poll, index) => {
				var o = {
					poll,
					mid: poll.mid,
					diff: 1,
					coef: 1,
					entries: poll.entries,
					values: [],
					final: 0
				}

				o.diff = Math.floor((o.mid.getTime() - polls[0].mid.getTime()) / 1000 / 3600 / 24 / 7);

				if (o.diff > -20) {
					o.coef = - (1 / (o.diff - .5));

					if (index === 0) o.coef = 1;

					o.coef = Math.floor(o.coef * 100);

					o.entries.forEach(entry => {
						o.values.push({party: entry.party, entry: entry.value, value: entry.value * o.coef});
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
				datum: polls[0].mid.toISOString().split('T')[0],
				entries: parties,
				type: 1,
				id: 999999
			}

			return {polls: list, parties, graph};
		}
	}
};
