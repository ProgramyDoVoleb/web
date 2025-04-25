import {useData} from '@/stores/data';
import { useCore, cdn } from '@/stores/core';
import { useEnums } from '@/stores/enums';
import {url, date, number, truncate} from '@/pdv/helpers';
import {ga} from '@/pdv/analytics';
import SearchTown from '@/components/search-town/do.vue';

export default {
	name: 'layout-towns',
	data: function () {
		return {
			cdn
		}
	},
  components: {
	SearchTown
  },
	computed: {
		$store: function () {
			return useData()
		},
		core: function () {
			return useCore()
		},
		enums: function () {
			return useEnums()
		}
	},
  methods: {
		url,
		date,
		number,
		truncate
  },
  mounted: function () {
    window.scrollTo(0, 1);
    ga("Obce");
  }
};
