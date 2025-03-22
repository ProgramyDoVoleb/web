import { useEngagement } from '@/stores/engagement';
import { useData } from '@/stores/data';
import { round, date } from '@/pdv/helpers';
// import questions from './questions';

export default {
	name: 'EngagementPoll',
	props: ['data', 'hash', 'headline', 'compact', 'comment', 'autosend', 'preload', 'limit'],
	data: function () {
		return {
			questions: this.data,
			form: {
				datum: new Date().toISOString(),
				answers: []
			},
			sent: false,
			asked: false
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
			return this.engagement.used(null, this.hash);
		},
		_limit: function () {
			return this.limit || 100;
		},
		results: function () {
			var loaded = this.$store.getters.pdv('engagement/list/' + this.hash);
			
			var data = {
				cache: null,
				summary: {
					count: 0,
					answers: []
				}
			};

			this.data.forEach(x => {
				var o = [];

				x.options.forEach(y => o.push(0))

				data.summary.answers.push(o);
			});

			if (loaded) {
				data.cache = loaded.cache;
				data.summary.count = loaded.list.length;

				loaded.list.forEach((x) => {
					x.forEach((y, i) => {
						y.forEach(z => {
							data.summary.answers[i][z]++;
						});
					});
				});
			}

			return data;
		},
		canAutoSend: function () {
			return this.autosend && this.questions.length === 1 && (!this.questions[0].limit || this.questions[0].limit === 1);
		}
	},
	methods: {
		round, date,
		submit: function () {
			this.engagement.add(this.$route.fullPath, this.hash, JSON.stringify(this.form.answers), 'Odesílám vaši odpověď');
		},
		toggle: function (question, answer) {
			if (this.questions[question].limit) {
				if (this.form.answers[question].indexOf(answer) > -1) {
					this.form.answers[question].splice(this.form.answers[question].indexOf(answer), 1);
				} else if (this.form.answers[question].length < (this.questions[question].limit || 1)) {
					this.form.answers[question].push(answer);
				}
			} else {
				this.form.answers[question].pop();
				this.form.answers[question].push(answer);
			}

			if (this.canAutoSend) {
				this.submit();
			}
		}
	},
	mounted: function () {
		this.data.forEach(x => {
			this.form.answers.push([]);
		});
	}
};
