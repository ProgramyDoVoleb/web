import {number, lang} from '@/pdv/helpers';

export default {
	name: 'Lang',
	props: ['end', 'value'],
	computed: {
		ending: function () {
			return lang(this.value, this.end);
		}
	},
	methods: {
		number
	}
};
