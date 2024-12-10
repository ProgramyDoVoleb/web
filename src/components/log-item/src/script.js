import {date} from '@/pdv/helpers';
import types from '@/stores/enums/log';

export default {
	name: 'LogItem',
	props: ['data', 'list', 'small'],
	data: function () {
		return {
			types,
			action: {
				add: 'Přidána položka',
				replace: 'Nahrazena položka',
				hide: 'Skryta položka',
				show: 'Znovuzobrazena položka',
			},
			actionSmall: {
				add: '+',
				replace: '+',
				hide: '×',
				show: '+',
			}
		}
	},
	computed: {
		item: function () {
			return this.list && this.list.find(x => x.id === Number(this.data.impact.split(':')[1]))
		}
	},
	methods: {
		date
	}
};
