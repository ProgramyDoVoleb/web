import {ga} from '@/pdv/analytics';
import { cdn } from '@/stores/core';
import {useData} from '@/stores/data';
import CtaGetAdmin from '@/components/cta/get-admin/do.vue';
import CtaQuestions from '@/components/cta/questions/do.vue';
import CtaSupport from '@/components/cta/support/do.vue';
import CtaGuide from '@/components/cta/guide/do.vue';
import CtaHowTo from '@/components/cta/howto/do.vue';
import CtaSupportShort from '@/components/cta/support-short/do.vue';
import {slide} from '@/pdv/helpers';

export default {
	name: 'layout-howto',
	data: function () {
		return {
			cdn
		}
	},
	components: {
		CtaGetAdmin,
		CtaQuestions,
		CtaSupport,
		CtaSupportShort,
		CtaGuide,
		CtaHowTo
	},
	computed: {
		$store: function () {
			return useData()
		},
		elections: function () {
			var d = this.$store.getters.pdv('elections/quicklist');

			// console.log(d);
			
			return d;
		},
	},
  mounted: function () {
    window.scrollTo(1, 0);
    ga("Jak volit do Sněmovny?");

	if (location.hash) {
		setTimeout(() => slide(location.hash.split('#')[1], this.$el), 250);
	}
  }
};
