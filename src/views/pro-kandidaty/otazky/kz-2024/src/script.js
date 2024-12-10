import { useCore, cdn, today } from '@/stores/core';
import {useData} from '@/stores/data';
import { useEnums } from '@/stores/enums';
import {ga} from '@/pdv/analytics';

export default {
	name: 'pro-otazky-kz24',
	data: function () {
		return {
			cdn
		}
	},
	computed: {
		$store: function () {
			return useData()
		},
		enums: function () {
			return useEnums()
		},
		questions: function () {
			return this.$store.getters.pdv('elections/specific/162/questions');
		}
	},
	mounted: function () {
		window.scrollTo(0, 1);
		ga("Volební otázky");
	}
};
