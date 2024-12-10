import {useData} from '@/stores/data';
import { cdn, today } from '@/stores/core';
import { useEnums } from '@/stores/enums';
import {url, date, number, truncate} from '@/pdv/helpers';
import {ga} from '@/pdv/analytics';
import NewsItem from '@/components/news-item/do.vue'
import VolbyItem from '../item/do.vue'

export default {
	name: 'layout-volby',
	data: function () {
		return {
			cdn, today,
			typ: null,
			radne: false,
			sections: [
				['Nedávné volby', '2020-00-00', today],
				['Od roku 2015', '2015-00-00', '2019-13-00'],
				['Od roku 2010', '2010-00-00', '2014-13-00'],
				['Od roku 2005', '2005-00-00', '2009-13-00'],
				['Od roku 2000', '2000-00-00', '2004-13-00'],
				['Od roku 1993', '1993-00-00', '1999-13-00'],
			]
		}
	},
  components: {
	NewsItem, VolbyItem
  },
	computed: {
		$store: function () {
			return useData()
		},
		enums: function () {
			return useEnums()
		},
		election_types: function () {
			return this.enums.elections;
		},
		news: function () {
			return this.$store.getters.pdv('news/last5');
		},
		elections: function () {
			return this.$store.getters.pdv('elections/all');
		},
		parties: function () {
			return this.$store.getters.pdv('parties/1,7,47,53,166,720,721,768,1114');
		},
		list: function () {
			return this.elections ? this.elections.list.filter(x => this.radne ? x.radne === 1 : true).filter(x => this.typ ? x.typ === this.typ : true) : null
		},
		nearest: function () {
			if (!this.elections) return null;

			var regular = this.elections.list.filter(x => x.datum && x.datum > today && x.radne === 1);
			var outlook = this.elections.list.filter(x => !x.datum);
			var extra = this.elections.list.filter(x => x.datum && x.datum > today && x.radne === 0);

			if (regular.length === 0) regular = this.elections.list.filter(x => x.cirka && x.radne === 1);

			return {regular: regular ? regular : null, outlook: outlook ? outlook[0] : null, extra: extra ? extra[extra.length - 1] : null}
		}
	},
  methods: {
		url,
		date,
		number,
		truncate,
		reverse: function (arr) {
			return arr.reverse()
		}
  },
  mounted: function () {
    window.scrollTo(0, 1);
    ga("Přehled všech voleb od roku 1993 do současnosti, včetně výhledu na příští rok");
  }
};