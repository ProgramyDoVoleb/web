import {ga} from '@/pdv/analytics';
import { useCore, cdn, today } from '@/stores/core';
import PromoBlock from '@/components/cta/promo-block/do.vue';

export default {
	name: 'layout-about-fundraising',
	data: function () {
		return {
			cdn
		}
	},
	components: {
		PromoBlock
	},
  mounted: function () {
    window.scrollTo(0, 1);
    ga("Podpořte Programy do voleb");
  }
};
