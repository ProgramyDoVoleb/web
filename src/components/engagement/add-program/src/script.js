import {useEngagement} from '@/stores/engagement';
import ReportForm from '@/components/report-form/do.vue';
import EditableBasic from '@/components/editable/basic/do.vue';
import EditableSuggest from '@/components/editable/suggest/do.vue';

export default {
	name: 'EngagementAddProgram',
	props: ['elections', 'focus', 'pointer'],
	data: function () {
		return {
			name: null,
			source: null
		}
	},
	components: {
		ReportForm,
		EditableBasic,
		EditableSuggest
	}
};
