import {number, date} from '@/pdv/helpers';

export default {
	name: 'EngagementSupport',
	data: function () {
		return {
				collected: window.collectedAmount || 11827,
				max: 25000,
				datum: window.collectedDatum || '2026-07-26'
		}
	},
	methods: {
		number, date
	}
};
