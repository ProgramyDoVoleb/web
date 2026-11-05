import {date, number, truncate, indicator, untag, domain, sortBy, sortEvents, unique, getMedia, isWoman} from "@/pdv/helpers";
import { colorByItem, logoByItem } from '@/pdv/helpers';
import NewsItem from '@/components/news-item/do.vue'
import PollsPreview from '@/components/polls-preview/do.vue';
import CtaSupport from '@/components/cta/support/do.vue';
import CtaSupportShort from '@/components/cta/support-short/do.vue';
import MailchimpSignup from '@/components/mailchimp/do.vue';
import ReportForm from '@/components/report-form/do.vue';
import EventItem from '@/components/event-item/do.vue';
import PopUp from '@/components/pop-up/do.vue';
import EditableSuggest from '@/components/editable/suggest/do.vue';
import logtypes from '@/stores/enums/log';
import {useData} from '@/stores/data';
import {today, dayAfterDiffFrom, cdn} from '@/stores/core';
import {ga} from '@/pdv/analytics';
import { useEnums } from '@/stores/enums';
import NewsMap from '@/components/news-map/do.vue';
import EngagementSupport from '@/components/engagement/support/do.vue';

export default {
	name: 'NewsDailyItem',
	props: ['datum', 'prefetch'],
	data: function () {
		return {
			cdn,
			logtypes,
			today,
			enums: useEnums()
		}
	},
	components: {
		NewsItem,
		PollsPreview,
		CtaSupport, CtaSupportShort,
		MailchimpSignup,
		ReportForm,
		EditableSuggest,
		EventItem,
		PopUp,
		NewsMap,
		EngagementSupport
	},
	methods: {
		date, number, truncate, indicator, untag, domain, sortBy, unique, sortEvents, getMedia, isWoman,
		colorByItem, logoByItem,
		dayAfterDiffFrom,
		sortByPrijmeni: function (list, desc) {
			var arr = [];
			list.forEach(x => arr.push(x));

			arr.sort((a, b) => (a.node['PRIJMENI'] || '').localeCompare((b.node['PRIJMENI'] || ''), 'cs'));

			return arr;
		},
		changeDate: function (toDate) {
			this.datum = toDate;
			window.scrollTo(0, 1);
		},
		answersCount: function (itemparty) {
			var list = itemparty.data.filter(x => x.type === 'answer' && x.node.question > 389);
			
			var list2 = unique(list.map(x => [x.node.question]), 0);

			return list2.length;
		}
	},
	computed: {
		$store: function () {
			return useData()
		},
		news: function () {
			return this.prefetch || this.$store.getters.pdv('news/daily/' + this.datum)
		},
		nearEvents: function () {
			var arr = [];

			if (this.news) {
				var nextEvents = sortEvents(this.news.events, true);
				
				var thisDay = new Date(today);
				var nearDay = new Date(thisDay.setDate(thisDay.getDate() + 3)).toISOString().split('T')[0];

				nextEvents.forEach(ev => {
					var dates = JSON.parse(ev.label);
					if (dates[0] < nearDay) {
						arr.push(ev);
					}
				});
			}

			return arr;
		},
		links: function () {

			if (!this.news) return [];
				
			var day = this.news.list[0];
			var list = [].concat(day.fullprogram.map(x => x.source || 'https://programydovoleb.cz/bod/' + x.csu_table + '/' + x.csu_id + '/volebni-program/' + x.id), day.sys.map(x => 'https://programydovoleb.cz/novinky/' + x.id), day.main.map(x => x.source), day.auto.map(x => x.source), day.comm.map(x => x.source), day.media.map(x => x.source), day.events.map(x => x.source), day.polls.map(x => x.link));

			day.log.forEach(item => {
				if (item.data) {
					item.data.forEach(d => {
						if (d.node && d.node.source) list.push(d.node.source);
					});
				}
			});

			var filteredList = list.filter(x => x != null);
			var ownList = filteredList.map(x => [x].map(x => x.includes('https://admin.programydovoleb.cz/vlastni-zaznam') ? 'https://admin.programydovoleb.cz/vlastni-zaznam' : x)); 
			var uniqueList = unique(ownList, 0);
			
			uniqueList.sort((a, b) => a.localeCompare(b, 'cs'));

			return uniqueList;
		}
	},
	mounted: function () {

	}
};
