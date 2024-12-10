import {cdn} from '@/stores/core';
import { useEnums } from '@/stores/enums';
import {number, pct, reverse, round, date} from '@/pdv/helpers';
import { colorByItem } from '@/components/results/helpers';

export default {
	name: 'volby-poll',
	props: ['data'],
	data: function () {
		return {
			cdn
		}
	},
	computed: {
		dhondt: function () {
			var list = [];

			this.data.entries.forEach(x => {
				var o = {
					data: x,
					party: x.party,
					value: x.value,
					mandates: 0
				}

				list.push(o);
			});

			this.dhondtCalculate(list, 21);

			return list;
		}
	},
	methods: {
		pct, number, reverse, round, colorByItem, date,
		dhondtCalculate: function (list, mandates) {
			var arr = [];

			list.forEach(item => {
				for (var i = 1; i < mandates; i++) {
					arr.push({
						value: item.value / i,
						item
					});
				}
			})

			arr.sort((a, b) => b.value - a.value);
			arr.splice(mandates, arr.length - mandates);

			list.forEach(item => {
				item.mandates = arr.filter(x => x.item.party === item.party).length;
			});
		}
	}
};
