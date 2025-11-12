import {useData} from '@/stores/data';
import HeroMap from '@/components/hero-map/main/do.vue';
import { cdn, today } from '@/stores/core';
import {sortBy} from '@/pdv/helpers';

export default {
	name: 'layout-volby-okres',
	props: ['id', 'district'],
	data: function () {
		return {
			cdn
		}
	},
  components: {
	HeroMap
  },
	computed: {
		$store: function () {
			return useData()
		},
		towns: function () {
			var d = this.$store.getters.pdv('elections/specific/176/towns');

			if (d) {
				// 
			}

			return d;
		},
	},
  methods: {
	sortBy
  }
};
