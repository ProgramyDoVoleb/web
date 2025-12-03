import {useData} from '@/stores/data';
import { useCore, cdn, today } from '@/stores/core';
import { useEnums } from '@/stores/enums';
import {url, date, number, truncate, domain, con, sortBy, sortEvents, unique, shuffle, untag} from '@/pdv/helpers';
import { colorByItem, logoByItem } from '@/pdv/helpers';
import {ga} from '@/pdv/analytics';
import NewsItem from '@/components/news-item/do.vue'
import NewsItemAside from '@/components/news-item-aside/do.vue'
import SearchParty from '@/components/search-party/do.vue';
import SearchPerson from '@/components/search-person/do.vue';
import SearchTown from '@/components/search-town/do.vue';
import MailchimpSignup from '@/components/mailchimp/do.vue';
import ReportForm from '@/components/report-form/do.vue';
import PollsPreview from '@/components/polls-preview/do.vue';
import SlovakiaBlock from '@/components/slovakia/do.vue';
import PartyPreview from '@/components/party-preview/do.vue';
import PartyPreviewTiny from '@/components/party-preview-tiny/do.vue';
import HomepageEp from '@/views/homepage/evropske-volby/do.vue';
import HomepageKz from '@/views/homepage/krajske-volby/do.vue';
import HomepageKv from '@/views/homepage/komunalni-volby/do.vue';
import HomepagePs from '@/views/homepage/snemovni-volby/do.vue';
import HomepageSenat from '@/views/homepage/senatni-volby/do.vue';
import ElectionResults from '@/views/history/volby/detail/do.vue';
import CtaGetAdmin from '@/components/cta/get-admin/do.vue';
import CtaQuestions from '@/components/cta/questions/do.vue';
import CtaSupport from '@/components/cta/support/do.vue';
import CtaSupportShort from '@/components/cta/support-short/do.vue';
import CtaGuide from '@/components/cta/guide/do.vue';
import CtaHowTo from '@/components/cta/howto/do.vue';
import log from '@/stores/enums/log';
import EventItem from '@/components/event-item/do.vue';
import PromoBlock from '@/components/cta/promo-block/do.vue';
import EngagementBlock from '@/components/engagement/block/do.vue';
import EditableSuggest from '@/components/editable/suggest/do.vue';
import PopUp from '@/components/pop-up/do.vue';
import HomepageSummary from '@/views/homepage/summary/do.vue';
import HeroMap from '@/components/hero-map/main/do.vue';

export default {
	name: 'layout-homepage',
	data: function () {
		return {
			cdn,
			eu2024: 'https://eu2024.programydovoleb.cz',
			today,
			width: window.innerWidth,
			log: {
				types: log,
				action: {
					add: '+',
					replace: '+',
					hide: '–',
					show: '+',
				}
			},
			enableNewsLoad: false
		}
	},
  components: {
	NewsItem, NewsItemAside, SearchParty, SearchPerson, SearchTown, MailchimpSignup, ReportForm, PollsPreview, SlovakiaBlock, PartyPreview, PartyPreviewTiny,
	HomepageEp, HomepageKz, HomepageKv, HomepagePs, HomepageSenat, ElectionResults, CtaGetAdmin, CtaSupport, PromoBlock, EngagementBlock, EventItem, CtaSupportShort,
	EditableSuggest, PopUp, CtaQuestions,
	CtaGuide, CtaHowTo, 
	HomepageSummary,
	HeroMap
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
		election_types: function () {
			return this.enums.elections;
		},
		news: function () {
			return this.enableNewsLoad ? this.$store.getters.pdv('news/weekly/' + this.today) : null;
		},
		newsmedia: function () {
			var res = [];

			if (this.news) {
				this.news.list.forEach(day => {
					day.sys.forEach(item => res.push(item));
					day.main.forEach(item => res.push(item));
					day.media.forEach(item => res.push(item));
				})
			}

			return res;
		},
		elections: function () {
			var d = this.$store.getters.pdv('elections/quicklist');

			// console.log(d);
			
			return d;
		},
		el161: function () {
			return this.$store.getters.pdv('elections/fetch/161');
		},
		polls: function () {
			var p = this.$store.getters.pdv('polls/last-6');

			if (!p) return null;

			var list = [];

			p.list.forEach(poll => {
				// poll.mid = new Date((new Date(poll.to || poll.datum).getTime() + new Date(poll.from || poll.datum).getTime()) / 2);
				list.push(poll);
			});

			// list.sort((a, b) => b.mid - a.mid);

			return {list};
		},
		parties: function () {
			return this.$store.getters.pdv('parties/1,5,7,47,53,166,1245,720,721,768,1114,1178,1227,1265,714');
		}
	},
  methods: {
		url,
		date,
		number,
		truncate,
		domain, 
		con,
		colorByItem,
		logoByItem,
		sortBy, sortEvents,
		unique, shuffle, untag,
		$getParty: function (hash) {
			var item = this.parties.list.find(x => x.hash === hash);

			if (!item) {
				item = this.parties.list.find(x => x.reg === hash);
			}

			if (!item) {
				item = this.parties.list.find(x => x.VSTRANA == hash);
			}

			if (!item && this.elections) {
				item = this.elections.cis.strany.find(x => x.VSTRANA == hash);
			}

			return item;
		},
		sortByPorCislo: function (list) {
			list.sort((a, b) => (a.PORCISLO || 1000) - (b.PORCISLO || 1000));

			return list;
		}
  },
  mounted: function () {
    window.scrollTo(0, 1);
    ga();
	setTimeout(() => {
		this.width = this.$el.getBoundingClientRect().width;
		window.addEventListener('resize', () => this.width = this.$el.getBoundingClientRect().width);
		this.enableNewsLoad = true;
	}, 500);
  }
};
