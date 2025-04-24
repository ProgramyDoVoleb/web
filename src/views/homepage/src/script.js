import {useData} from '@/stores/data';
import { useCore, cdn, today } from '@/stores/core';
import { useEnums } from '@/stores/enums';
import {url, date, number, truncate, domain, con, sortBy, unique} from '@/pdv/helpers';
import { colorByItem, logoByItem } from '@/components/results/helpers';
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
import HomepagePs from '@/views/homepage/snemovni-volby/do.vue';
import HomepageSenat from '@/views/homepage/senatni-volby/do.vue';
import ElectionResults from '@/views/obce/volby/detail/do.vue';
import CtaGetAdmin from '@/components/cta/get-admin/do.vue';
import CtaSupport from '@/components/cta/support/do.vue';
import log from '@/stores/enums/log';
import PromoBlock from '@/components/cta/promo-block/do.vue';
import EngagementBlock from '@/components/engagement/block/do.vue';

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
			}
		}
	},
  components: {
	NewsItem, NewsItemAside, SearchParty, SearchPerson, SearchTown, MailchimpSignup, ReportForm, PollsPreview, SlovakiaBlock, PartyPreview, PartyPreviewTiny,
	HomepageEp, HomepageKz, HomepagePs, HomepageSenat, ElectionResults, CtaGetAdmin, CtaSupport, PromoBlock, EngagementBlock
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
			return this.$store.getters.pdv('news/last50');
		},
		newsauto: function () {
			var list = [];

			// this.news.auto.push({
			// 	id: 4319,
			// 	volby: 162,
			// 	focus: 5,
			// 	datum: "2024-07-18",
			// 	title: "DSZ",
			// 	content: null,
			// 	label: null,
			// 	source: "https://karlovarsky.denik.cz/zpravy_region/volby-kraj-karlovarsky-kandidati-karlovy-vary.html",
			// 	relates: "csu_kz_rkl:1505,null,csu_cvs:715",
			// 	priority: 2,
			// 	user: 1
			// })

			if (this.news) {
				var dates = unique(this.news.auto, 'datum');

				dates.forEach(datum => {
					var o = {
						datum,
						list: {
							senat: this.news.auto.filter(x => x.datum === datum && x.relates.includes('csu_senat_rk')),
							ps: [],
							kz: []
						},
						pre: {
							kz: this.news.auto.filter(x => x.datum === datum && x.relates.includes('csu_kz_rkl')),
							ps: this.news.auto.filter(x => x.datum === datum && x.relates.includes('csu_ps_rkl'))
						}
					}

					unique(o.pre.kz, 'focus').forEach((focus, i1) => {
						unique(o.pre.kz.filter(x => x.focus === focus), 'content').forEach((content, i2) => {
							var k = {
								focus,
								content,
								list: o.pre.kz.filter(x => x.focus === focus && x.content === content).sort((a, b) => a.title.split(' ')[1].localeCompare(b.title.split(' ')[1], 'cs'))
							}

							o.list.kz.push(k);
						});
					})


					unique(o.pre.ps, 'content').forEach((content, i2) => {
						var k = {
							focus: null,
							content,
							list: o.pre.ps.filter(x => x.content === content).sort((a, b) => a.title.split(' ')[1].localeCompare(b.title.split(' ')[1], 'cs'))
						}

						o.list.ps.push(k);
					});

					list.push(o);
				});
			} 

			return list;
		},
		newsmedia: function () {
			var list = [];

			if (this.news) {
				// sortBy([].concat(this.news.list, this.news.sys), 'datum', null, true, true).forEach(item => {
				sortBy([].concat(this.news.sys, this.news.list, this.news.comm), 'datum', null, true, true).forEach(item => {
					list.push({
						source_label: item.source,
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

				list = sortBy(list, 'updated', null, true, true);
			}

			return list.filter((x,i) => i < 12);
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
		sortBy,
		unique,
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
	window.addEventListener('resize', () => this.width = window.innerWidth);
  }
};
