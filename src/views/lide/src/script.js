import {useData} from '@/stores/data';
import { useCore, cdn } from '@/stores/core';
import { useEnums } from '@/stores/enums';
import {url, date, number, truncate} from '@/pdv/helpers';
import { colorByItem, logoByItem } from '@/pdv/helpers';
import {ga} from '@/pdv/analytics';
import SearchPerson from '@/components/search-person/do.vue';
import ProfilePreview from '@/components/profile-preview/do.vue';

export default {
	name: 'layout-people',
	data: function () {
		return {
			cdn
		}
	},
  components: {
	SearchPerson,
	ProfilePreview
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
		data: function () {
			var d = this.$store.getters.pdv('profile/list-higher');

			// if (d) {
			// 	d.list.forEach(item => {
			// 		item.$csu.sort((a, b) => (b.$volby.datum || "2099-12-31").localeCompare((a.$volby.datum || "2099-12-31"), 'cs'));
			// 	})
			// }

			return d;
		},
		sorted: function () {
			if (!this.data) return null;

			var res = [];

			this.data.list.forEach(x => res.push(x));
			res.sort((a, b) => (a.display.split(' ')[1]).localeCompare((b.display.split(' ')[1]), 'cs'));

			return res;
		}
	},
  methods: {
		url,
		date,
		number,
		truncate,
		colorByItem
  },
  mounted: function () {
    window.scrollTo(0, 1);
    ga("Lidé");
  }
};
