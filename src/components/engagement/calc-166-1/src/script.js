import {useEngagement} from '@/stores/engagement';
import {useData} from '@/stores/data';
import {logoByItem} from '@/components/results/helpers';
import {processParty} from '@/components/engagement/calc-166-1/calc';

export default {
	name: 'EngagementCalc1',
	props: ['hash', 'id', 'enghash'],
	data: function () {
		return {
			answers: [],
			results: [],
			important: 2,
			index: 0,
			step: 0
		}
	},
	components: {},
	computed: {
		$store: function () {
			return useData()
		},
		engagement: function () {
			return useEngagement();
		},
		data: function () {
			return this.$store.getters.pdv('engagement/psp25-calc-prep');
		}
	},
	methods: {
		logoByItem,
		start_calc: function () {
			this.step = 1;
		},
		end_calc: function () {
			this.toggle_footer(false);
			this.send_results();
		},
		toggle_footer: function (add) {
			if (add) {
				document.querySelector('#app').classList.add('hide-footer');
			} else {
				document.querySelector('#app').classList.remove('hide-footer');
			}
		},
		add_result: function (id, answer, importance, autostep) {

			var ans = this.answers.find(x => x.id === id);

			if (!ans) {
				ans = {id, answer, importance};
				this.answers.push(ans);
			}

			ans.answer = answer;
			ans.importance = importance;

			this.important = 2;

			if (autostep) {
				if (this.index < 39) {
					this.index++;
				} else {
					this.step = 2;
				}
			} 
		},
		go_index: function (index) {
			this.index = index;
			window.scrollTo(0, 1);
		},
		demo: function () {
			for (var i = 0; i < 40; i++) {
				var ans = {id: this.data.questions[i].id, answer: Math.floor(Math.random() * 4) + 1, importance: Math.floor(Math.random() * 3) + 1};
				this.answers.push(ans);
			}
			this.step = 3;
		},
		send_results: function () {
			
			var result = {
				answers: this.answers.map(x => [x.id, x.answer, x.importance]),
				anyimp: !!this.answers.find(x => x.importance != 2),
				parties: []
			};

			this.data.parties.forEach(party => {
				var pp = processParty(party, this.data, result);

				if (pp) result.parties.push(pp);
			});

			result.parties.sort((a, b) => b.res - a.res);

			this.engagement.add(this.$route.fullPath, this.enghash, JSON.stringify(result), 'Odesílám výsledky', (token) => this.$router.push('/volby/' + this.hash + '/' + this.id + '/kalkulacka/vysledek/' + token));
		}
	},
	mounted: function () {
		this.toggle_footer(true);
	},
	beforeUnmount: function () {
		this.toggle_footer(false);
	}
}