import {date, number, truncate, color, indicator, con} from "@/pdv/helpers";
import {useData} from '@/stores/data';

export default {
	name: 'GraphPollsPeople',
	props: ['poll', 'previous', 'parties_generic'],
	data: function () {
		return {
			showMandates: false,
			mandates: [],
			selected: []
		}
	},
	components: {
	},
	methods: {
		date, number, truncate, color, indicator, con
	},
	computed: {
		$store: function () {
			return useData()
		},
		pointers: function () {
			var list = [];

			this.poll.entries.filter(x => x.pointer).forEach(x => {
				if (list.indexOf(x.pointer) === -1) list.push(x.pointer);
			});

			if (this.previous) {
				this.previous.entries.filter(x => x.pointer).forEach(x => {
					if (list.indexOf(x.party) === -1) list.push(x.party);
				});
			}

			return this.$store.getters.pdv('pointers/basic/' + list.join(','));
		}
	},
	mounted: function () {
	}
};
