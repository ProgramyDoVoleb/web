import {useData} from '@/stores/data';
import { cdn, today } from '@/stores/core';
import { useEnums } from '@/stores/enums';
import {url, date, number, truncate, domain, sortBy, sortEvents} from '@/pdv/helpers';
import {ga} from '@/pdv/analytics';
import NewsItem from '@/components/news-item/do.vue'
import NewsBlock from '@/components/news-block/do.vue'
import EvropskeVolby from '@/views/volby/detail/evropske-volby/do.vue'
import SnemovniVolby from '@/views/volby/detail/snemovni-volby/do.vue'
import KrajskeVolby from '@/views/volby/detail/krajske-volby/do.vue'
import KomunalniVolby from '@/views/volby/detail/komunalni-volby/do.vue'
import SenatniVolby from '@/views/volby/detail/senatni-volby/do.vue'
import PrezidentskeVolby from '@/views/volby/detail/prezidentske-volby/do.vue'
import ReportForm from '@/components/report-form/do.vue';
import CtaGetAdmin from '@/components/cta/get-admin/do.vue';
import CtaSupport from '@/components/cta/support/do.vue';
import CtaSupportShort from '@/components/cta/support-short/do.vue';
import EvropskeVolbyResults from '@/views/history/volby/evropske-volby/do.vue';
import SnemovniVolbyResults from '@/views/history/volby/snemovni-volby/do.vue';
import PopUp from '@/components/pop-up/do.vue';
import EditableBasic from '@/components/editable/basic/do.vue';
import EditableSuggest from '@/components/editable/suggest/do.vue';
import EditableEvent from '@/components/editable/event/do.vue';
import EditableImage from '@/components/editable/image/do.vue';
import EventItem from '@/components/event-item/do.vue'

export default {
	name: 'layout-volby-detail',
	props: ['hash', 'id'],
	data: function () {
		return {
			cdn, today,
			eventsLimit: 3,
			eventsOff: false,
			mediaLimit: 9,
			mediaLimitOff: false,
		}
	},
  components: {
	NewsItem, NewsBlock, ReportForm,
	EvropskeVolby, SnemovniVolby, KrajskeVolby, KomunalniVolby, SenatniVolby, PrezidentskeVolby,
	CtaGetAdmin, CtaSupport, CtaSupportShort,
	EvropskeVolbyResults, SnemovniVolbyResults,
	PopUp, EditableBasic, EditableSuggest, EditableEvent, EditableImage, EventItem
  },
	computed: {
		$store: function () {
			return useData()
		},
		enums: function () {
			return useEnums()
		},
		about: function () {
			var e = this.enums.elections.find(x => x.hash === this.hash);
			return {key: e.key, data: e}
		},
		elections: function () {
			return this.$store.getters.pdv('elections/type/' + this.about.key);
		},
		data: function () {
			return this.$store.getters.pdv("elections/fetch/" + this.id);
		},
		current: function () {
			var d = this.data ? this.data.list[0] : null 

			if (d) {
				ga(this.about.data.name + ', ' + (d.datum_label || (d.datum ? date(d.datum) : d.cirka)));
			}

			return d;
		},
		news: function () {
			return this.$store.getters.pdv('news/election/' + this.id);
		},
		newsmedia: function () {
			var list = [];

			if (this.news) {
				// sortBy([].concat(this.news.list, this.news.sys), 'datum', null, true, true).forEach(item => {
				sortBy([].concat(this.news.list, this.news.sys), 'datum', null, true, true).forEach(item => {
					list.push({
						source_label: item.source,
						source: item.priority === 9 ? 'https://programydovoleb.cz/novinky/' + item.id : item.source,
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

			return list.filter((x,i) => i < 8);
		},
		previous: function () {
			return this.current.predchozi;

			// return this.$store.getters.pdv("elections/fetch/" + this.current.predchozi);
		},
		previousData: function () {
			return this.previous ? this.$store.getters.pdv("elections/fetch/" + this.previous) : null
		}
	},
  methods: {
		url,
		date,
		number,
		truncate,
		domain,
		sortEvents,
		sortBy
  },
  mounted: function () {
    window.scrollTo(0, 1);
    //ga(this.about.data.name);
  },
  watch: {
	id: function () {
		window.scrollTo(0, 1);
	}
  }
};
