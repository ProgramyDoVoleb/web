import {useData} from '@/stores/data';
import { useCore, cdn } from '@/stores/core';
import { useEnums } from '@/stores/enums';
import {url, date, number, truncate, con, type, domain} from '@/pdv/helpers';
import {colorByItem, logoByItem} from '@/pdv/helpers';
import {ga, ge} from '@/pdv/analytics';
import NewsItem from '@/components/news-item/do.vue'
import NewsBlock from '@/components/news-block/do.vue'
import StatsTiny from '@/components/stats/stats-tiny/do.vue';
import ReportModal from '@/components/report-modal/do.vue';
import SearchParty from '@/components/search-party/do.vue'
import PartyInElections from '@/views/rejstrik/detail/detail/do.vue'
import PartyInUpcomingElections from '@/views/rejstrik/detail/upcoming/do.vue'
import PartyPolls from '@/components/party-polls/do.vue'

export default {
	name: 'layout-strana',
	props: ['cid'],
	data: function () {
		return {
			cdn,
			showHistory: false,
			showAll: false
		}
	},
  components: {
	NewsItem,
	NewsBlock,
	StatsTiny,
	ReportModal,
	SearchParty,
	PartyInElections,
	PartyInUpcomingElections,
	PartyPolls
  },
	computed: {
		id: function () {
			return String(this.cid).split('-')[0];
		},
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
		data: function () {
			var d = this.$store.getters.pdv('party/fetch/' + this.id);

			if (d) {
				ga(d.list[0].$core[0].NAZEV);

				if (d.list[0].$data.mvcr) {
					d.list[0].$data.mvcr.forEach(item => {
						item.valueParsed = JSON.parse(item.value);
					});
				}
			}
			return d;
		},
		news: function () {
			return this.$store.getters.pdv('news/party/' + this.id);
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
		upcoming: function () {
			return this.$store.getters.pdv('party/upcoming/' + this.id);
		},
		history: function () {
			return this.$store.getters.pdv('party/history/' + this.id);
		},
		$elections: function () {
			return this.history ? this.history.list[0].$elections : null;
		},
		$main: function () {
			return this.data ? this.data.list[0] : null
		},
		$full: function () {
			return this.history ? this.history.list[0] : null
		},
		$meta: function () {
			return this.data ? this.data.list[0].$data : null
		},
		cis: function () {
			return this.data ? this.data.cis : null
		},
		reverseHistory: function () {
			var arr = [];

			if (this.data) {
				this.data.list[0].$core.forEach(x => arr.push(x));
			}

			arr.reverse();

			return arr;
		},
		links: function () {
			var arr = [];

			if (this.$meta) {
				['web', 'wiki', 'social'].forEach(type => {
					if (this.$meta[type]) {
						this.$meta[type].filter(x => !x.kraj).forEach(x => {
							if (!arr.find(y => y.value === x.value || domain(y.value) === domain(x.value))) arr.push(x);
						});
					}
				});
			}

			arr.sort((a, b) => a.type.localeCompare(b.type, 'cs'));

			return arr;
		}
	},
  methods: {
		url,
		date,
		number,
		truncate,
		con,
		type,
		domain,
		colorByItem,
		logoByItem,
		statsGraph: function (list, label) {
			var arr = [];

			list.forEach(item => {
				arr.push({
					label: Number(item.$volby.datum.split('-').join('')),
					value: item.$stats[label]
				})
			})

			arr.reverse();

			return {values: arr};
		},
		click_showHistory: function () {
			this.showHistory = true;
			ge({event: 'history', value: this.id});
		},
		sortByDate: function (list) {
			list.sort((a, b) => a.updated.localeCompare(b.updated, 'cs'));

			return list;
		}
  },
  mounted: function () {
    window.scrollTo(0, 1);
  },
  watch: {
	id: function () {
		window.scrollTo(0, 1);
	}
  } 
};
