import {useEngagement} from '@/stores/engagement';
import ReportForm from '@/components/report-form/do.vue';

export default {
	name: 'EngagementThanks',
	data: function () {
		return {
			amount: null,
			width: window.innerWidth,
		}
	},
	components: {
		ReportForm
	},
	computed: {
		engagement: function () {
			return useEngagement();
		},
		used: function () {
			return this.engagement.used(this.$route.fullPath, 'thanks');
		}
	},
	methods: {
		click: function (value) {
			this.engagement.add(this.$route.fullPath, 'thanks', value, 'Posílám díky');
		}
	}
};
