import {ga} from '@/pdv/analytics';
import { useCore, cdn, today } from '@/stores/core';
import PromoBlock from '@/components/cta/promo-block/do.vue';
import CtaSupport from '@/components/cta/support/do.vue';
import EngagementSupport from '@/components/engagement/support/do.vue';

export default {
	name: 'layout-about-fundraising',
	data: function () {
		return {
			cdn
		}
	},
	components: {
		PromoBlock,
		CtaSupport,
		EngagementSupport
	},
  mounted: function () {
    window.scrollTo(0, 1);
    ga("Podpořte Programy do voleb");
  }
};
