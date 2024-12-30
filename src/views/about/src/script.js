import {ga} from '@/pdv/analytics';
import { useCore, cdn, today } from '@/stores/core';
import ReportForm from '@/components/report-form/do.vue';

export default {
	name: 'layout-homepage',
	data: function () {
		return {
			cdn
		}
	},
  components: {
	ReportForm
  },
	computed: {
	},
  methods: {
	},
  mounted: function () {
    window.scrollTo(0, 1);
    ga("O projektu Programy do voleb");
		
		setTimeout(() => {
			if (location.hash != '') {
				this.$el.querySelector("a[name=" + location.hash.split('#')[1] + "]").scrollIntoView({behavior: "smooth", block: "center"});
			}
		}, 500);
  }
};
