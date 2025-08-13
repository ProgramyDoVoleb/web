import CtaGetAdmin from '@/components/cta/get-admin/do.vue';
import CtaQuestions from '@/components/cta/questions/do.vue';
import CtaCalc from '@/components/cta/calc/do.vue';
import CtaSupportShort from '@/components/cta/support-short/do.vue';
import CtaGuide from '@/components/cta/guide/do.vue';
import CtaHowTo from '@/components/cta/howto/do.vue';

export default {
	name: 'top-tasks',
	components: {
		CtaGetAdmin, 
		CtaQuestions, 
		CtaSupportShort, 
		CtaGuide, 
		CtaHowTo,
		CtaCalc
	}
};