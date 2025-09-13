import {ga} from '@/pdv/analytics';
import { cdn } from '@/stores/core';
import Calc1 from '@/components/engagement/calc-166-1/do.vue'

export default {
	name: 'layout-activity-poll1',
	props: ['hash', 'id'],
	data: function () {
		return {
			cdn
		}
	},
  components: {
	Calc1
  },
  mounted: function () {
    window.scrollTo(0, 1);
    ga("Kalkulačka");
  }
};
