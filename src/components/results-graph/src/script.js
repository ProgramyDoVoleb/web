import LogoItem from "@/common/logo-item/do";
// import ElectionSimulationImperiali from '@/components/election-simulation-imperiali/do'

export default {
	name: 'results-graph',
	props: ['data', 'mandates'],
	data: function () {
		return {
			mandate: []
		}
	},
	components: {
		LogoItem,
		// ElectionSimulationImperiali
	},
	methods: {
		anim: function () {
			this.$el.querySelectorAll('.graph-bar, .graph-icons').forEach(el => el.classList.add("zero"));

			setTimeout(() => {
				this.$el.querySelectorAll('.graph-bar, .graph-icons').forEach(el => el.classList.remove("zero"));
			}, 100);
		},
		update: function (data) {
			this.mandate = this.mandates || data;
		}
	},
	computed: {
		$: function () {
			return this.$store.getters.party;
		},
		coef: function () {
			return 100 / this.data.list[0].pct;
		},
		imperiali: function () {
			var data = {
				parties: [],
				run: {distribution: 'basic'}
			}

			this.data.list.forEach(party => {
				data.parties.push({
					hash: party.hash,
					rs: party.pct
				})
			});

			return {data};
		}
	},
	mounted: function () {
		this.anim();
	},
	watch: {
		data: function () {
			this.anim();
		}
	}
};
