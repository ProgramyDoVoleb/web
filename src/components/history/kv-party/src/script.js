import {date} from '@/pdv/helpers';
import {useData} from '@/stores/data';
import {colorByItem, sortBy, partyInCis, logoByItem, number} from '@/pdv/helpers';
import StatsTiny from '@/components/stats/stats-tiny/do.vue'

export default {
	name: 'history-kv-party',
	props: ['party'],
	components: {
		StatsTiny
	},
	data: function () {
		return {
			areas: [
				{'label': 'Počet nominací', ky: '$nominees'},
				{'label': 'Počet členů', ky: '$members'},
				{'label': 'Počet zastupitelstev celkem', ky: '$total'},
				{'label': 'Samostatných kandidátek', ky: '$solemn'},
				{'label': this.party.ZKRATKA + ' s nezávislými kandidáty', ky: '$withNK'},
				{'label': 'Koalic a sdružení více stran', ky: '$coal'}
			]
		}
	},
	computed: {
		$store: function () {
			return useData()
		},
		data: function () {
			return [
				{year: 2026, data: this.$store.getters.pdv('elections/activity/kv-summary/176')},
				{year: 2022, data: this.$store.getters.pdv('elections/activity/kv-summary/154')},
				{year: 2018, data: this.$store.getters.pdv('elections/activity/kv-summary/128')},
				{year: 2014, data: this.$store.getters.pdv('elections/activity/kv-summary/103')},
				{year: 2010, data: this.$store.getters.pdv('elections/activity/kv-summary/74')},
				{year: 2006, data: this.$store.getters.pdv('elections/activity/kv-summary/46')},
				{year: 2002, data: this.$store.getters.pdv('elections/activity/kv-summary/22')},
			]
		},
		loaded: function () {
			return !this.data.find(x => !x.data)
		}
	},
	methods: {
		date, colorByItem, sortBy, partyInCis, logoByItem, number,
		getValues: function (key) {
			var arr = [];

			this.data.forEach(year => {
				var item = year.data.list.find(x => x.VSTRANA === this.party.VSTRANA);

				if (item) {
					arr.push({
						label: year.year,
						value: item[key]
					})
				}
			});

			return {values: arr.reverse()};
		}
	}
};
