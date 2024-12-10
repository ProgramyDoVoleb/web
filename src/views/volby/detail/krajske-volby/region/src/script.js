import {useData} from '@/stores/data';
import { cdn, today } from '@/stores/core';
import { useEnums } from '@/stores/enums';
import {url, date, number, truncate, sortBy, domain} from '@/pdv/helpers';
import {ga} from '@/pdv/analytics';
import NewsItem from '@/components/news-item/do.vue'
import NewsBlock from '@/components/news-block/do.vue'
import KrajskeVolby from '@/views/volby/detail/krajske-volby/detail/do.vue'
import ReportForm from '@/components/report-form/do.vue'
import { colorByItem, logoByItem } from '@/components/results/helpers';
import CtaGetAdmin from '@/components/cta/get-admin/do.vue';
import CtaSupport from '@/components/cta/support/do.vue';
import KrajskeVolbyResults from '@/views/obce/volby/krajske-volby/do.vue';

export default {
	name: 'layout-volby-detail-krajske-kraj',
	props: ['id', 'region'],
	data: function () {
		return {
			cdn, today
		}
	},
  components: {
	NewsItem, NewsBlock,
	KrajskeVolby,
	ReportForm, CtaGetAdmin, CtaSupport,
	KrajskeVolbyResults
  },
	computed: {
		$store: function () {
			return useData()
		},
		enums: function () {
			return useEnums()
		},
		about: function () {
			var e = this.enums.elections.find(x => x.hash === 'krajske-volby');
			return {key: e.key, data: e}
		},
		elections: function () {
			return this.$store.getters.pdv('elections/type/' + this.about.key);
		},
		data: function () {
			return this.$store.getters.pdv("elections/fetch/" + this.id + ':' + this.region);
		},
		current: function () {
			var d = this.data ? this.data.list[0] : null 

			if (d) {
				ga(this.about.data.name + ', ' + this.enums.regions[this.region - 1] + ', ' + (d.datum_label || (d.datum ? date(d.datum) : d.cirka)));
			}

			return d;
		},
		news: function () {
			return this.$store.getters.pdv('news/only/' + this.id + ':' + this.region);
		},
		newsmedia: function () {
			var list = [];

			if (this.news) {
				sortBy([].concat(this.news.list), 'datum', null, true, true).forEach(item => {
					list.push({
						source_label: item.source,
						source: 'https://programydovoleb.cz/novinky/' + item.id,
						value: item.title,
						updated: item.datum,
						label: item.priority === 9 ? 'pdv' : 'news'
					})
				});

				this.news.media.forEach(item => {
					if (!list.find(x => x.csu_id && x.csu_id === item.csu_id)) {
						list.push(item);
					}
				});

				list = sortBy(list, 'updated', null, true, true);
			}

			return list.filter((x,i) => i < 12);
		},
		previous: function () {
			return this.current.predchozi;

			// return this.$store.getters.pdv("elections/fetch/" + this.current.predchozi);
		},
		previousData: function () {
			return this.previous ? this.$store.getters.pdv("elections/fetch/" + this.previous + ':' + this.region) : null
		},
		previousGains: function () {
			if (this.previous) {
				return this.$store.getters.pdv('elections/previous/kz/' + this.id + ':' + this.region);
			} else {
				return;
			}
		}
	},
  methods: {
		url,
		date,
		number,
		truncate,
		sortBy,
		domain,
		colorByItem, logoByItem
  },
  mounted: function () {
    window.scrollTo(0, 1);
    //ga(this.about.data.name);
  },
  watch: {
	id: function () {
		window.scrollTo(0, 1);
	},
	region: function () {
		window.scrollTo(0, 1);
	}
  }
};
