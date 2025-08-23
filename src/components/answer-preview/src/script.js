import {useData} from '@/stores/data';
import {date} from '@/pdv/helpers';

export default {
	name: 'AnswerTopicPreview',
	props: ['question', 'table', 'id', 'link'],
	data: function () {
		return {
		}
	},
	computed: {
		$store: function () {
			return useData()
		},
		data: function () {
			return this.$store.getters.pdv('pointers/qa-quick/' + this.table + ':' + this.id + ':' + this.question);
		},
		answer: function () {
			return this.data ? this.data.list[0].$odpoved : null
		}
	},
	methods: {
		date
	}
};
