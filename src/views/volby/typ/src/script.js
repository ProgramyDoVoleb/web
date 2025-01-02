import {useData} from '@/stores/data';
import { cdn, today } from '@/stores/core';
import { useEnums } from '@/stores/enums';
import { useRoute } from 'vue-router'
import {url, date, number, truncate, sortBy} from '@/pdv/helpers';
import {ga} from '@/pdv/analytics';
import NewsItem from '@/components/news-item/do.vue'
import VolbyItem from '@/views/volby/item/do.vue'
import ReportForm from '@/components/report-form/do.vue';

export default {
	name: 'layout-volby-typ',
	props: ['hash'],
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
	NewsItem, VolbyItem, ReportForm
  },
	computed: {
		$store: function () {
			return useData()
		},
		enums: function () {
			return useEnums()
		},
		route: function () {
			return useRoute()
		},
		election_types: function () {
			return this.enums.elections;
		},
		about: function () {
			var e = this.enums.elections.find(x => x.hash === this.hash);
			return {key: e.key, data: e}
		},
		news: function () {
			return this.$store.getters.pdv('news/type/' + this.about.key);
		},
		newsmedia: function () {
			var list = [];

			if (this.news) {
				// sortBy([].concat(this.news.list, this.news.sys), 'datum', null, true, true).forEach(item => {
				[].concat(this.news.list, this.news.sys).forEach(item => {
					list.push(item)
				});

				list = sortBy(list, 'datum', null, true, true);
			}

			return list;
		},
		elections: function () {
			return this.$store.getters.pdv('elections/type/' + this.about.key);
		},
		list: function () {
			return this.elections ? this.elections.list.filter(x => this.radne ? x.radne === 1 : true).filter(x => this.typ ? x.typ === this.typ : true) : null
		},
		nearest: function () {
			if (!this.elections) return null;

			var regular = this.elections.list.filter(x => x.datum && x.datum > today && x.radne === 1);
			var outlook = this.elections.list.filter(x => !x.datum);
			var extra = this.elections.list.filter(x => x.datum && x.datum > today && x.radne === 0);

			return {regular: regular ? regular[regular.length - 1] : null, outlook: outlook ? outlook[0] : null, extra: extra ? extra[extra.length - 1] : null}
		}
	},
  methods: {
		url,
		date,
		number,
		truncate,
		dynamicGA: function () {
			ga({path: this.route.path, title: this.about.data.name + ": přehled, účast, výsledky"});
		}
  },
  mounted: function () {
    window.scrollTo(0, 1);
    this.dynamicGA();
  },
  watch: {
	hash: function () {
		window.scrollTo(0, 1);
    	this.dynamicGA();
	}
  }
};
