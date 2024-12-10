import {useData} from '@/stores/data';
import { useCore, cdn } from '@/stores/core';
import { useEnums } from '@/stores/enums';
import {url, date, number, truncate} from '@/pdv/helpers';
import {ga} from '@/pdv/analytics';
import SearchParty from '@/components/search-party/do.vue'

export default {
	name: 'layout-homepage',
	data: function () {
		return {
			cdn
		}
	},
  components: {
	SearchParty
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
		},
		parties: function () {
			return this.$store.getters.pdv('parties/1,5,7,47,53,166,1245,720,721,768,1114,1178,1227,1265,714');
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
    ga("Rejstřík stran");
  }
};
