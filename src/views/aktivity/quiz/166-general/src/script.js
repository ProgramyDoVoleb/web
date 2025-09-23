import Quiz166 from '@/components/engagement/quiz-166-1/do.vue';
import {ga} from '@/pdv/analytics';

export default {
	name: 'aktivity-quiz-166-1',
	components: {
		Quiz166
	},
	mounted: function () {
	  window.scrollTo(0, 1);
	  ga('Volební kvíz');
	}
};
