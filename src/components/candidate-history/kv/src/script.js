import {date} from '@/pdv/helpers';
import {useData} from '@/stores/data';
import {colorByItem, sortBy} from '@/pdv/helpers';

export default {
	name: 'candidate-history',
	props: ['JMENO', 'PRIJMENI', 'KODZASTUP', 'showUpcoming'],
	data: function () {
		return {

		}
	},
	computed: {
		$store: function () {
			return useData()
		},
		data: function () {
			return this.$store.getters.pdv('person/history-in-kv/' + this.KODZASTUP + ':' + encodeURIComponent(this.PRIJMENI) + ':' + encodeURIComponent(this.JMENO));
		}
	},
	methods: {
		date, colorByItem, sortBy
	}
};
