import {useData} from '@/stores/data';

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
			return this.$store.getters.pdv('pointers/qa-single/' + this.table + ':' + this.id + ':' + this.question);
		}
	}
};
