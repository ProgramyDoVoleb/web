import { useEngagement } from '@/stores/engagement';
import { useData } from '@/stores/data';
import { round, date } from '@/pdv/helpers';
import questions from './questions';

export default {
	name: 'EngagementPoll',
	props: ['data'],
	data: function () {
		return {
			questions,
			form: {
				datum: new Date().toISOString(),
				answers: [
					[], [], [], []
				]
			},
			sent: false
		}
	},
	components: {
	},
	computed: {
		$store: function () {
			return useData()
		},
		engagement: function () {
			return useEngagement();
		},
		used: function () {
			return this.engagement.used(null, 'psp25-poll-1');
		},
		results: function () {
			var loaded = this.$store.getters.pdv('engagement/psp25-poll-1');
			var data = {
				cache: null,
				summary: {
					count: 0,
					topic: []
				}
			};

			if (loaded) {
				data.cache = loaded.cache;
				data.summary.count = loaded.summary.count;

				loaded.summary.topic.forEach(x => data.summary.topic.push(x));
			}

			if (this.used || (true && this.form.answers.find(x => x.length > 0))) {
				data.summary.count++;
				if (this.form.answers[0].length > 0) {
					if (this.form.answers[0].length === 3) {
						data.summary.topic[this.form.answers[0][0]] += 4;
						data.summary.topic[this.form.answers[0][1]] += 2;
						data.summary.topic[this.form.answers[0][2]] += 1;
					}
					if (this.form.answers[0].length === 2) {
						data.summary.topic[this.form.answers[0][0]] += 5;
						data.summary.topic[this.form.answers[0][1]] += 2;
					}
					if (this.form.answers[0].length === 1) {
						data.summary.topic[this.form.answers[0][0]] += 7;
					}
				}
			}

			return data;
		},
	},
	methods: {
		round, date,
		submit: function () {
			this.engagement.add(this.$route.fullPath, 'psp25-poll-1', JSON.stringify(this.form.answers), 'Posílám odpovědi do ankety');
		},
		toggle: function (question, answer) {
			if (questions[question].limit) {
				if (this.form.answers[question].indexOf(answer) > -1) {
					this.form.answers[question].splice(this.form.answers[question].indexOf(answer), 1);
				} else if (this.form.answers[question].length < (questions[question].limit || 1)) {
					this.form.answers[question].push(answer);
				}
			} else {
				this.form.answers[question].pop();
				this.form.answers[question].push(answer);
			}
		}
	}
};
