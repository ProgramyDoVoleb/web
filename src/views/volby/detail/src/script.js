import {useData} from '@/stores/data';
import { cdn, today } from '@/stores/core';
import { useEnums } from '@/stores/enums';
import {url, date, number, truncate, domain, sortBy, sortEvents, type} from '@/pdv/helpers';
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
import CtaQuestions from '@/components/cta/questions/do.vue';
import CtaSupport from '@/components/cta/support/do.vue';
import CtaSupportShort from '@/components/cta/support-short/do.vue';
import CtaGuide from '@/components/cta/guide/do.vue';
import CtaHowTo from '@/components/cta/howto/do.vue';
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
			cdn, today
		}
	},
  components: {
	NewsItem, NewsBlock, ReportForm,
	EvropskeVolby, SnemovniVolby, KrajskeVolby, KomunalniVolby, SenatniVolby, PrezidentskeVolby,
	CtaGetAdmin, CtaSupport, CtaSupportShort, CtaQuestions,
	EvropskeVolbyResults, SnemovniVolbyResults,
	PopUp, EditableBasic, EditableSuggest, EditableEvent, EditableImage, EventItem,
	CtaGuide,
	CtaHowTo
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

			if (this.news && this.current) {
				// sortBy([].concat(this.news.list, this.news.sys), 'datum', null, true, true).forEach(item => {
				sortBy([].concat(this.news.list, this.news.sys), 'datum', null, true, true).forEach(item => {
					list.push({
						source_label: item.source || 'https://programydovoleb.cz/',
						source: item.priority === 9 ? 'https://programydovoleb.cz/novinky/' + item.id : item.source,
						value: item.title,
						updated: item.datum + (item.priority === 3 ? ' 00:00:00' : ' 23:59:59'),
						label: [0, 'news', 'auto', 'comment',0,0,0,0,0,'pdv'][item.priority],
						content: item.priority === 3 ? item.content : null
					})
				});

				this.news.media.forEach(item => {
					if (!list.find(x => x.csu_id && x.csu_id === item.csu_id)) {
						list.push(item);
					}
				});

				if (this.current.$data) {
					(this.current.$data.media || []).forEach(item => {
							list.push(item);
					});
					(this.current.$data.pr || []).forEach(item => {
							list.push(item);
					});
				}

				list = sortBy(list, 'updated', null, true, true);
			}

			return list.filter((x,i) => i < 8);
		},
		linksAll: function () {
			var arr = [];

			if (this.current) {
				['web', 'link', 'wiki'].forEach(type => {
					if (this.current.$data[type]) {
						this.current.$data[type].forEach(x => {
							if (!arr.find(y => y.value === x.value || url(y.value) === url(x.value))) arr.push(x);
						});
					}
				});
			}

			arr.sort((a, b) => a.type.localeCompare(b.type, 'cs'));

			return arr;
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
		sortBy, type
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
