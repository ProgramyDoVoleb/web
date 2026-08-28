import {date} from '@/pdv/helpers';
import {useData} from '@/stores/data';
import {colorByItem, sortBy} from '@/pdv/helpers';
import { today } from '@/stores/core';

export default {
	name: 'history-kv-rk',
	props: ['JMENO', 'PRIJMENI', 'KODZASTUP', 'showUpcoming', 'id'],
	data: function () {
		return {

		}
	},
	computed: {
		$store: function () {
			return useData()
		},
		data: function () {
			return this.$store.getters.pdv('history/kv-rk/' + this.KODZASTUP + ':' + encodeURIComponent(this.PRIJMENI) + ':' + encodeURIComponent(this.JMENO));
		},
		sorted: function () {
			return sortBy(this.data.list, 'datum', null, true, true)
		},
		list: function () {
			var arr = [];
			var initialYear, initialAge;

			if (this.sorted) {
				initialYear = Number((this.sorted[0].datum || today).split('-')[0]);

				arr.push(
					this.sorted[0]
				);

				arr[0].list = [this.sorted[0].$kandidati.find(x => x.id == this.id)];

				initialAge = this.sorted[0].$kandidati.find(x => x.id == this.id).VEK;
			}

			console.log(initialYear, initialAge);

			if (this.sorted.length > 1) {
				this.sorted.forEach((el, i) => {
					if (i > 0) {
						var o = el;
						o.list = [];

						var expectedYear = Number(el.datum.split('-')[0]);
						var expectedAge = initialAge ? initialAge - (initialYear - expectedYear) : null;

						o.list = el.$kandidati.filter(x => Math.abs(Number(x.VEK) - expectedAge) < 2);

						// console.log(expectedYear, expectedAge, o);

						if (o.list.length > 0) arr.push(o);
						
					}
				})
				// Math.abs((sorted[index - 1].$kandidati[0].VEK - election.$kandidati[0].VEK) - (Number(sorted[index - 1].datum.split('-')[0]) - Number(election.datum.split('-')[0]))) < 2
			}

			return arr;
		}
	},
	methods: {
		date, colorByItem, sortBy
	}
};
