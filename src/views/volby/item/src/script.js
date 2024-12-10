import {cdn} from '@/stores/core';
import { useEnums } from '@/stores/enums';
import {date} from '@/pdv/helpers';

export default {
	name: 'volby-item',
	props: ['election'],
	data: function () {
		return {
			cdn
		}
	},
	computed: {
		enums: function () {
			return useEnums()
		},
		data: function () {
			return this.enums.elections.find(x => x.key === this.election.typ);
		},
	},
	methods: {
		date
	}
};
