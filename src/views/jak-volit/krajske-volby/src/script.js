import {ga} from '@/pdv/analytics';
import { cdn } from '@/stores/core';

export default {
	name: 'layout-how-krajske',
	data: function () {
		return {
			cdn
		}
	},
  mounted: function () {
    window.scrollTo(1, 0);
    ga("Jak volit v krajských volbách?");
  }
};
