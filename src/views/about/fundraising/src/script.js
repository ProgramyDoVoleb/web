import {ga} from '@/pdv/analytics';
import { useCore, cdn, today } from '@/stores/core';
import PromoBlock from '@/components/cta/promo-block/do.vue';
import CtaSupport from '@/components/cta/support/do.vue';

export default {
	name: 'layout-about-fundraising',
	data: function () {
		return {
			cdn
		}
	},
	components: {
		PromoBlock,
		CtaSupport
	},
  mounted: function () {
    window.scrollTo(0, 1);
    ga("Podpořte Programy do voleb");
  }
};
