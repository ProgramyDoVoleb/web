import {date, number, truncate, indicator, untag, domain, sortBy, sortEvents, unique} from "@/pdv/helpers";
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

export default {
	name: 'NewsDailyItem',
	props: ['datum'],
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
		PopUp
	},
	methods: {
		date, number, truncate, indicator, untag, domain, sortBy, unique, sortEvents,
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
		}
	},
	computed: {
		$store: function () {
			return useData()
		},
		news: function () {
			return this.$store.getters.pdv('news/daily/' + this.datum)
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
	},
	mounted: function () {

	}
};
