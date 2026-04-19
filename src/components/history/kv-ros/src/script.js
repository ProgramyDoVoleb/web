import {date} from '@/pdv/helpers';
import {useData} from '@/stores/data';
import {colorByItem, sortBy, partyInCis, logoByItem} from '@/pdv/helpers';

export default {
	name: 'history-kv-ros',
	props: ['KODZASTUP', 'NAZEVZAST', 'VSTRANA', 'showUpcoming'],
	data: function () {
		return {

		}
	},
	computed: {
		$store: function () {
			return useData()
		},
		data: function () {
			return this.$store.getters.pdv('history/kv-ros/' + this.KODZASTUP + ':' + this.VSTRANA);
		}
	},
	methods: {
		date, colorByItem, sortBy, partyInCis, logoByItem
	}
};
