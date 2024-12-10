import ReportModal from '@/components/report-modal/do.vue';

export default {
	name: 'Headline',
	props: ['level', 'headline', 'anchor', 'alert', 'collapsed', 'editable'],
	components: {
		ReportModal
	},
	computed: {
		part: function () {
			if (this.headline) {
				return this.headline;
			} else if (this.$el) {
				return this.$el.querySelector('._content').innerHTML
			} else {
				return 'stránka'
			}
		}
	}	
};
