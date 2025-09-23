import {useEngagement} from '@/stores/engagement';
import questions from './questions';

export default {
	name: 'EngagementCalc166',
	props: ['hash'],
	data: function () {
		return {
			questions,
			answers: [],
			step: 0,
			index: 0
		}
	},
	components: {},
	computed: {
		engagement: function () {
			return useEngagement();
		},
		result: function () {

			var points = this.questions.reduce((x, y) => x + y.options.reduce((a, b) => a + (this.answers[this.questions.indexOf(y)].indexOf(y.options.indexOf(b)) > -1 === y.correct.indexOf(y.options.indexOf(b)) > -1 ? 1 : 0), 0), 0);
			var max = this.questions.reduce((x, y) => x + y.options.length, 0);
			var pct = Math.round(points / max * 100);

			return {
				points, max, pct
			}
		}
	},
	methods: {
		click_next: function (id) {
			this.index = id;
			window.scrollTo(0, 1);
		},
		click_final: function () {
			this.step = 2;
			this.send_results();
			window.scrollTo(0, 1);
		},
		toggle_answer: function (index, answer) {
			if (this.answers[index].indexOf(answer) > -1) {
				this.answers[index].splice(this.answers[index].indexOf(answer), 1);
			} else {
				this.answers[index].push(answer);
			}
		},
		toggle_footer: function (add) {
			if (add) {
				document.querySelector('#app').classList.add('hide-footer');
			} else {
				document.querySelector('#app').classList.remove('hide-footer');
			}
		},
		send_results: function () {
			var result = {
				total: this.result.pct,
				answers: this.answers				
			};
			this.engagement.add(this.$route.fullPath, this.hash || 'psp25-quiz-1', JSON.stringify(result), 'Odesílám výsledky');
		}
	},
	mounted: function () {
		this.answers = [];
		for (var i = 0; i < 15; i++) {
			this.answers.push([]);
		}
		this.toggle_footer(true);
	},
	beforeUnmount: function () {
		this.toggle_footer(false);
	}
}